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

  test('adapter | integrated odata | create and query by id', (assert) => {
    assert.expect(4);
    let done = assert.async();

    Ember.run(() => {
      let record = store.createRecord('ember-flexberry-dummy-localization', {
        name: 'Test'
      });

      record
        .save()
        .then((createdRecord) => {
          let id = createdRecord.get('id');
          assert.ok(id);

          // Reload created record by identifier.
          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-localization').select('name').byId(id);
          return store.query('ember-flexberry-dummy-localization', builder.build());
        }, (e) => console.log(e.message))
        .then((result) => {
          assert.ok(result);

          let firstRecord = result.get('firstObject');
          assert.ok(firstRecord);
          assert.equal(firstRecord.get('name'), 'Test');
          console.log(firstRecord.get('name'));
        }, (e) => console.log(e.message))
        .finally(done);
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
