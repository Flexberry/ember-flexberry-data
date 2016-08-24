import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

export let Model = Ember.Mixin.create({
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
  validations: {
    objectPrimaryKey: { presence: true },
    operationTime: { datetime: true },
    operationType: { presence: true },
    executionResult: { presence: true },
    source: { presence: true },
    user: { presence: true },
    objectType: { presence: true },
  },
});

export let defineProjections = function (model) {
  model.defineProjection('AuditEntityE', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
    objectPrimaryKey: Projection.attr('Идентификатор'),
    objectType: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', '', {
      name: Projection.attr('Тип объекта'),
    }, { hidden: true }),
    operationTime: Projection.attr('Время операции'),
    operationType: Projection.attr('Тип операции'),
    executionResult: Projection.attr('Результат'),
    source: Projection.attr('Источник'),
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Имя', {
      name: Projection.attr('Имя'),
      login: Projection.attr('Логин'),
    }, { hidden: true }),
    createTime: Projection.attr('Создание'),
    creator: Projection.attr('Создатель'),
    editTime: Projection.attr('Редактирование'),
    editor: Projection.attr('Редактор'),
    auditFields: Projection.hasMany('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', 'Изменения', {
      field: Projection.attr('Поле', { hidden: true }),
      caption: Projection.attr('Имя поля'),
      oldValue: Projection.attr('Старое значение'),
      newValue: Projection.attr('Новое значение'),
      mainChange: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', '', {

      }, { hidden: true }),
    }),
  });

  model.defineProjection('AuditEntityL', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
    objectPrimaryKey: Projection.attr('Идентификатор'),
    objectType: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', '', {
      name: Projection.attr('Тип объекта'),
    }, { hidden: true }),
    operationTime: Projection.attr('Время операции'),
    operationType: Projection.attr('Тип операции'),
    executionResult: Projection.attr('Результат'),
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Инициатор', {
      name: Projection.attr('Инициатор'),
    }, { hidden: true }),
    source: Projection.attr('Источник'),
  });

  model.defineProjection('AuditEntityUpdateView', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
    operationTime: Projection.attr(''),
    executionResult: Projection.attr(''),
    auditFields: Projection.hasMany('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field', '', {
      field: Projection.attr(''),
      oldValue: Projection.attr(''),
      newValue: Projection.attr(''),
    })
  });

  model.defineProjection('ConstructNotStoredAttr', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity', {
    objectPrimaryKey: Projection.attr(''),
    operationTime: Projection.attr(''),
    operationType: Projection.attr(''),
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      name: Projection.attr(''),
    }, { hidden: true }),
    executionResult: Projection.attr(''),
  });
};
