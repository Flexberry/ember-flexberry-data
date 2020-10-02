import Ember from 'ember';
import DS from 'ember-data';
import ModelWithoutValidation from './model-without-validation';
import EmberValidations from 'ember-validations';

/**
  Base model that supports projections, validations and copying.

  @module ember-flexberry-data
  @class Model
  @namespace Projection
  @extends ModelWithoutValidation
  @uses EmberValidationsMixin

  @event preSave
  @param {Object} event Event object
  @param {Promise[]} promises Array to which custom 'preSave' promises could be pushed

  @public
 */
var Model = ModelWithoutValidation.extend(EmberValidations, {
  /**
    Model validation rules.

    @property validations
    @type Object
    @default {}
  */
  validations: {},

  /**
    Checks that model satisfies validation rules defined in 'validations' property.

    @method validate
    @param {Object} [options] Method options
    @param {Boolean} [options.validateDeleted = true] Flag: indicates whether to validate model, if it is deleted, or not
    @return {Promise} A promise that will be resolved if model satisfies validation rules defined in 'validations' property
  */
  validate(options) {
    options = Ember.merge({ validateDeleted: true }, options || {});
    if (options.validateDeleted === false && this.get('isDeleted')) {
      // Return resolved promise, because validation is unnecessary for deleted model.
      return new Ember.RSVP.Promise((resolve) => {
        resolve();
      });
    }

    // Validate model.
    let validationPromises = {
      base: this._super(options)
    };

    let hasManyRelationships = Ember.A();
    this.eachRelationship((name, attrs) => {
      if (attrs.kind === 'hasMany') {
        hasManyRelationships.pushObject(attrs.key);
      }
    });

    // Validate hasMany relationships.
    hasManyRelationships.forEach((relationshipName) => {
      let details = this.get(relationshipName);
      if (!Ember.isArray(details)) {
        details = Ember.A();
      }

      details.forEach((detailModel, i) => {
        validationPromises[relationshipName + '.' + i] = detailModel.validate(options);
      });
    });

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.RSVP.hash(validationPromises).then((hash) => {
        resolve(this.get('errors'));
      }).catch((reason) => {
        reject(this.get('errors'));
      });
    });
  },

  /**
    Validates model, triggers 'preSave' event, and finally saves model.

    @method save

    @param {Object} [options] Method options
    @param {Boolean} [options.softSave = false] Flag: indicates whether following 'save' will be soft
    (without sending a request to server) or not
    @return {Promise} A promise that will be resolved after model will be successfully saved
  */
  save(options) {
    options = Ember.merge({ softSave: false }, options || {});

    return new Ember.RSVP.Promise((resolve, reject) => {
      // If we are updating while syncing up then checking of validation rules should be skipped
      // because they can be violated by unfilled fields of model.
      let promise = this.get('isSyncingUp') && this.get('dirtyType') === 'updated' ?
        Ember.RSVP.resolve() : this.validate({ validateDeleted: false });
      promise.then(() => this.beforeSave(options)).then(() => {
        // Call to base class 'save' method with right context.
        // The problem is that call to current save method will be already finished,
        // and traditional _this._super will point to something else, but not to DS.Model 'save' method,
        // so there is no other way, except to call it through the base class prototype.
        if (!options.softSave) {
          return DS.Model.prototype.save.call(this, options);
        }
      }).then(value => {
        // Assuming that record is not updated during sync up;
        this.set('isUpdatedDuringSyncUp', false);

        // Model validation was successful (model is valid or deleted),
        // all 'preSave' event promises has been successfully resolved,
        // finally model has been successfully saved,
        // so we can resolve 'save' promise.
        resolve(value);
      }).catch(reason => {
        // Any of 'validate', 'beforeSave' or 'save' promises has been rejected,
        // so we should reject 'save' promise.
        reject(reason);
      });
    });
  },

  /**
    Initializes model.
  */
  init() {
    this._super(...arguments);

    // Attach validation observers for hasMany relationships.
    this.eachRelationship((name, attrs) => {
      if (attrs.kind !== 'hasMany') {
        return;
      }

      let detailsName = attrs.key;
      Ember.addObserver(this, `${detailsName}.[]`, this, this._onChangeHasManyRelationship);
      Ember.addObserver(this, `${detailsName}.@each.isDeleted`, this, this._onChangeHasManyRelationship);
    });
  },

  /**
    Destroys model.
  */
  willDestroy() {
    this._super(...arguments);

    // Detach validation observers for hasMany relationships.
    this.eachRelationship((name, attrs) => {
      if (attrs.kind !== 'hasMany') {
        return;
      }

      let detailsName = attrs.key;
      Ember.removeObserver(this, `${detailsName}.[]`, this, this._onChangeHasManyRelationship);
      Ember.removeObserver(this, `${detailsName}.@each.isDeleted`, this, this._onChangeHasManyRelationship);
    });
  },

  /**
    Observes & handles changes in each hasMany relationship.

    @method _onChangeHasManyRelationship
    @param {Object} changedObject Reference to changed object.
    @param {changedPropertyPath} changedPropertyPath Path to changed property.
    @private
  */
  _onChangeHasManyRelationship(changedObject, changedPropertyPath) {
    Ember.run.once(this, '_aggregateHasManyRelationshipValidationErrors', changedObject, changedPropertyPath);
  },

  /**
    Aggregates validation error messages for hasMany relationships.

    @method _aggregateHasManyRelationshipValidationErrors
    @param {Object} changedObject Reference to changed object.
    @param {changedPropertyPath} changedPropertyPath Path to changed property.
    @private
  */
  _aggregateHasManyRelationshipValidationErrors(changedObject, changedPropertyPath) {
    // Retrieve aggregator's validation errors object.
    let errors = Ember.get(this, 'errors');

    let detailsName = changedPropertyPath.split('.')[0];
    let details = Ember.get(this, detailsName);
    if (!Ember.isArray(details)) {
      return;
    }

    // Collect each detail's errors object into single array of error messages.
    let detailsErrorMessages = Ember.A();
    details.forEach((detail, i) => {
      let detailErrors = Ember.get(detail, 'errors');

      for (let detailPropertyName in detailErrors) {
        let detailPropertyErrorMessages = detailErrors[detailPropertyName];
        if (detailErrors.hasOwnProperty(detailPropertyName) && Ember.isArray(detailPropertyErrorMessages)) {
          detailPropertyErrorMessages.forEach((detailPropertyErrorMessage) => {
            Ember.removeObserver(this, `${detailsName}.@each.${detailPropertyName}`, this, this._onChangeHasManyRelationship);

            if (!Ember.get(detail, 'isDeleted')) {
              Ember.addObserver(this, `${detailsName}.@each.${detailPropertyName}`, this, this._onChangeHasManyRelationship);
              detailsErrorMessages.pushObject(detailPropertyErrorMessage);
            }
          });
        }
      }
    });

    // Remember array of error messages in aggregator's errors object.
    Ember.set(errors, detailsName, detailsErrorMessages);
  },
});

export default Model;
