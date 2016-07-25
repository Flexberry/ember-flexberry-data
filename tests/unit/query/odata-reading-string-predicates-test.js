import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';
import { StringPredicate } from 'ember-flexberry-data/query/predicate';

import startApp from '../../helpers/start-app';
import config from '../../../../dummy/config/environment';

if (config.APP.testODataService) {
  const randKey = Math.floor(Math.random() * 999);
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

  test('reading | predicates | string predicates', (assert) => {
    assert.ok(true, 'Start test');
    let done = assert.async();

    Ember.run(() => {
      initTestData(store)

      // Contains.
      .then(() => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new StringPredicate('name').contains('as'));

        store.query('ember-flexberry-dummy-application-user', builder.build())
        .then((data) => {
          assert.ok(data.every(item => item.get('name') === 'Vasya'),
            'Contains with correct data | Data');
          assert.equal(data.get('length'), 2, 'Contains with correct data | Length');
        });
      })
      .then(() => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new StringPredicate('name').contains(null));

        store.query('ember-flexberry-dummy-application-user', builder.build())
        .then((data) => {
          assert.equal(data.get('length'), 0, 'Contains without data');
        });
      })
      .then(() => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
        .where(new StringPredicate('name').contains('Ge'));

        store.query('ember-flexberry-dummy-application-user', builder.build())
        .then((data) => {
          assert.equal(data.get('length'), 0, `Contains mustn't return any records`);
        });
      })
      .catch(e => console.log(e, e.message))
      .finally(done);
    });
  });
}

function initTestData(store) {
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '1@mail.ru',
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '2@mail.ru',
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Kolya',
      eMail: '3@mail.ru',
    }).save()
  ]);
}
