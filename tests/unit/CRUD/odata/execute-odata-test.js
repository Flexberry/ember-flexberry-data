import { set } from '@ember/object';
import { A } from '@ember/array';
import DS from 'ember-data';
import { module, test } from 'qunit';

import OdataAdapter from 'ember-flexberry-data/adapters/odata';
import StoreMixin from 'ember-flexberry-data/mixins/store';

import startApp from '../../../helpers/start-app';
import config from '../../../../../dummy/config/environment';

export default function executeTest(testName, callback) {
  if (config.APP.testODataService) {
    let baseUrl;
    if (config.APP.testODataServiceURL.indexOf('http') >= 0) {
      let index = config.APP.testODataServiceURL.lastIndexOf('/');
      if (index !== config.APP.testODataServiceURL.length - 1) {
        baseUrl = config.APP.testODataServiceURL + '/';
      } else {
        baseUrl = config.APP.testODataServiceURL;
      }
    } else {
      baseUrl = 'http://rtc-web:8081/odatatmp/';
    }

    baseUrl += 'ember' + Math.floor(Math.random() * 9999);

    const app = startApp();
    const store = app.__container__.lookup('service:store');
    let onlineStore = DS.Store.reopen(StoreMixin).create(app.__container__.ownerInjection());
    store.set('onlineStore', onlineStore);

    // Override store.unloadAll method.
    const originalUnloadAll = store.unloadAll;
    store.unloadAll = function() {
      originalUnloadAll.apply(store, arguments);

      // Clean up type maps otherwise internal models won't be cleaned from stores,
      // and it will cause some exceptions related to store's internal-models statuses.
      A([store, store.get('onlineStore'), store.get('offlineStore')]).forEach((s) => {
        set(s, 'typeMaps', {});
      });
    };

    // Define OData-adapter as default adapter for online store.
    const adapter = OdataAdapter.create(app.__container__.ownerInjection());
    set(adapter, 'host', baseUrl);
    store.get('onlineStore').reopen({
      adapterFor() {

        return adapter;
      }
    });

    module('CRUD | odata-' + testName);

    test(testName, (assert) => callback(store, assert, app));
  }
}
