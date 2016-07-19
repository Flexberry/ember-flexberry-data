/**
  @module ember-flexberry-data
*/

import LFAdapter from 'ember-localforage-adapter/adapters/localforage';
import generateUniqueId from '../utils/generate-unique-id';

/**
  Default adapter for {{#crossLink "Offline.LocalStore"}}{{/crossLink}}.

  @class Offline
  @namespace Adapter
  @extends <a href="https://github.com/Flexberry/ember-localforage-adapter/blob/master/addon/adapters/localforage.js">LocalforageAdapter</a>
*/
var LocalAdapter = LFAdapter.extend({
  /*
    Adapter initialization.
  */
  init() {
    this._super(...arguments);
    window.localforage.setDriver(window.localforage.INDEXEDDB);
  },

  /*
    Generate globally unique IDs for records.
  */
  generateIdForRecord: generateUniqueId,

  /**
    Clear adapter's cache and IndexedDB's store.

    @method clear
  */
  clear: function () {
    // clear cache
    var cache = this.get('cache');
    if (cache) {
      cache.clear();
    }

    // clear data in localforage
    return window.localforage.setItem(this._adapterNamespace(), []);
  }
});

export default LocalAdapter;
