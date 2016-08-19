import DS from 'ember-data';

export default DS.Model.extend({
  field: DS.attr('string'),
  caption: DS.attr('string'),
  oldValue: DS.attr('string'),
  newValue: DS.attr('string'),
  mainChange: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', { inverse: null, async: false }),
  auditEntity: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', { inverse: 'auditFields', async: false }),
});
