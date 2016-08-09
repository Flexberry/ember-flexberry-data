import Ember from 'ember';
import DS from 'ember-data';
import createProj from '../utils/create';

/**
 * Model that supports projections.
 *
 * @module ember-flexberry-data
 * @class Model
 * @namespace Projection
 * @extends DS.Model
 * @public
 */
var Model = DS.Model.extend({
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
    _this.eachRelationship((key, { kind, options }) => {
      if (kind === 'hasMany' && (!forOnlyKey || forOnlyKey === key)) {
        if (_this.get(key).filterBy('hasDirtyAttributes', true).length) {
          [_this.get(`${key}.canonicalState`), _this.get(`${key}.currentState`)].forEach((state, i) => {
            let records = state.map(internalModel => internalModel.record);
            records.forEach((record) => {
              record.rollbackAttributes();
              if (options.inverse) {
                record.rollbackBelongsTo(options.inverse);
              }
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
        let canonical = _this.get('canonicalBelongsTo')[key];
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
        let canonical = _this.get('canonicalBelongsTo')[key];
        if (current !== canonical) {
          if (options.inverse) {
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
    _this.eachRelationship((key, { kind }) => {
      if (kind === 'belongsTo') {
        _this.addObserver(key, _this, _this._saveBelongsToObserver);
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
    let canonicalBelongsTo = sender.get('canonicalBelongsTo') || {};
    canonicalBelongsTo[key] = sender.get(key);
    sender.set('canonicalBelongsTo', canonicalBelongsTo);
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
