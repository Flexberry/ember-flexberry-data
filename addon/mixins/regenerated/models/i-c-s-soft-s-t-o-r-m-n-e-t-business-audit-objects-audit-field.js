import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import { attr, belongsTo } from '../../../utils/attributes';

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
    field: attr(''),
    oldValue: attr(''),
    newValue: attr(''),
  });

  model.defineProjection('AuditFieldE', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', {
    field: attr('Поле', { hidden: true }),
    caption: attr('Имя поля'),
    oldValue: attr('Старое значение'),
    newValue: attr('Новое значение'),
    mainChange: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', '', {
    }, { hidden: true }),
  });
};
