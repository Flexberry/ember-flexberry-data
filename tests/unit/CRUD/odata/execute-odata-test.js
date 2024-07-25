import { set } from '@ember/object';
import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import OdataAdapter from 'ember-flexberry-data/adapters/odata';

import config from '../../../../../dummy/config/environment';

import { clearOnlineData } from '../../../helpers/clear-data';

let App;
let store;

export default function executeTest(testName, callback, skipTest) {
  if (config.APP.testODataService) {
    let baseUrl;
    if (config.APP.testODataServiceURL.indexOf('http') >= 0) {
      baseUrl = config.APP.testODataServiceURL;
    } else {
      baseUrl = 'http://localhost:80/odata';
    }

    module('CRUD | odata-' + testName, function(hooks) {
      setupApplicationTest(hooks);

      hooks.beforeEach(function() {
        App = this.owner;
        store = this.owner.lookup('service:store');
        const adapter = OdataAdapter.create(this.owner.ownerInjection());
        set(adapter, 'host', baseUrl);
        store.onlineStore.adapterFor = function adapterFor() { return adapter; };
      });

      (skipTest ? skip : test)(testName, (assert) => clearOnlineData(store).then(() => callback(store, assert, App)));
    });
  }
}
