import Ember from 'ember';
import { module, test } from 'qunit';

import IndexedDbAdapter from 'ember-flexberry-data/query/indexeddb-adapter';

module('query');

test('adapter indexeddb without predicate', (assert) => {
  let done = assert.async();
  createTempDatabase().then(() => {
    let adapter = new IndexedDbAdapter('test5');
    adapter.query().then((d) => {
      // TODO: checks
      assert.ok(d);
      done();
    }, () => {
      assert.notOk(true, 'Error in executing query');
      done();
    });
  }, () => {
    assert.notOk(true, 'Error in creating temp DB');
    done();
  });
});

function createTempDatabase() {
  return new Ember.RSVP.Promise((resolve, reject) => {
    let req = window.indexedDB.open('test5', 1);
    req.onsuccess = resolve;
    req.onerror = reject;
    req.onupgradeneeded = (evt) => {
      // TODO: create indexes by model
      let db = evt.currentTarget.result;
      let store = db.createObjectStore('customers', { keyPath: 'id' });
      store.createIndex('title', 'title', { unique: false });
      store.add({ id: '1', title: 'First title' });
    };
  });
}
