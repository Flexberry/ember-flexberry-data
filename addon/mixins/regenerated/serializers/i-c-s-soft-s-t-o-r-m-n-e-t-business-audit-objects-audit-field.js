import Mixin from '@ember/object/mixin';

export let Serializer = Mixin.create({
  attrs: {
    mainChange: { serialize: 'odata-id', deserialize: 'records' },
    auditEntity: { serialize: 'odata-id', deserialize: 'records' },
  },

  /**
    Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey',
});
