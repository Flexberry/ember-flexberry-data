import DS from 'ember-data';

export default DS.Model.extend({
  objectPrimaryKey: DS.attr('string'),
  operationTime: DS.attr('date'),
  operationType: DS.attr('string'),
  executionResult: DS.attr('string', { defaultValue: 'Unexecuted' }),
  source: DS.attr('string'),
  serializedField: DS.attr('string'),
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  objectType: DS.attr('string'),
  auditFields: DS.hasMany('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', { inverse: 'auditEntity', async: false }),
});
