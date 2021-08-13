import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import { attr, belongsTo } from '../../../utils/attributes';

export let Model = Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  group: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', { inverse: null, async: false }),
  user: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', { inverse: null, async: false })
});

export let defineProjections = function (modelClass) {
  modelClass.defineProjection('AuditView', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Группа', {
      name: attr('Имя группы', { index: 1 })
    }, { index: 0 }),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Пользователь', {
      name: attr('Имя пользователя', { index: 3 }),
      login: attr('Логин пользователя', { index: 4 })
    }, { index: 2 })
  });

  modelClass.defineProjection('GetGroupsNameByUserKey', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      name: attr('', { index: 1 }),
      isGroup: attr('', { index: 2 }),
      enabled: attr('', { index: 3 })
    }, { index: -1, hidden: true }),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {

    }, { index: 0 })
  });

  modelClass.defineProjection('GetUserByUsername', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      name: attr('', { index: 0 }),
      isGroup: attr('', { index: 1 }),
      enabled: attr('', { index: 2 })
    }, { index: -1, hidden: true }),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {

    }, { index: 3 })
  });

  modelClass.defineProjection('LinkedAgents', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {

    }, { index: 0 }),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {

    }, { index: 1 })
  });

  modelClass.defineProjection('SearchLinkGroup', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      isUser: attr('', { index: 1 }),
      isGroup: attr('', { index: 2 }),
      isRole: attr('', { index: 3 })
    }, { index: 0 }),
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      isUser: attr('', { index: 5 }),
      isGroup: attr('', { index: 6 }),
      isRole: attr('', { index: 7 })
    }, { index: 4 })
  });

  modelClass.defineProjection('Sec_LinkGroupE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Пользователь', {
      name: attr('', { index: 1, hidden: true })
    }, { index: 0, displayMemberPath: 'name' }),
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Группа', {
      name: attr('', { index: 3, hidden: true })
    }, { index: 2, displayMemberPath: 'name' })
  });

  modelClass.defineProjection('Sec_LinkGroupL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Юзер', {
      name: attr('Юзер', { index: 0 })
    }, { index: 2 }),
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Группа', {
      name: attr('Группа', { index: 1 })
    }, { index: 3 }),
    createTime: attr('Дата создания', { index: 4 }),
    creator: attr('Создатель', { index: 5 }),
    editTime: attr('Дата изменения', { index: 6 }),
    editor: attr('Редактор', { index: 7 })
  });
};
