import Mixin from '@ember/object/mixin';

export let Serializer = Mixin.create({
  attrs: {
    group: { serialize: 'odata-id', deserialize: 'records' },
    user: { serialize: 'odata-id', deserialize: 'records' },
  },

  /**
    Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey',
});
