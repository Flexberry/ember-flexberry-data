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

  module('OData');

  test('query | store commands', (assert) => {
    assert.ok(true, 'Start test');
    let done = assert.async();

    Ember.run(() => {
      store.createRecord('ember-flexberry-dummy-application-user', {
        name: 'User 1',
        eMail: '1'
      }).save()

        // findRecord.
        .then(() => {
          store.createRecord('ember-flexberry-dummy-application-user', {
            name: 'User 2',
            eMail: '2'
          }).save()
            .then((record) => {
              let id = record.get('id');
              store.findRecord('ember-flexberry-dummy-application-user', id)
                .then((data) => {
                  assert.equal(data.get('name'), 'User 2', 'findRecord | Data');
                });
            });
        })
        .finally(done);
    });
  });
}
