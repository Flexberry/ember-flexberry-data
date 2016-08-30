import Ember from 'ember';
import DS from 'ember-data';
import createProj from '../utils/create';
import EmberValidations from 'ember-validations';

/**
 * Model that supports projections.
 *
 * @module ember-flexberry-data
 * @class Model
 * @namespace Projection
 * @extends DS.Model
 * @public
 */
var Model = DS.Model.extend(EmberValidations, Ember.Evented, {
  /**
    Stored canonical `belongsTo` relationships.

    @property _canonicalBelongsTo
    @type Object
    @private
  */
  _canonicalBelongsTo: Ember.computed(() => ({})),

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

    // Return normal validation promise without any additional logic.
    return this._super(...arguments);
  },

  /**
    Triggers model's 'preSave' event & allows to execute some additional async logic before model will be saved.

    @method beforeSave

    @param {Object} [options] Method options
    @param {Boolean} [options.softSave = false] Flag: indicates whether following 'save' will be soft
    (without sending a request to server) or not
    @param {Promise[]} [options.promises] Array to which 'preSave' event handlers could add some asynchronous operations promises
    @return {Promise} A promise that will be resolved after all 'preSave' event handlers promises will be resolved
  */
  beforeSave(options) {
    options = Ember.merge({ softSave: false, promises: [] }, options || {});

    return new Ember.RSVP.Promise((resolve, reject) => {
      // Trigger 'preSave' event, and  give its handlers possibility to run some 'preSave' asynchronous logic,
      // by adding it's promises to options.promises array.
      this.trigger('preSave', options);

      // Promises array could be totally changed in 'preSave' event handlers, we should prevent possible errors.
      options.promises = Ember.isArray(options.promises) ? options.promises : [];
      options.promises = options.promises.filter(function(item) {
        return item instanceof Ember.RSVP.Promise;
      });

      Ember.RSVP.all(options.promises).then(values => {
        resolve(values);
      }).catch(reason => {
        reject(reason);
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
      this.validate({
        validateDeleted: false
      }).then(() => this.beforeSave(options)).then(() => {
        // Call to base class 'save' method with right context.
        // The problem is that call to current save method will be already finished,
        // and traditional _this._super will point to something else, but not to Projection.Model 'save' method,
        // so there is no other way, except to call it through the base class prototype.
        if (!options.softSave) {
          return this.prototype.save.call(this, options);
        }
      }).then(value => {
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
    Turns model into 'updated.uncommitted' state.

    Transition into the `updated.uncommitted` state
    if the model in the `saved` state (no local changes).
    Alternative: this.get('currentState').becomeDirty();

    @method makeDirty
  */
  makeDirty() {
    this.send('becomeDirty');
  },

  /**
    Return object with changes.

    Object will have structure:
    * key - is name relationships that has changed
      * array - include two array, array with index `0` this old values, array with index `1` this new values.


    @example
      ```javascript
      {
        key: [
          [oldValues],
          [newValues],
        ],
      }
      ```

    @method changedHasMany
    @return {Object} Object with changes, empty object if no change.
  */
  changedHasMany() {
    let _this = this;
    let changedHasMany = {};
    _this.eachRelationship((key, { kind }) => {
      if (kind === 'hasMany') {
        if (_this.get(key).filterBy('hasDirtyAttributes', true).length) {
          changedHasMany[key] = [
            _this.get(`${key}.canonicalState`).map(internalModel => internalModel.record),
            _this.get(`${key}.currentState`).map(internalModel => internalModel.record),
          ];
        }
      }
    });
    return changedHasMany;
  },

  /**
    Rollback changes for `hasMany` relationships.

    @method rollbackHasMany
    @param {String} [forOnlyKey] If specified, it is rollback invoked for relationship with this key.
  */
  rollbackHasMany(forOnlyKey) {
    let _this = this;
    _this.eachRelationship((key, { kind }) => {
      if (kind === 'hasMany' && (!forOnlyKey || forOnlyKey === key)) {
        if (_this.get(key).filterBy('hasDirtyAttributes', true).length) {
          [_this.get(`${key}.canonicalState`), _this.get(`${key}.currentState`)].forEach((state, i) => {
            let records = state.map(internalModel => internalModel.record);
            records.forEach((record) => {
              record.rollbackAll();
            });
            if (i === 0) {
              _this.set(key, records);
            }
          });
        }
      }
    });
  },

  /**
    Return object with changes.

    Object will have structure:
    * key - is name relationships that has changed
      * array - include two items, old value, with index `0`, and new value, with index `1`.

    @example
      ```javascript
      {
        key: [oldValue, newValue],
      }
      ```

    @method changedBelongsTo
    @return {Object} Object with changes, empty object if no change.
  */
  changedBelongsTo() {
    let _this = this;
    let changedBelongsTo = {};
    _this.eachRelationship((key, { kind }) => {
      if (kind === 'belongsTo') {
        let current = _this.get(key);
        let canonical = _this.get('_canonicalBelongsTo')[key] || null;
        if (current !== canonical) {
          changedBelongsTo[key] = [canonical, current];
        }
      }
    });
    return changedBelongsTo;
  },

  /**
    Rollback changes for `belongsTo` relationships.

    @method rollbackBelongsTo
    @param {String} [forOnlyKey] If specified, it is rollback invoked for relationship with this key.
  */
  rollbackBelongsTo(forOnlyKey) {
    let _this = this;
    _this.eachRelationship((key, { kind, options }) => {
      if (kind === 'belongsTo' && (!forOnlyKey || forOnlyKey === key)) {
        let current = _this.get(key);
        let canonical = _this.get('_canonicalBelongsTo')[key] || null;
        if (current !== canonical) {
          if (options.inverse && options.inverse !== key) {
            current.rollbackBelongsTo(options.inverse);
          }

          _this.set(key, canonical);
        }
      }
    });
  },

  /**
    Rollback changes for all relationships.

    @method rollbackRelationships
  */
  rollbackRelationships() {
    this.rollbackBelongsTo();
    this.rollbackHasMany();
  },

  /**
    Rollback all changes.

    @method rollbackAll
  */
  rollbackAll() {
    this.rollbackRelationships();
    this.rollbackAttributes();
  },

  /**
    Fired when the record is loaded from the server.
    [More info](http://emberjs.com/api/data/classes/DS.Model.html#event_didLoad).

    @method didLoad
  */
  didLoad() {
    this._super(...arguments);
    this._saveCanonicalBelongsTo();
  },

  /**
    Fired when the record is updated.
    [More info](http://emberjs.com/api/data/classes/DS.Model.html#event_didUpdate).

    @method didUpdate
  */
  didUpdate() {
    this._super(...arguments);
    this._saveCanonicalBelongsTo();
  },

  /**
    Set each `belongsTo` relationship, observer, that save canonical state.

    @method _saveCanonicalBelongsTo
    @private
  */
  _saveCanonicalBelongsTo() {
    let _this = this;
    _this.eachRelationship((key, { kind, options }) => {
      if (kind === 'belongsTo') {
        if (options.async === false) {
          let belongsToValue = _this.get(key);
          if (belongsToValue) {
            _this.get('_canonicalBelongsTo')[key] = belongsToValue;
          } else {
            _this.addObserver(key, _this, _this._saveBelongsToObserver);
          }
        } else {
          _this.get(key).then((record) => {
            _this.get('_canonicalBelongsTo')[key] = record;
          });
        }
      }
    });
  },

  /**
    Save canonical state for `belongsTo` relationships.

    @method _saveBelongsToObserver
    @private

    @param {DS.Model} sender
    @param {String} key
  */
  _saveBelongsToObserver(sender, key) {
    sender.get('_canonicalBelongsTo')[key] = sender.get(key);
    sender.removeObserver(key, this, this._saveBelongsToObserver);
  },
});

Model.reopenClass({
  /**
   * Defined projections for current model type.
   *
   * @property projections
   * @type Ember.Object
   * @default null
   * @public
   * @static
   */
  projections: null,

  /**
   * Defines projection for specified model type.
   *
   * @method defineProjection
   * @param {String} projectionName Projection name, eg 'EmployeeE'.
   * @param {String} modelName The name of the model type.
   * @param {Object} attributes Projection attributes.
   * @return {Object} Created projection.
   * @public
   * @static
   */
  defineProjection: function (projectionName, modelName, attributes) {
    let proj = createProj(modelName, attributes, projectionName);

    if (!this.projections) {
      this.reopenClass({
        projections: Ember.Object.create()
      });
    }

    this.projections.set(projectionName, proj);
    return proj;
  }
});

export default Model;
