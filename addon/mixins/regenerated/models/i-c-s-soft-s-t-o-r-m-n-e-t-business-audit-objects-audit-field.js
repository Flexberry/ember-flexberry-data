import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

export let Model = Mixin.create({
  field: DS.attr('string'),
  caption: DS.attr('string'),
  oldValue: DS.attr('string'),
  newValue: DS.attr('string'),
  mainChange: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', { inverse: null, async: false }),
  auditEntity: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', { inverse: 'auditFields', async: false }),
});

export let defineProjections = function (model) {
  model.defineProjection('AuditEntityUpdateView', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', {
    field: Projection.attr(''),
    oldValue: Projection.attr(''),
    newValue: Projection.attr(''),
  });

  model.defineProjection('AuditFieldE', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', {
    field: Projection.attr('Поле', { hidden: true }),
    caption: Projection.attr('Имя поля'),
    oldValue: Projection.attr('Старое значение'),
    newValue: Projection.attr('Новое значение'),
    mainChange: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', '', {
    }, { hidden: true }),
  });
};
