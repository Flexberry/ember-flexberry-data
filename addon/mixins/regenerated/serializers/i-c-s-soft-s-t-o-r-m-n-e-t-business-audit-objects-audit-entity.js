import Mixin from '@ember/object/mixin';

export let Serializer = Mixin.create({
  attrs: {
    user: { serialize: 'odata-id', deserialize: 'records' },
    objectType: { serialize: 'odata-id', deserialize: 'records' },
    auditFields: { serialize: false, deserialize: 'records' },
  },

  /**
    Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey',
});
