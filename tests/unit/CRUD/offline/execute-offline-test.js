import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../../helpers/start-app';
import destroyApp from '../../../helpers/destroy-app';
import Dexie from 'npm:dexie';

var App;
var store;
var db;

export default function executeTest(testName, callback) {
  module('CRUD | offline-' + testName, {
    setup: function(assert) {
      let initDone = assert.async();

      App = startApp();
      store = App.__container__.lookup('service:store');
      let dbName = 'testDB' + Math.floor(Math.random() * 9999);

      // Override store.unloadAll method.
      const originalUnloadAll = store.unloadAll;
      store.unloadAll = function() {
        originalUnloadAll.apply(store, arguments);

        // Clean up type maps otherwise internal models won't be cleaned from stores,
        // and it will cause some exceptions related to store's internal-models statuses.
        Ember.A([store, store.get('onlineStore'), store.get('offlineStore')]).forEach((s) => {
          Ember.set(s, 'typeMaps', {});
        });
      };

      store.set('offlineStore.dbName', dbName);
      let offlineGlobals = App.__container__.lookup('service:offline-globals');
      offlineGlobals.setOnlineAvailable(false);

      Ember.run(() => {
        db = new Dexie(dbName);
        db.version(0.1).stores({
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
          'ember-flexberry-dummy-suggestion': 'id,address,text,date,votes,moderated,type,author,editor1,*files,*userVotes,*comments',
          'ember-flexberry-dummy-suggestion-type': 'id,name,moderated,parent,*localizedTypes',
          'ember-flexberry-dummy-application-user': 'id,name,eMail,phone1,phone2,phone3,activated,vK,facebook,twitter,birthday,gender,vip,karma',
          'ember-flexberry-dummy-vote': 'id,suggestion,voteType,applicationUser',
          'ember-flexberry-dummy-comment': 'id,suggestion,text,votes,moderated,author,*userVotes',
          'ember-flexberry-dummy-comment-vote': 'id,comment,voteType,applicationUser'
        });

        db.open().then((db) => {
          let promises = [];
          promises.push(db.table('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity'));
          promises.push(db.table('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field'));
          promises.push(db.table('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type'));
          promises.push(db.table('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent'));
          promises.push(db.table('i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group'));
          promises.push(db.table('i-c-s-soft-s-t-o-r-m-n-e-t-security-session'));
          promises.push(db.table('ember-flexberry-dummy-suggestion'));
          promises.push(db.table('ember-flexberry-dummy-suggestion-type'));
          promises.push(db.table('ember-flexberry-dummy-application-user'));
          promises.push(db.table('ember-flexberry-dummy-vote'));
          promises.push(db.table('ember-flexberry-dummy-comment'));
          promises.push(db.table('ember-flexberry-dummy-comment-vote'));
          return new Dexie.Promise.all(promises).then(() => {
            db.close();
            return Dexie.Promise.resolve();
          });
        }).then(() => {
          initDone();
        });
      });
    },
    teardown: function(assert) {
      let cleanUpDone = assert.async();

      Ember.run(() => {
        db.delete().then(() => {
          destroyApp(App);

          cleanUpDone();
        });
      });
    }
  });

  test(testName, (assert) => callback(store, assert));
}
