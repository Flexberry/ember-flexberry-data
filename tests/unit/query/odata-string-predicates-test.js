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
  
  test('odata | reading | string predicates', assert => {
    // Contains.  
    let done = assert.async();

    Ember.run( () => { 
      initTestData(store).then( (values) => {
        assert.equal(values.length, 3, 'Init data: ok');
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new StringPredicate('name').contains('as'));
        
        store.query('ember-flexberry-dummy-application-user', builder.build())
          .then(( data) => {
            assert.ok(
                data.every( (item) => item.get('name') === 'Vasya') && 
                data.get('length') === 2,
              'Contains with correct data: ok'); 
            });
      })
      .then( () => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new StringPredicate('name').contains(null));
        
        store.query('ember-flexberry-dummy-application-user', builder.build())
          .then(( data) => {
            assert.ok(data.get('length') === 0,
              'Contains without data: ok'); 
            });
      })
      .then( () => {
        let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new StringPredicate('name').contains('Ge'));
        
        store.query('ember-flexberry-dummy-application-user', builder.build())
          .then(( data) => {
            assert.ok(data.get('length') === 0,
              `Contains mustn't return any records: ok`); 
            });
      }).finally(done);
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
