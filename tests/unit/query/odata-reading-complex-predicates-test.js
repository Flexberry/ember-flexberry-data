import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';

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

  test('reading | complex predicates', assert => {
    assert.ok(true);
    let done = assert.async();

    Ember.run(() => {
      initTestData(store)

        // Or.
        .then(() => {
          let SP1 = new SimplePredicate('name', '==', 'Vasya');
          let SP2 = new SimplePredicate('karma', '==', 6);
          let CP = SP1.or(SP2);

          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
            .where(CP);
          store.query('ember-flexberry-dummy-application-user', builder.build())
            .then((data) => {
              assert.equal(data.get('length'), 2, '`Predicate "or" length`');
              assert.ok(data.any(item => item.get('name') === 'Vasya') && 
              data.any(item => item.get('karma') === 6), 
              `Predicate "or" data`);
            });
        })

        // And.
        .then(() => {
          let SP1 = new SimplePredicate('name', '==', 'Oleg');
          let SP2 = new SimplePredicate('karma', '==', 7);
          let CP = SP1.and(SP2);

          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
            .where(CP);
          store.query('ember-flexberry-dummy-application-user', builder.build())
          .then((data) => {
            assert.equal(data.get('length'), 1, `Predicate "and" length`);
            assert.ok(data.every(item => item.get('name') === 'Oleg' && item.get('karma') === 7),
            `Predicate "and" data`);
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
      karma: 4
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Oleg',
      eMail: '2@mail.ru',
      karma: 5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Oleg',
      eMail: '3@mail.ru',
      karma: 7
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {    
      name: 'Andrey', 
      eMail: '4@mail.ru',
      karma: 6
    }).save()
  ]);
}