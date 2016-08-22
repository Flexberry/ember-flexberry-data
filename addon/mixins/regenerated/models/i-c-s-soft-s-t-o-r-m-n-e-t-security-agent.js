import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

export let Model = Ember.Mixin.create({
  name: DS.attr('string'),
  login: DS.attr('string'),
  pwd: DS.attr('string'),
  isUser: DS.attr('boolean'),
  isGroup: DS.attr('boolean'),
  isRole: DS.attr('boolean'),
  connString: DS.attr('string'),
  enabled: DS.attr('boolean'),
  email: DS.attr('string'),
  full: DS.attr('boolean'),
  read: DS.attr('boolean'),
  insert: DS.attr('boolean'),
  update: DS.attr('boolean'),
  delete: DS.attr('boolean'),
  execute: DS.attr('boolean'),
  createTime: DS.attr('string'),
  creator: DS.attr('string'),
  editTime: DS.attr('string'),
  editor: DS.attr('string'),
  validations: {
    name: { presence: true },
    isUser: { presence: true },
    isGroup: { presence: true },
    isRole: { presence: true },
  },
});

export let defineProjections = function (model) {
  model.defineProjection('AuditView', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: Projection.attr('Имя'),
    login: Projection.attr('Логин'),
    pwd: Projection.attr('Пароль'),
    isUser: Projection.attr('Пользователь'),
    isGroup: Projection.attr('Группа'),
    isRole: Projection.attr('Роль'),
    connString: Projection.attr('Строка соединения'),
    enabled: Projection.attr('Включён'),
    email: Projection.attr('Email'),
  });

  model.defineProjection('CheckExistLogin', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    login: Projection.attr(''),
  });

  model.defineProjection('CheckLoginPwd', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    enabled: Projection.attr(''),
    login: Projection.attr(''),
    pwd: Projection.attr(''),
    isUser: Projection.attr(''),
    name: Projection.attr(''),
    email: Projection.attr(''),
  });

  model.defineProjection('OwnProperties', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: Projection.attr(''),
    login: Projection.attr(''),
    isUser: Projection.attr(''),
    isGroup: Projection.attr(''),
    isRole: Projection.attr(''),
    enabled: Projection.attr(''),
  });

  model.defineProjection('Sec_AgentE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: Projection.attr('Имя'),
    login: Projection.attr('Логин'),
    pwd: Projection.attr('Пароль'),
    connString: Projection.attr('Строка подключения'),
    enabled: Projection.attr('Актуален'),
    isUser: Projection.attr('', { hidden: true }),
  });

  model.defineProjection('Sec_AgentL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: Projection.attr('Имя'),
    login: Projection.attr('Логин'),
    isUser: Projection.attr('Пользователь', { hidden: true }),
    isGroup: Projection.attr('Группа', { hidden: true }),
    isRole: Projection.attr('Роль', { hidden: true }),
    connString: Projection.attr('Строка подключения'),
    enabled: Projection.attr('Запись активна'),
    createTime: Projection.attr('Дата создания'),
    creator: Projection.attr('Создатель'),
    editTime: Projection.attr('Дата изменения'),
    editor: Projection.attr('Редактор'),
  });

  model.defineProjection('Sec_AgentTypeAccess', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: Projection.attr('Имя'),
    login: Projection.attr('Логин'),
    connString: Projection.attr('Строка соединения'),
    full: Projection.attr('Полный доступ'),
    read: Projection.attr('Чтение'),
    insert: Projection.attr('Вставка'),
    update: Projection.attr('Обновление'),
    delete: Projection.attr('Удаление'),
    execute: Projection.attr('Исполнение'),
  });

  model.defineProjection('Sec_GetRoles', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: Projection.attr('Имя'),
    login: Projection.attr('Логин'),
    isUser: Projection.attr('Пользователь', { hidden: true }),
    isGroup: Projection.attr('Группа', { hidden: true }),
    isRole: Projection.attr('Роль', { hidden: true }),
    enabled: Projection.attr('Запись активна'),
  });

  model.defineProjection('Sec_NotUserL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: Projection.attr('Имя'),
    isUser: Projection.attr('', { hidden: true }),
    isGroup: Projection.attr('', { hidden: true }),
    isRole: Projection.attr('', { hidden: true }),
    connString: Projection.attr('Строка подключения'),
    createTime: Projection.attr('Дата создания'),
    creator: Projection.attr('Создатель'),
    editTime: Projection.attr('Дата изменения'),
    editor: Projection.attr('Редактор'),
  });

  model.defineProjection('Sec_OpAgentRolesE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: Projection.attr(''),
    login: Projection.attr(''),
  });

  model.defineProjection('Sec_RolesL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: Projection.attr('Название'),
    isRole: Projection.attr('', { hidden: true }),
    createTime: Projection.attr('Дата создания'),
    creator: Projection.attr('Создатель'),
    editTime: Projection.attr('Дата изменения'),
    editor: Projection.attr('Редактор'),
  });
};
