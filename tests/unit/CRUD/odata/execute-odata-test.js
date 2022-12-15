import { set } from '@ember/object';
import { A } from '@ember/array';
import { module, skip, test } from 'qunit';

import OnlineStore from 'ember-flexberry-data/stores/online-store';
import OfflineStore from 'ember-flexberry-data/stores/local-store';
import OdataAdapter from 'ember-flexberry-data/adapters/odata';
import StoreMixin from 'ember-flexberry-data/mixins/store';

import startApp from '../../../helpers/start-app';
import config from '../../../../../dummy/config/environment';

import { clearOnlineData } from '../../../helpers/clear-data';

export default function executeTest(testName, callback, skipTest) {
  if (config.APP.testODataService) {
    let baseUrl;
    if (config.APP.testODataServiceURL.indexOf('http') >= 0) {
      baseUrl = config.APP.testODataServiceURL;
    } else {
      baseUrl = 'http://localhost:80/odata';
    }

    const app = startApp();

    app.__container__.registry.register('store:local', OfflineStore);
    const store = app.__container__.lookup('service:store');
    let onlineStore = OnlineStore.reopen(StoreMixin).create(app.__container__.ownerInjection());
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

    (skipTest ? skip : test)(testName, (assert) => clearOnlineData(store).then(() => callback(store, assert, app)));
  }
}
