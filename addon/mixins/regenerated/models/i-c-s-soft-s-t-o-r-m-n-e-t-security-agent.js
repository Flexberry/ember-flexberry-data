import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import { attr } from '../../../utils/attributes';
export let Model = Mixin.create({
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
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
});
export let defineProjections = function (model) {
  model.defineProjection('AuditView', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя'),
    login: attr('Логин'),
    pwd: attr('Пароль'),
    isUser: attr('Пользователь'),
    isGroup: attr('Группа'),
    isRole: attr('Роль'),
    connString: attr('Строка соединения'),
    enabled: attr('Включён'),
    email: attr('Email')
  });
  model.defineProjection('CheckExistLogin', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    login: attr('')
  });
  model.defineProjection('CheckLoginPwd', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    enabled: attr(''),
    login: attr(''),
    pwd: attr(''),
    isUser: attr(''),
    name: attr(''),
    email: attr('')
  });
  model.defineProjection('OwnProperties', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr(''),
    login: attr(''),
    isUser: attr(''),
    isGroup: attr(''),
    isRole: attr(''),
    enabled: attr('')
  });
  model.defineProjection('RoleOrGroupE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr(''),
    enabled: attr(''),
    isUser: attr('', { hidden: true }),
    isGroup: attr('', { hidden: true }),
    isRole: attr('', { hidden: true }),
    createTime: attr('', { hidden: true }),
    creator: attr('', { hidden: true }),
    editTime: attr('', { hidden: true }),
    editor: attr('', { hidden: true })
  });
  model.defineProjection('RoleOrGroupL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr(''),
    enabled: attr(''),
    isUser: attr('', { hidden: true }),
    isGroup: attr('', { hidden: true }),
    isRole: attr('', { hidden: true }),
    createTime: attr(''),
    creator: attr(''),
    editTime: attr(''),
    editor: attr('')
  });
  model.defineProjection('Sec_AgentE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя'),
    login: attr('Логин'),
    pwd: attr('Пароль'),
    connString: attr('Строка подключения'),
    enabled: attr('Актуален'),
    isUser: attr('', { hidden: true })
  });
  model.defineProjection('Sec_AgentL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя'),
    login: attr('Логин'),
    isUser: attr('Пользователь', { hidden: true }),
    isGroup: attr('Группа', { hidden: true }),
    isRole: attr('Роль', { hidden: true }),
    connString: attr('Строка подключения'),
    enabled: attr('Запись активна'),
    createTime: attr('Дата создания'),
    creator: attr('Создатель'),
    editTime: attr('Дата изменения'),
    editor: attr('Редактор')
  });
  model.defineProjection('Sec_AgentTypeAccess', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя'),
    login: attr('Логин'),
    connString: attr('Строка соединения'),
    full: attr('Полный доступ'),
    read: attr('Чтение'),
    insert: attr('Вставка'),
    update: attr('Обновление'),
    delete: attr('Удаление'),
    execute: attr('Исполнение')
  });
  model.defineProjection('Sec_GetRoles', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя'),
    login: attr('Логин'),
    isUser: attr('Пользователь', { hidden: true }),
    isGroup: attr('Группа', { hidden: true }),
    isRole: attr('Роль', { hidden: true }),
    enabled: attr('Запись активна')
  });
  model.defineProjection('Sec_NotUserL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя'),
    isUser: attr('', { hidden: true }),
    isGroup: attr('', { hidden: true }),
    isRole: attr('', { hidden: true }),
    connString: attr('Строка подключения'),
    createTime: attr('Дата создания'),
    creator: attr('Создатель'),
    editTime: attr('Дата изменения'),
    editor: attr('Редактор')
  });
  model.defineProjection('Sec_OpAgentRolesE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr(''),
    login: attr('')
  });
  model.defineProjection('Sec_RolesL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Название'),
    isRole: attr('', { hidden: true }),
    createTime: attr('Дата создания'),
    creator: attr('Создатель'),
    editTime: attr('Дата изменения'),
    editor: attr('Редактор')
  });
  model.defineProjection('UserE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr(''),
    login: attr(''),
    email: attr(''),
    enabled: attr(''),
    pwd: attr(''),
    createTime: attr('', { hidden: true }),
    creator: attr('', { hidden: true }),
    editTime: attr('', { hidden: true }),
    editor: attr('', { hidden: true }),
    isUser: attr('', { hidden: true }),
    isGroup: attr('', { hidden: true }),
    isRole: attr('', { hidden: true })
  });
  model.defineProjection('UserL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr(''),
    login: attr(''),
    email: attr(''),
    isUser: attr('', { hidden: true }),
    isGroup: attr('', { hidden: true }),
    isRole: attr('', { hidden: true }),
    enabled: attr(''),
    createTime: attr(''),
    creator: attr(''),
    editTime: attr(''),
    editor: attr('')
  });
};
