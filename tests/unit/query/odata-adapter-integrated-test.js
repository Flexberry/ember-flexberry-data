import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';

import startApp from '../../helpers/start-app';
import config from '../../../../dummy/config/environment';

if (config.APP.testODataService) {
  const baseUrl = 'http://flexberry-ember-dummy.azurewebsites.net/odata';
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

    console.log();
    runTest(assert, store, builder, (data) => {
      assert.ok(data);
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
