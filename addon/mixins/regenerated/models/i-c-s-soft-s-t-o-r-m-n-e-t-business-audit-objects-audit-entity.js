import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import { attr, belongsTo, hasMany } from '../../../utils/attributes';

export let Model = Mixin.create({
  objectPrimaryKey: DS.attr('string'),
  operationTime: DS.attr('date'),
  operationType: DS.attr('string'),
  executionResult: DS.attr('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-execution-variant'),
  source: DS.attr('string'),
  serializedField: DS.attr('string'),
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  user: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', { inverse: null, async: false }),
  objectType: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', { inverse: null, async: false }),
  auditFields: DS.hasMany('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', { inverse: 'auditEntity', async: false }),
});

export let defineProjections = function (model) {
  model.defineProjection('AuditEntityE', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
    objectPrimaryKey: attr('Идентификатор'),
    objectType: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', '', {
      name: attr('Тип объекта'),
    }, { hidden: true }),
    operationTime: attr('Время операции'),
    operationType: attr('Тип операции'),
    executionResult: attr('Результат'),
    source: attr('Источник'),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Имя', {
      name: attr('Имя'),
      login: attr('Логин'),
    }, { hidden: true }),
    createTime: attr('Создание'),
    creator: attr('Создатель'),
    editTime: attr('Редактирование'),
    editor: attr('Редактор'),
    auditFields: hasMany('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', 'Изменения', {
      field: attr('Поле', { hidden: true }),
      caption: attr('Имя поля'),
      oldValue: attr('Старое значение'),
      newValue: attr('Новое значение'),
      mainChange: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', '', {

      }, { hidden: true }),
    }),
  });

  model.defineProjection('AuditEntityL', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
    objectPrimaryKey: attr('Идентификатор'),
    objectType: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', '', {
      name: attr('Тип объекта'),
    }, { hidden: true }),
    operationTime: attr('Время операции'),
    operationType: attr('Тип операции'),
    executionResult: attr('Результат'),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Инициатор', {
      name: attr('Инициатор'),
    }, { hidden: true }),
    source: attr('Источник'),
  });

  model.defineProjection('AuditEntityUpdateView', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
    operationTime: attr(''),
    executionResult: attr(''),
    auditFields: hasMany('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', '', {
      field: attr(''),
      oldValue: attr(''),
      newValue: attr(''),
    })
  });

  model.defineProjection('ConstructNotStoredAttr', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
    objectPrimaryKey: attr(''),
    operationTime: attr(''),
    operationType: attr(''),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      name: attr(''),
    }, { hidden: true }),
    executionResult: attr(''),
  });
};
