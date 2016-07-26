import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';

import startApp from '../../helpers/start-app';
import config from '../../../../dummy/config/environment';

if (config.APP.testODataService) {
  const randKey = Math.floor(Math.random() * 9999);
  const baseUrl = 'http://rtc-web:8081/odatatmp/ember' + randKey;
  const app = startApp();
  const store = app.__container__.lookup('service:store');

  const adapter = ODataAdapter.create();
  Ember.set(adapter, 'host', baseUrl);

  store.reopen({
    adapterFor() {
      return adapter;
    }
  });

  module('OData');

  test('reading | store commands', (assert) => {
    assert.expect(4);
    let done = assert.async();

    Ember.run(() => {
      initTestData(store)
      
        // findRecord.
        .then((people) => {
          let id = people[0].get('id');
          return store.findRecord('ember-flexberry-dummy-application-user', id)
            .then((data) => 
              assert.equal(data.get('name'), 'User 1', 'findRecord')
            );
        })

        // findAll.
        .then(() => {
          return store.findAll('ember-flexberry-dummy-application-user')
            .then((data) => 
              assert.equal(data.get('length'), 4, 'findAll')
            );
        })

        // query.
        .then(() => {
          let builder = new QueryBuilder(store)
            .from('ember-flexberry-dummy-application-user')
            .where('name', '==', 'User 2');
          return store.query('ember-flexberry-dummy-application-user', builder.build())
            .then((data) => {
              assert.ok(data.every(item => item.get('name') === 'User 2'), 'query | Data');
              assert.equal(data.get('length'), 2, 'query | Length');
            });
        })

        // queryRecord.
        // Not working!
        .then(() => {
          let builder = new QueryBuilder(store)
            .from('ember-flexberry-dummy-application-user')
            .where('name', '==', 'User 2');
          return store.queryRecord('ember-flexberry-dummy-application-user', builder.build())
            .then((record) => 
              assert.equal(record.get('name'), 'User 2', 'queryRecord')
            );
        })
        .catch(e => console.log(e, e.message))
        .finally(done);
    });
  });
}

function initTestData(store) {
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 1',
      eMail: '1@mail.ru'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 2',
      eMail: '2@mail.ru'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 2',
      eMail: '2.5@mail.ru'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 3',
      eMail: '3@mail.ru'
    }).save()
  ])
}