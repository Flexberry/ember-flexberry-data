import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor, test } from 'ember-qunit';
import { Adapter } from 'ember-flexberry-data';
import startApp from '../../helpers/start-app';

const testStore = DS.Store.extend({
  push(data) {
    return Ember.run(() => this._super(data));
  }
});

moduleFor('adapter:odata', 'Unit | Adapter | odata | ajax', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});

test('ajax functions tests', function(assert) {
  let done = assert.async();
  const app = startApp();
  app.register('service:test-store', testStore);
  const adapter = Adapter.Odata.create(app.__container__.ownerInjection());
  const store = app.__container__.lookup('service:test-store');

  Ember.run(() => {
    $.mockjax({
      url: '/test-models/test',
      responseText: { ab: 'cd' }
    });
    return adapter.callAction('test', { abcd: 'def' }, '/test-models')
    .then((msg) => {
      assert.equal(msg.ab, 'cd', 'getting POST response');
    })

    .then(() => {
      $.mockjax({
        url: '/test-models/test(abcd=\'def\')',
        type: 'GET',
        responseText: { ab: 'cd' }
      });
      return adapter.callFunction('test', { abcd: 'def' }, '/test-models')
      .then((msg) => {
        assert.equal(msg.ab, 'cd', 'getting GET response');
      });
    })
    .then(() => {
      $.mockjax({
        url: '/test-models/test',
        responseText: { ab: 'cd' }
      });
      return adapter.callAction(
        'test', { abcd: 'def' },
        '/test-models',
        null,
        (msg) => {
          assert.equal(msg.ab + ' success', 'cd success', 'successCallback works');
          return msg.ab + ' success';
        },
        (msg) => {
          assert.notEqual(msg.ab, 'cd', 'failCallback works');
          return msg.ab + ' fail';
        },
        (msg) => {
          assert.equal(msg.ab + ' always', 'cd always', 'alwaysCallback works');
          return msg.ab + ' always';
        })
      .then((msg) => {
        assert.equal(msg.ab, 'cd', 'getting GET response');
      });
    })

    .then(() => {
      $.mockjax({
        url: '/test-models/test-odata-function()',
        type: 'GET',
        responseText: { value: [{ __PrimaryKey: '1', Name: 'Russia' }, { __PrimaryKey: '2', Name: 'Kongo' }] }
      });
      return adapter.callEmberOdataFunction('test-odata-function', { }, '/test-models', null, store, 'country')
      .then((msg) => {
        assert.equal(msg.length, 2, 'correct record number');
        msg.forEach(record => {
          assert.equal(record.constructor.toString(), 'dummy@model:country:', 'is instance of correct model');
        });
      });
    })

    .then(() => {
      $.mockjax({
        url: '/test-models/test-odata-action()',
        responseText: { value: [{ __PrimaryKey: '1', Name: 'Russia' }, { __PrimaryKey: '2', Name: 'Kongo' }] }
      });
      return adapter.callEmberOdataFunction('test-odata-action', { }, '/test-models', null, store, 'country')
      .then((msg) => {
        assert.equal(msg.length, 2, 'correct record number');
        msg.forEach(record => {
          assert.equal(record.constructor.toString(), 'dummy@model:country:', 'is instance of correct model');
        });
      });
    })

    .catch(e => {
      console.log(e, e.message);
      assert.ok(false, e.message);
    })
    .finally(done);
  });
  wait();
});
