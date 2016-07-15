import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';
//import FilterOperator from 'ember-flexberry-data/query/filter-operator';


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

  module('curTests');

  test('odata | reading | simple predicates', assert => {
    let done = assert.async();

    Ember.run( () => {    

      let builder = null;
      initTestData(store).then( (values) => {
        assert.equal(values.length, 4, 'Init data is ok');
        console.log(values);

        // Eq.
        builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '==', 5);
        runTest(store, builder, (data) => 
        	assert.ok(
          	data.every( (item) => item.get('karma') === 5) && 
          	data.get('length') === 2,
          'Eq is ok') );
              
        // Neq.   
        builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '!=', 5);
        runTest(store, builder, (data) => 
        	assert.ok( (
          	data.every( (item) => item.get('karma') !== 5) && 
          	data.get('length') === 2),
          'Neq is ok') );

        // Ge.
        builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '>', 4);
        runTest(store, builder, (data) => 
        	assert.ok( (
          	data.every( (item) => item.get('karma') > 4) && 
            	data.get('length') === 3),
        	'Ge is ok') );  

        // Geq.
        builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '>=', 5);
        runTest(store, builder, (data) => 
        	assert.ok( (
          	data.every( (item) => item.get('karma') >= 5) &&
          	data.get('length') === 3),
          'Geq is ok' ) );  

        // Le.
        builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '<', 6);
        runTest(store, builder, (data) => 
        	assert.ok( (
          	data.every( (item) => item.get('karma') <  6) &&
          	data.get('length') === 3),
          'Le is ok' ) );  

        // Leq.
        builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '<=', 5);
        runTest(store, builder, (data) => 
          assert.ok( (
            data.every( (item) => item.get('karma') <=  5) &&
            data.get('length') === 3),
          'Leq is ok' ) );  
      })
      .finally(done);
    });
  });

}


function initTestData(store) {
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      gender: 1,        
      eMail: '1@mail.ru',
      karma: 4
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Oleg',
      gender: 1,        
      eMail: '2@mail.ru',
      karma: 5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Kolya',
      gender: 1,        
      eMail: '3@mail.ru',
      karma: 5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {    
      name: 'Andrey', 
      gender: 1,               
      eMail: '4@mail.ru',
      karma: 6
    }).save()
  ]);
}

function runTest(store, builder, callback) {
  store.query('ember-flexberry-dummy-application-user', builder.build())
  	.then( data => callback(data) );          
}