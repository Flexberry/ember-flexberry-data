import Ember from 'ember';
import { module, test } from 'qunit';

import ODataAdapter from 'ember-flexberry-data/adapters/odata';

import startApp from '../../helpers/start-app';

const app = startApp();
const store = app.__container__.lookup('service:store');

// User service for auditable models.
let mockUserService = Ember.Service.extend({
  getName() { return this.get('name'); }
}).create({ name: 'Vasya' });
app.register('service:mockuser', mockUserService, { instantiate: false });
app.inject('model', '_userService', 'service:mockuser');

// ED adapter.
const randKey = Math.floor(Math.random() * 9999);
const baseUrl = 'http://rtc-web:8081/odatatmp/ember' + randKey;

const adapter = ODataAdapter.create();
Ember.set(adapter, 'host', baseUrl);

store.reopen({
  adapterFor() {
    return adapter;
  },
});

module('audit');

test('snapshots | own fields', (assert) => {
  let done = assert.async();

  Ember.run(() => {
    let type = store.createRecord('ember-flexberry-dummy-suggestion-type', {
      name: 'FirstType'
    });

    let user1 = store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'First',
      eMail: 'a1@b.c'
    });

    let user2 = store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Second',
      eMail: 'a2@b.c'
    });

    Ember.RSVP.all([type.save(), user1.save(), user2.save()]).then(() => {
      let record = store.createRecord('ember-flexberry-dummy-suggestion', {
        text: 'Test',
        author: user1,
        editor1: user1,
        type: type
      });
      let snapshots = record.get('_snapshots');

      assert.ok(record);
      assert.ok(snapshots);
      assert.equal(snapshots.length, 0);

      assert.notOk(record.get('creator'));
      assert.notOk(record.get('createTime'));
      assert.notOk(record.get('editor'));
      assert.notOk(record.get('editTime'));

      // Save new record.
      return record.save();
    }).then((record) => {
      let snapshots = record.get('_snapshots');

      assert.ok(snapshots);
      assert.equal(snapshots.length, 1);

      assert.notOk(snapshots[0].attrs.text[0]);
      assert.equal(snapshots[0].attrs.text[1], 'Test');

      assert.notOk(snapshots[0].attrs.creator[0]);
      assert.equal(snapshots[0].attrs.creator[1], 'Vasya');
      assert.notOk(snapshots[0].attrs.createTime[0]);
      assert.ok(snapshots[0].attrs.createTime[1]);
      assert.notOk(snapshots[0].attrs.editor);
      assert.notOk(snapshots[0].attrs.editTime);

      assert.equal(record.get('creator'), 'Vasya');
      assert.ok(record.get('createTime'));
      assert.notOk(record.get('editor'));
      assert.notOk(record.get('editTime'));

      // Update existed record.
      record.set('author', user2);    // Relation.
      console.log(record.get('dirtyType'));
      record.set('text', 'existed');  // Own field.
      console.log(record.get('dirtyType'));
      return record.save();
    }).then((record) => {
      let snapshots = record.get('_snapshots');

      assert.ok(snapshots);
      assert.equal(snapshots.length, 2);

      assert.equal(snapshots[1].attrs.text[0], 'Test');
      assert.equal(snapshots[1].attrs.text[1], 'existed');

      assert.ok(snapshots[1].attrs.author);

      assert.notOk(snapshots[1].attrs.creator);
      assert.notOk(snapshots[1].attrs.createTime);
      assert.notOk(snapshots[1].attrs.editor[0]);
      assert.equal(snapshots[1].attrs.editor[1], 'Vasya');
      assert.notOk(snapshots[1].attrs.editTime[0]);
      assert.ok(snapshots[1].attrs.editTime[1]);

      assert.equal(record.get('creator'), 'Vasya');
      assert.ok(record.get('createTime'));
      assert.equal(record.get('editor'), 'Vasya');
      assert.ok(record.get('editTime'));

      done();
    });
  });
});
