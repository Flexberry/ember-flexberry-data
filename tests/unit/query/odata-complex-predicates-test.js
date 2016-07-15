import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } 
  from 'ember-flexberry-data/query/predicate';


import startApp from '../../helpers/start-app';
import config from '../../../../dummy/config/environment';

if (config.APP.testODataService) {
  const randKey = Math.floor(Math.random() * 999);
  const baseUrl = 'http://localhost:6500/odatatmp/ember' + randKey;
  //'http://rtc-web:8081/odatatmp/ember' + randKey;
  const app = startApp();
  const store = app.__container__.lookup('service:store');

  const adapter = ODataAdapter.create();
  Ember.set(adapter, 'host', baseUrl);

  store.reopen({
    adapterFor() {
      return adapter;
    }
  });

  module('OData reading');

  test ('odata | reading | complex predicates', assert => {
    let done = assert.async();

    Ember.run( () => {
      initTestData(store)
      .then( (values) => {
        console.log(values);
        assert.equal(values.length, 4, 'Init data: ok');

        let SP1 = new SimplePredicate('name', '==', 'Vasya');
        let SP2 = new SimplePredicate('karma', '==', 6);
        let CP = SP1.or(SP2);

        builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(CP);
        store.query('ember-flexberry-dummy-application-user', builder.build())
          .then( data => {
            assert.ok(
              data.get('length') === 2 &&
                (data.content[0]._data.name === 'Vasya' && 
                data.content[1]._data.name === 'Andrey') ||
                (data.content[0]._data.name === 'Andrey' && 
                data.content[1]._data.name === 'Vasya'), 
              `Predicate "or": ok`);
          })
      .then( () => {
        let SP1 = new SimplePredicate('name', '==', 'Oleg');
        let SP2 = new SimplePredicate('karma', '==', 7);
        let CP = SP1.and(SP2);

        builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(CP);
        store.query('ember-flexberry-dummy-application-user', builder.build())
          .then( data => {
            assert.ok(
              data.get('length') === 1 &&
                data.every( item => item.get('name') === 'Oleg' && 
                  item.get('karma') === 7),
              `Predicate "and": ok`);
          });
        }).finally(done);
      });
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