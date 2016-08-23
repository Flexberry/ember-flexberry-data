import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

export let Model = Ember.Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  group: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', { inverse: null, async: false }),
  user: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', { inverse: null, async: false }),
  validations: {
    group: { presence: true },
    user: { presence: true },
  },
});

export let defineProjections = function (model) {
  model.defineProjection('AuditView', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Группа', {
      name: Projection.attr('Имя группы'),
    }),
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Пользователь', {
      name: Projection.attr('Имя пользователя'),
      login: Projection.attr('Логин пользователя'),
    }),
  });

  model.defineProjection('GetGroupsNameByUserKey', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      name: Projection.attr(''),
      isGroup: Projection.attr(''),
      enabled: Projection.attr(''),
    }, { hidden: true }),
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
    }),
  });

  model.defineProjection('GetUserByUsername', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      name: Projection.attr(''),
      isGroup: Projection.attr(''),
      enabled: Projection.attr(''),
    }, { hidden: true }),
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
    }),
  });

  model.defineProjection('LinkedAgents', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
    }),
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
    }),
  });

  model.defineProjection('SearchLinkGroup', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      isUser: Projection.attr(''),
      isGroup: Projection.attr(''),
      isRole: Projection.attr(''),
    }),
    group: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      isUser: Projection.attr(''),
      isGroup: Projection.attr(''),
      isRole: Projection.attr(''),
    }),
  });

  model.defineProjection('Sec_LinkGroupE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Пользователь', {
      name: Projection.attr('', { hidden: true }),
    }, { displayMemberPath: 'name' }),
    group: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Группа', {
      name: Projection.attr('', { hidden: true }),
    }, { displayMemberPath: 'name' }),
  });

  model.defineProjection('Sec_LinkGroupL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    user: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Юзер', {
      name: Projection.attr('Юзер'),
    }),
    group: Projection.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Группа', {
      name: Projection.attr('Группа'),
    }),
    createTime: Projection.attr('Дата создания'),
    creator: Projection.attr('Создатель'),
    editTime: Projection.attr('Дата изменения'),
    editor: Projection.attr('Редактор'),
  });
};
