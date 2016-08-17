import DS from 'ember-data';

export default DS.Model.extend({
  field: DS.attr('string'),
  caption: DS.attr('string'),
  oldValue: DS.attr('string'),
  newValue: DS.attr('string'),
  mainChange: DS.belongsTo('audit-field', { inverse: null, async: false }),
  auditEntity: DS.belongsTo('audit-entity', { inverse: 'auditFields', async: false }),
});
