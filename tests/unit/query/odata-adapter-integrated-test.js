import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';

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

  module('query');

  test('adapter | integrated odata | without predicate', (assert) => {
    let builder = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion');

    runTest(assert, store, builder, (data) => {
      assert.ok(data);
    });
  });

  test('adapter | integrated odata | create', (assert) => {
    assert.expect(0);
    let done = assert.async();
    Ember.run(() => {
      store.createRecord('ember-flexberry-dummy-localization', {
        name: 'Test'
      }).save().then(done);
    });
  });
}

function runTest(assert, store, builder, callback) {
  let done = assert.async();
  store.query('ember-flexberry-dummy-suggestion', builder.build()).then((data) => {
    callback(data);
    done();
  });
}
