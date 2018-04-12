import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import { attr, belongsTo } from '../../../utils/attributes';
export let Model = Mixin.create({
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string'),
  group: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', { inverse: null, async: false }),
  user: DS.belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', { inverse: null, async: false }),
});
export let defineProjections = function (model) {
  model.defineProjection('AuditView', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Группа', {
      name: attr('Имя группы')
    }),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Пользователь', {
      name: attr('Имя пользователя'),
      login: attr('Логин пользователя')
    })
  });
  model.defineProjection('GetGroupsNameByUserKey', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      name: attr(''),
      isGroup: attr(''),
      enabled: attr('')
    }, { hidden: true }),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {

    })
  });
  model.defineProjection('GetUserByUsername', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      name: attr(''),
      isGroup: attr(''),
      enabled: attr('')
    }, { hidden: true }),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {

    })
  });
  model.defineProjection('LinkedAgents', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {

    }),
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {

    })
  });
  model.defineProjection('SearchLinkGroup', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      isUser: attr(''),
      isGroup: attr(''),
      isRole: attr('')
    }),
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', '', {
      isUser: attr(''),
      isGroup: attr(''),
      isRole: attr('')
    })
  });
  model.defineProjection('Sec_LinkGroupE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Пользователь', {
      name: attr('', { hidden: true })
    }, { displayMemberPath: 'name' }),
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Группа', {
      name: attr('', { hidden: true })
    }, { displayMemberPath: 'name' })
  });
  model.defineProjection('Sec_LinkGroupL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group', {
    user: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Юзер', {
      name: attr('Юзер')
    }),
    group: belongsTo('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', 'Группа', {
      name: attr('Группа')
    }),
    createTime: attr('Дата создания'),
    creator: attr('Создатель'),
    editTime: attr('Дата изменения'),
    editor: attr('Редактор')
  });
};
