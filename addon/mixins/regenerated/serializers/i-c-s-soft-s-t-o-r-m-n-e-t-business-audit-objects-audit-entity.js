import Ember from 'ember';

export let Serializer = Ember.Mixin.create({
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
