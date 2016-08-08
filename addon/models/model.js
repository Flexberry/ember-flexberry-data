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
  */
  didLoad() {
    this._super(...arguments);
    this._saveCanonicalBelongsTo();
  },

  /**
  */
  didUpdate() {
    this._super(...arguments);
    this._saveCanonicalBelongsTo();
  },

  /**
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
