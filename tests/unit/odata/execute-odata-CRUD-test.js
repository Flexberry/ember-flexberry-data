import Ember from 'ember';
import { module, test } from 'qunit';

import ODataAdapter from 'ember-flexberry-data/adapters/odata';

import startApp from '../../helpers/start-app';
import config from '../../../../dummy/config/environment';

export default function executeTest(testName, callback) {
  if (config.APP.testODataService) {
    const randKey = Math.floor(Math.random() * 9999);
    const baseUrl = 'http://rtc-web:8081/odatatmp/ember' + randKey;
    const app = startApp();
    const store = app.__container__.lookup('service:store');

    const adapter = ODataAdapter.create(app.__container__.ownerInjection());
    Ember.set(adapter, 'host', baseUrl);

    store.get('onlineStore').reopen({
      adapterFor() {
        return adapter;
      }
    });
    module('OData | CRUD');

    test(testName, (assert) => callback(store, assert));
  }
}
