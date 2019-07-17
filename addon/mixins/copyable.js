import Mixin from '@ember/object/mixin'
import { typeOf, isNone } from '@ember/utils';
import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { isArray } from '@ember/array';
import generateUniqueId from '../utils/generate-unique-id';

/**
  Mixin for base model to support creating record by prototype.

  @module ember-flexberry-data
  @class CopyableMixin
  @extends Ember.Mixin
*/
export default Mixin.create({
  /**
    The default projection name to be used when creating record by prototype.

    @property prototypeProjection
    @type String
   */
  prototypeProjection: undefined,

  /**
    Creates a new record using base model instance with the specified
    or default projection as prototype.

    @method copy
    @param {String} prototypeProjection Optional projection name to be used when creating record by prototype.
    @return {Promise} promise
  */
  copy(prototypeProjection) {
    if (isNone(prototypeProjection)) {
      prototypeProjection = this.get('prototypeProjection');
    }

    assert('Prototype projection is undefined.', prototypeProjection);

    let argumentType = typeOf(prototypeProjection);
    assert(`Wrong type of \`prototypeProjection\` argument: actual type is ${argumentType}, but string is expected.`,
    argumentType === 'string');

    assert(`Projection with \`${prototypeProjection}\` name is not found in the model.`,
    !isNone(this.get('constructor.projections')[prototypeProjection]));

    let store = this.get('store');
    let modelName = this.get('constructor.modelName');

    let promise = store.findRecord(modelName, this.id, { reload: true, projection: prototypeProjection }).then((prototype) => {
      return prototype._getCopy();
    });

    return promise;
  },

  _getCopy(aggregatorMeta) {
    let store = this.get('store');
    let modelName = this.get('constructor.modelName');

    let record = store.createRecord(modelName, { id: generateUniqueId() });

    this.eachAttribute(name => {
      let value = this.get(name);
      record.set(name, value);
    });

    this.eachRelationship((name, meta) => {
      let key = meta.key;

      if (meta.kind === 'belongsTo') {
        // Skip copying the aggregator value for the nested detail.
        let inverse = get(meta, 'options.inverse');
        if (aggregatorMeta && aggregatorMeta.type === meta.type && aggregatorMeta.key === inverse) {
          return;
        }

        let value = this.get(key);
        record.set(key, value);

        return;
      }

      let values = this.get(key);
      if (isArray(values)) {
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
