import { getOwner } from '@ember/application';
import { computed } from '@ember/object';

import BaseStore from 'ember-flexberry-data/stores/base-store';
import StoreMixin from 'ember-flexberry-data/mixins/store';
import OnlineStore from 'ember-flexberry-data/stores/online-store';

export default BaseStore.extend({
  offlineModels: computed(function() {
    return {
      'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity': true,
      'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field': true,
      'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type': true,
      'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent': true,
      'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group': true,
      'i-c-s-soft-s-t-o-r-m-n-e-t-security-session': true,
    };
  }),

  init() {
    this.set('offlineSchema', {
      TestDB: {
        0.1: {
          'ember-flexberry-dummy-suggestion': 'id,address,text,date,votes,moderated,type,author,editor1,*files,*userVotes,*comments',
          'ember-flexberry-dummy-suggestion-type': 'id,name,moderated,parent,*localizedTypes',
          'ember-flexberry-dummy-application-user': 'id,name,eMail,phone1,phone2,phone3,activated,vK,facebook,twitter,birthday,gender,vip,karma',
          'ember-flexberry-dummy-vote': 'id,suggestion,voteType,applicationUser',
          'ember-flexberry-dummy-comment': 'id,suggestion,text,votes,moderated,author,*userVotes',
          'ember-flexberry-dummy-comment-vote': 'id,comment,voteType,applicationUser',
          'ember-flexberry-dummy-suggestion-file': 'id,suggestion,order,file',
          'ember-flexberry-dummy-localization': 'id,name',
          'ember-flexberry-dummy-localized-suggestion-type': 'id,suggestionType,localization',
          'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity':
            'id,objectPrimaryKey,operationTime,operationType,executionResult,source,serializedField,' +
            'createTime,creator,editTime,editor,user,objectType,*auditFields',
          'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field':
            'id,field,caption,oldValue,newValue,mainChange,auditEntity',
          'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type':
            'id,name',
          'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent':
            'id,name,login,pwd,isUser,isGroup,isRole,connString,enabled,email,full,read,insert,update,' +
            'delete,execute,createTime,creator,editTime,editor',
          'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group':
            'id,createTime,creator,editTime,editor,group,user',
          'i-c-s-soft-s-t-o-r-m-n-e-t-security-session':
            'id,userKey,startedAt,lastAccess,closed',
        },

        0.2: {
          'ember-flexberry-dummy-test-poly-base': 'id,pole',
          'ember-flexberry-dummy-test-poly-child': 'id,pole,childPole',
          'ember-flexberry-dummy-test-poly-another-child': 'id,pole,childAnotherPole',
          'ember-flexberry-dummy-test-poly': 'id,selfPole,relation',
        }
      },
    });
    let owner = getOwner(this);
    this.set('onlineStore', OnlineStore.extend(StoreMixin).create(owner.ownerInjection()));
    this._super(...arguments);
    this.set('offlineStore.dbName', 'TestDB');
  }
});
