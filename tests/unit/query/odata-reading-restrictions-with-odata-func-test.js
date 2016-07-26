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

  test('reading | restrictions | odata functions', (assert) => {
    assert.expect(4);
    let done = assert.async();

    Ember.run(() => {
      initTestData(store)

        // User has a birthday tommorow.
        .then(() => {
          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
            .where('birthday', '>', 'now()');
          return runTest(store, builder, (data) => {
            assert.ok(data.get('firstObject.name') === 'User 1', '> now() | Data');
            assert.equal(data.get('length'), 1, '> now() | Length');
          });
        })

        // User had a birthday yesterday.
        .then(() => {
          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
            .where('birthday', '<', 'now()');
          return runTest(store, builder, (data) => {
            assert.ok(data.get('firstObject.name') === 'User 2', '< now() | Data');
            assert.equal(data.get('length'), 1, '< now() | Length');
          });
        })
        .catch(e => console.log(e, e.message))
        .finally(done);
    });
  });
}

function initTestData(store) {
    let tomorrowDate = new Date();
    let yesterdayDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 1',
      eMail: '1',
      birthday: tomorrowDate
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 2',
      eMail: '2',
      birthday: yesterdayDate
    }).save()
  ])
}

function runTest(store, builder, callback) {
  return store.query('ember-flexberry-dummy-application-user', builder.build())
    .then((data) => callback(data));
}
