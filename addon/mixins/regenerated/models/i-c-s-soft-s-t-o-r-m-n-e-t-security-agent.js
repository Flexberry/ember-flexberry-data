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
  enabled: DS.attr('boolean', { defaultValue: true }),
  email: DS.attr('string'),
  comment: DS.attr('string'),
  /**
    Non-stored property.

    @property domain
  */
  domain: DS.attr('string'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'domainCompute' method in model class (outside of this mixin) if you want to compute value of 'domain' property.

    @method _domainCompute
    @private
    @example
      ```javascript
      _domainChanged: on('init', observer('domain', function() {
        once(this, '_domainCompute');
      }))
      ```
  */
  _domainCompute: function() {
    let result = (this.domainCompute && typeof this.domainCompute === 'function') ? this.domainCompute() : null;
    this.set('domain', result);
  },
  /**
    Non-stored property.

    @property agentKey
  */
  agentKey: DS.attr('guid'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'agentKeyCompute' method in model class (outside of this mixin) if you want to compute value of 'agentKey' property.

    @method _agentKeyCompute
    @private
    @example
      ```javascript
      _agentKeyChanged: on('init', observer('agentKey', function() {
        once(this, '_agentKeyCompute');
      }))
      ```
  */
  _agentKeyCompute: function() {
    let result = (this.agentKeyCompute && typeof this.agentKeyCompute === 'function') ? this.agentKeyCompute() : null;
    this.set('agentKey', result);
  },
  /**
    Non-stored property.

    @property full
  */
  full: DS.attr('boolean'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'fullCompute' method in model class (outside of this mixin) if you want to compute value of 'full' property.

    @method _fullCompute
    @private
    @example
      ```javascript
      _fullChanged: on('init', observer('full', function() {
        once(this, '_fullCompute');
      }))
      ```
  */
  _fullCompute: function() {
    let result = (this.fullCompute && typeof this.fullCompute === 'function') ? this.fullCompute() : null;
    this.set('full', result);
  },
  /**
    Non-stored property.

    @property read
  */
  read: DS.attr('boolean'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'readCompute' method in model class (outside of this mixin) if you want to compute value of 'read' property.

    @method _readCompute
    @private
    @example
      ```javascript
      _readChanged: on('init', observer('read', function() {
        once(this, '_readCompute');
      }))
      ```
  */
  _readCompute: function() {
    let result = (this.readCompute && typeof this.readCompute === 'function') ? this.readCompute() : null;
    this.set('read', result);
  },
  /**
    Non-stored property.

    @property insert
  */
  insert: DS.attr('boolean'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'insertCompute' method in model class (outside of this mixin) if you want to compute value of 'insert' property.

    @method _insertCompute
    @private
    @example
      ```javascript
      _insertChanged: on('init', observer('insert', function() {
        once(this, '_insertCompute');
      }))
      ```
  */
  _insertCompute: function() {
    let result = (this.insertCompute && typeof this.insertCompute === 'function') ? this.insertCompute() : null;
    this.set('insert', result);
  },
  /**
    Non-stored property.

    @property update
  */
  update: DS.attr('boolean'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'updateCompute' method in model class (outside of this mixin) if you want to compute value of 'update' property.

    @method _updateCompute
    @private
    @example
      ```javascript
      _updateChanged: on('init', observer('update', function() {
        once(this, '_updateCompute');
      }))
      ```
  */
  _updateCompute: function() {
    let result = (this.updateCompute && typeof this.updateCompute === 'function') ? this.updateCompute() : null;
    this.set('update', result);
  },
  /**
    Non-stored property.

    @property delete
  */
  delete: DS.attr('boolean'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'deleteCompute' method in model class (outside of this mixin) if you want to compute value of 'delete' property.

    @method _deleteCompute
    @private
    @example
      ```javascript
      _deleteChanged: on('init', observer('delete', function() {
        once(this, '_deleteCompute');
      }))
      ```
  */
  _deleteCompute: function() {
    let result = (this.deleteCompute && typeof this.deleteCompute === 'function') ? this.deleteCompute() : null;
    this.set('delete', result);
  },
  /**
    Non-stored property.

    @property execute
  */
  execute: DS.attr('boolean'),
  /**
    Method to set non-stored property.
    Please, use code below in model class (outside of this mixin) otherwise it will be replaced during regeneration of models.
    Please, implement 'executeCompute' method in model class (outside of this mixin) if you want to compute value of 'execute' property.

    @method _executeCompute
    @private
    @example
      ```javascript
      _executeChanged: on('init', observer('execute', function() {
        once(this, '_executeCompute');
      }))
      ```
  */
  _executeCompute: function() {
    let result = (this.executeCompute && typeof this.executeCompute === 'function') ? this.executeCompute() : null;
    this.set('execute', result);
  },
  createTime: DS.attr('date'),
  creator: DS.attr('string'),
  editTime: DS.attr('date'),
  editor: DS.attr('string')
});

export let defineProjections = function (modelClass) {
  modelClass.defineProjection('AuditView', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя', { index: 0 }),
    login: attr('Логин', { index: 1 }),
    pwd: attr('Пароль', { index: 2 }),
    isUser: attr('Пользователь', { index: 3 }),
    isGroup: attr('Группа', { index: 4 }),
    isRole: attr('Роль', { index: 5 }),
    connString: attr('Строка соединения', { index: 6 }),
    enabled: attr('Включён', { index: 7 }),
    email: attr('Email', { index: 8 }),
    comment: attr('Комментарий', { index: 9 })
  });

  modelClass.defineProjection('CheckExistLogin', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    login: attr('', { index: 0 })
  });

  modelClass.defineProjection('CheckLoginPwd', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    enabled: attr('', { index: 0 }),
    login: attr('', { index: 1 }),
    pwd: attr('', { index: 2 }),
    isUser: attr('', { index: 3 }),
    name: attr('', { index: 4 }),
    email: attr('', { index: 5 }),
    domain: attr('', { index: 6 })
  });

  modelClass.defineProjection('OwnProperties', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('', { index: 0 }),
    login: attr('', { index: 1 }),
    isUser: attr('', { index: 2 }),
    isGroup: attr('', { index: 3 }),
    isRole: attr('', { index: 4 }),
    enabled: attr('', { index: 5 }),
    comment: attr('', { index: 6 })
  });

  modelClass.defineProjection('RoleOrGroupE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('', { index: 0 }),
    enabled: attr('', { index: 1 }),
    isUser: attr('', { index: 2, hidden: true }),
    isGroup: attr('', { index: 3, hidden: true }),
    isRole: attr('', { index: 4, hidden: true }),
    createTime: attr('', { index: 5, hidden: true }),
    creator: attr('', { index: 6, hidden: true }),
    editTime: attr('', { index: 7, hidden: true }),
    editor: attr('', { index: 8, hidden: true }),
    comment: attr('', { index: 9 })
  });

  modelClass.defineProjection('RoleOrGroupL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('', { index: 0 }),
    enabled: attr('', { index: 1 }),
    isUser: attr('', { index: 2, hidden: true }),
    isGroup: attr('', { index: 3, hidden: true }),
    isRole: attr('', { index: 4, hidden: true }),
    createTime: attr('', { index: 5 }),
    creator: attr('', { index: 6 }),
    editTime: attr('', { index: 7 }),
    editor: attr('', { index: 8 }),
    comment: attr('', { index: 9 })
  });

  modelClass.defineProjection('Sec_AgentE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя', { index: 0 }),
    login: attr('Логин', { index: 1 }),
    pwd: attr('Пароль', { index: 2 }),
    connString: attr('Строка подключения', { index: 3 }),
    enabled: attr('Актуален', { index: 4 }),
    isUser: attr('', { index: 5, hidden: true }),
    comment: attr('Комментарий', { index: 6 })
  });

  modelClass.defineProjection('Sec_AgentL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя', { index: 0 }),
    login: attr('Логин', { index: 1 }),
    isUser: attr('Пользователь', { index: 2, hidden: true }),
    isGroup: attr('Группа', { index: 3, hidden: true }),
    isRole: attr('Роль', { index: 4, hidden: true }),
    connString: attr('Строка подключения', { index: 5 }),
    enabled: attr('Запись активна', { index: 6 }),
    createTime: attr('Дата создания', { index: 7 }),
    creator: attr('Создатель', { index: 8 }),
    editTime: attr('Дата изменения', { index: 9 }),
    editor: attr('Редактор', { index: 10 }),
    comment: attr('Комментарий', { index: 11 })
  });

  modelClass.defineProjection('Sec_AgentTypeAccess', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя', { index: 0 }),
    login: attr('Логин', { index: 1 }),
    connString: attr('Строка соединения', { index: 2 }),
    full: attr('Полный доступ', { index: 3 }),
    read: attr('Чтение', { index: 4 }),
    insert: attr('Вставка', { index: 5 }),
    update: attr('Обновление', { index: 6 }),
    delete: attr('Удаление', { index: 7 }),
    execute: attr('Исполнение', { index: 8 })
  });

  modelClass.defineProjection('Sec_GetRoles', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя', { index: 0 }),
    login: attr('Логин', { index: 1 }),
    isUser: attr('Пользователь', { index: 2, hidden: true }),
    isGroup: attr('Группа', { index: 3, hidden: true }),
    isRole: attr('Роль', { index: 4, hidden: true }),
    enabled: attr('Запись активна', { index: 5 }),
    comment: attr('Комментарий', { index: 6 })
  });

  modelClass.defineProjection('Sec_GroupsL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Название', { index: 0 }),
    isGroup: attr('', { index: 1, hidden: true }),
    enabled: attr('', { index: 2 }),
    createTime: attr('Дата создания', { index: 3 }),
    creator: attr('Создатель', { index: 4 }),
    editTime: attr('Дата изменения', { index: 5 }),
    editor: attr('Редактор', { index: 6 })
  });

  modelClass.defineProjection('Sec_NotUserL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Имя', { index: 0 }),
    isUser: attr('', { index: 1, hidden: true }),
    isGroup: attr('', { index: 2, hidden: true }),
    isRole: attr('', { index: 3, hidden: true }),
    connString: attr('Строка подключения', { index: 4 }),
    createTime: attr('Дата создания', { index: 5 }),
    creator: attr('Создатель', { index: 6 }),
    editTime: attr('Дата изменения', { index: 7 }),
    editor: attr('Редактор', { index: 8 }),
    comment: attr('Комментарий', { index: 9 })
  });

  modelClass.defineProjection('Sec_OpAgentRolesE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('', { index: 0 }),
    login: attr('', { index: 1 })
  });

  modelClass.defineProjection('Sec_RolesL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('Название', { index: 0 }),
    isRole: attr('', { index: 1, hidden: true }),
    enabled: attr('', { index: 2 }),
    createTime: attr('Дата создания', { index: 3 }),
    creator: attr('Создатель', { index: 4 }),
    editTime: attr('Дата изменения', { index: 5 }),
    editor: attr('Редактор', { index: 6 }),
    comment: attr('Комментарий', { index: 7 })
  });

  modelClass.defineProjection('UserE', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('', { index: 0 }),
    login: attr('', { index: 1 }),
    email: attr('', { index: 2 }),
    enabled: attr('', { index: 3 }),
    pwd: attr('', { index: 4 }),
    createTime: attr('', { index: 5, hidden: true }),
    creator: attr('', { index: 6, hidden: true }),
    editTime: attr('', { index: 7, hidden: true }),
    editor: attr('', { index: 8, hidden: true }),
    isUser: attr('', { index: 9, hidden: true }),
    isGroup: attr('', { index: 10, hidden: true }),
    isRole: attr('', { index: 11, hidden: true }),
    comment: attr('', { index: 12 })
  });

  modelClass.defineProjection('UserL', 'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
    name: attr('', { index: 0 }),
    login: attr('', { index: 1 }),
    email: attr('', { index: 2 }),
    isUser: attr('', { index: 3, hidden: true }),
    isGroup: attr('', { index: 4, hidden: true }),
    isRole: attr('', { index: 5, hidden: true }),
    enabled: attr('', { index: 6 }),
    createTime: attr('', { index: 7 }),
    creator: attr('', { index: 8 }),
    editTime: attr('', { index: 9 }),
    editor: attr('', { index: 10 }),
    comment: attr('', { index: 11 })
  });
};
