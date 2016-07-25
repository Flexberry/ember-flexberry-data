import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
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

  test('reading | predicates | simple predicates | operators', (assert) => {
    assert.ok(true, 'Start test');
    let done = assert.async();

    let builderStrOp = null;
    let builderConstOp = null;
    let callback = null;

    Ember.run(() => {
      initTestData(store)
      .then(() => {

        // Eq.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '==', 5);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Eq, 5));

        callback = (data, messages) => {
          assert.ok(data.every(item => item.get('karma') === 5), messages[0]);
          assert.equal(data.get('length'), 2, messages[1]);
        };

        runTest(store, builderStrOp, callback, [
          'Eq with operator | Data', 'Eq with operator | Length'
          ]);
        runTest(store, builderConstOp, callback, [
          'Eq with simple predicate | Data', 'Eq with simple predicate | Length'
          ]);

        // Neq.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '!=', 5);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Neq, 5));

        callback = (data, messages) => {
          assert.ok(data.every(item => item.get('karma') !== 5), messages[0]);
          assert.equal(data.get('length'), 2, messages[1]);
        };

        runTest(store, builderStrOp, callback, [
          'Neq with operator | Data', 'Neq with operator | Length'
          ]);
        runTest(store, builderConstOp, callback, [
          'Neq with simple predicate | Data', 'Neq with simple predicate | Length'
          ]);

        // Ge.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '>', 4);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Ge, 4));

        callback = (data, messages) => {
          assert.ok(data.every(item => item.get('karma') > 4), messages[0]);
          assert.equal(data.get('length'), 3, messages[1]);
        };

        runTest(store, builderStrOp, callback, [
          'Ge with operator | Data', 'Ge with operator | Length'
          ]);
        runTest(store, builderConstOp, callback, [
          'Ge with simple predicate | Data', 'Ge with simple predicate | Length'
          ]);

        // Geq.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '>=', 5);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Geq, 5));

        callback = (data, messages) => {
          assert.ok(data.every(item => item.get('karma') >= 5), messages[0]);
          assert.equal(data.get('length'), 3, messages[1]);
        };

        runTest(store, builderStrOp, callback, [
          'Geq with operator | Data', 'Geq with operator | Length'
          ]);
        runTest(store, builderConstOp, callback, [
          'Geq with simple predicate | Data', 'Geq with simple predicate | Length'
          ]);

        // Le.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '<', 6);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Le, 6));

        callback = (data, messages) => {
          assert.ok(data.every(item => item.get('karma') <  6), messages[0]);
          assert.equal(data.get('length'), 3, messages[1]);
        };

        runTest(store, builderStrOp, callback, [
          'Le with operator | Data', 'Le with operator | Length'
          ]);
        runTest(store, builderConstOp, callback, [
          'Le with simple predicate data', 'Le with simple predicate length'
          ]);

        // Leq.
        builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where('karma', '<=', 5);
        builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
          .where(new SimplePredicate('karma', FilterOperator.Leq, 5));

        callback = (data, messages) => {
          assert.ok(data.every(item => item.get('karma') <=  5), messages[0]);
          assert.equal(data.get('length'), 3, messages[1]);
        };

        runTest(store, builderStrOp, callback, [
          'Leq with operator | Data', 'Leq with operator | Length'
          ]);
        runTest(store, builderConstOp, callback, [
          'Leq with simple predicate | Data', 'Leq with simple predicate | Length'
          ]);
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

function runTest(store, builder, callback, message = '') {
  store.query('ember-flexberry-dummy-application-user', builder.build())
    .then((data) => callback(data, message));
}
