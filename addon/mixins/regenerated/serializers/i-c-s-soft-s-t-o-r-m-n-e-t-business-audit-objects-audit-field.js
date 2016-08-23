import Ember from 'ember';

export let Serializer = Ember.Mixin.create({
  attrs: {
    mainChange: { serialize: 'odata-id', deserialize: 'records' },
    auditEntity: { serialize: 'odata-id', deserialize: 'records' },
  },

  /**
    Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey',
});
