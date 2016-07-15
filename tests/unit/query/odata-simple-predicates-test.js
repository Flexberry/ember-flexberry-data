import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
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

  test('odata | init data | reading | simple predicates | operators', assert => {
    let done = assert.async();

    let builderStrOp = null;
    let builderConstOp = null;
    let callback = null;

    Ember.run( () => {
      initTestData(store).then( (values) => {
        console.log(values);
        assert.equal(values.length, 4, 'Init data: ok');

        // Eq.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '==', 5);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Eq, 5));

        callback = (data, message) => 
          assert.ok(
              data.every( (item) => item.get('karma') === 5) && 
              data.get('length') === 2,
            message);

        runTest(store, builderStrOp, callback, 'Eq with operator: ok');
        runTest(store, builderConstOp, callback, 'Eq with simple predicate: ok');

                  
        // Neq.   
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '!=', 5);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Neq, 5));

        callback = (data, message) => 
          assert.ok(
              data.every( (item) => item.get('karma') !== 5) && 
              data.get('length') === 2,
            message);

        runTest(store, builderStrOp, callback, 'Neq with operator: ok');
        runTest(store, builderConstOp, callback, 'Neq with simple predicate: ok');


        // Ge.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '>', 4);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Ge, 4));

        callback = (data, message) => 
          assert.ok(
              data.every( (item) => item.get('karma') > 4) && 
              data.get('length') === 3,
            message);

        runTest(store, builderStrOp, callback, 'Ge with operator: ok');
        runTest(store, builderConstOp, callback, 'Ge with simple predicate: ok');


        // Geq.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '>=', 5);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Geq, 5));

        callback = (data, message) => 
          assert.ok(
              data.every( (item) => item.get('karma') >= 5) && 
              data.get('length') === 3,
            message);

        runTest(store, builderStrOp, callback, 'Geq with operator: ok');  
        runTest(store, builderConstOp, callback, 'Geq with simple predicate: ok');  


        // Le.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '<', 6);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Le, 6));

        callback = (data, message) => 
          assert.ok(
              data.every( (item) => item.get('karma') <  6) &&
              data.get('length') === 3,
            message);

        runTest(store, builderStrOp, callback, 'Le with operator: ok');  
        runTest(store, builderConstOp, callback, 'Le with simple predicate: ok');  


        // Leq.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '<=', 5);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Leq, 5));

        callback = (data, message) => 
          assert.ok(
              data.every( (item) => item.get('karma') <=  5) &&
              data.get('length') === 3,
            message);

        runTest(store, builderStrOp, callback, 'Leq with operator: ok'); 
        runTest(store, builderConstOp, callback, 'Leq with simple predicate: ok');  
      }).finally(done);
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
      name: 'Vasya',
      eMail: '2@mail.ru',
      karma: 5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Kolya',
      eMail: '3@mail.ru',
      karma: 5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {    
      name: 'Andrey', 
      eMail: '4@mail.ru',
      karma: 6
    }).save()
  ]);
}

function runTest(store, builder, callback, message = "") {
  store.query('ember-flexberry-dummy-application-user', builder.build())
  	.then( (data) => callback(data, message) );
}          
