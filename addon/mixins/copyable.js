import Ember from 'ember';

/**
 * Mixin for base model to support creating record by prototype.
 *
 * @module ember-flexberry-data
 * @class CopyableMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
  /**
    The prototype projection to be used when creating record by prototype.

    @property prototypeProjection
    @type String
   */
  prototypeProjection: undefined,

  /**
    Creates the new record using base model instance in the specified projection as prototype.

    @method copy
    @param {String} prototypeProjection
    @return {Promise} promise
  */
  copy(prototypeProjection) {
    if (prototypeProjection === undefined) {
      prototypeProjection = this.get('prototypeProjection');
    }

    let argumentType = Ember.typeOf(prototypeProjection);
    Ember.assert(`Wrong type of \`prototypeProjection\` argument: actual type is ${argumentType}, but string is expected.`,
    argumentType === 'string');

    Ember.assert('Prototype projection is undefined.', prototypeProjection);

    let store = this.get('store');
    let modelName = this.get('constructor.modelName');

    let promise = store.findRecord(modelName, this.id, { reload: true, projection: prototypeProjection }).then((prototype) => {
      return prototype._getCopy();
    });

    return promise;
  },

  _getCopy(aggregatorMeta = null) {
    let store = this.get('store');
    let modelName = this.get('constructor.modelName');

    let record = store.createRecord(modelName);

    this.eachAttribute(name => {
      let value = this.get(name);
      record.set(name, value);
    });

    this.eachRelationship((name, meta) => {
      let key = meta.key;

      if (meta.kind === 'belongsTo') {
        // Skip the aggregator value copying for the nested detail.
        let inverse = Ember.get(meta, 'options.inverse');
        if (!aggregatorMeta ||
            !(inverse && meta.type === aggregatorMeta.type && inverse === aggregatorMeta.key)) {
          let value = this.get(key);
          record.set(key, value);
        }

        return;
      }

      let values = this.get(key);
      if (values) {
        values.forEach(prototype => {
          let m = { key: key, type: modelName };
          let detail = prototype._getCopy(m);
          record.get(key).pushObject(detail);
        });
      }
    });

    return record;
  },
});
