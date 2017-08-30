import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor, test } from 'ember-qunit';
import startApp from '../../helpers/start-app';

var App;
var store;

var TestModel = DS.Model.extend({
  decimalNumber: DS.attr('decimal')
});

moduleFor('transform:decimal', 'Integration | Transform | decimal', {

  beforeEach: function () {
    App = startApp();
    App.register('model:testModel', TestModel);
    store = App.__container__.lookup('service:store');
    store.set('onlineStore', DS.Store.create(App.__container__.ownerInjection()));
  },

  afterEach: function () {
    Ember.$.mockjax.clear();
  }

});

test('decimal | serialize | number', function (assert) {
  $.mockjax({
    url: '/test-models',
    data: function (json) {
      assert.equal(JSON.parse(json).DecimalNumber, 555.5);
      return true;
    },
    responseText: { id: 1, DecimalNumber: 555.5 }
  });

  Ember.run(() => {
    store.createRecord('testModel', {
      decimalNumber: 555.5
    }).save();
  });
});

test('decimal | serialize | string with \'.\'', function (assert) {
  $.mockjax({
    url: '/test-models',
    data: function (json) {
      assert.equal(JSON.parse(json).DecimalNumber, 555.5);
      return true;
    },
    responseText: { id: 1, DecimalNumber: 555.5 }
  });

  Ember.run(() => {
    store.createRecord('testModel', {
      decimalNumber: '555.5'
    }).save();
  });

});

test('decimal | serialize | string with \',\'', function (assert) {
  $.mockjax({
    url: '/test-models',
    data: function (json) {
      assert.equal(JSON.parse(json).DecimalNumber, 555.5);
      return true;
    },
    responseText: { id: 1, DecimalNumber: 555.5 }
  });

  Ember.run(() => {
    store.createRecord('testModel', {
      decimalNumber: '555,5'
    }).save();
  });
});

test('decimal | deserialize | number', function (assert) {
  $.mockjax({
    url: '/test-models/1',
    dataType: 'json',
    responseText: { id: 1, DecimalNumber: 555.5 }
  });

  Ember.run(() => {
    store.findRecord('testModel', 1).then(function (data) {
      assert.equal(data.get('decimalNumber'), 555.5);
    });
    wait();
  });
});

test('decimal | deserialize | string with \'.\'', function (assert) {
  $.mockjax({
    url: '/test-models/1',
    dataType: 'json',
    responseText: { id: 1, DecimalNumber: '555.5' }
  });

  Ember.run(() => {
    store.findRecord('testModel', 1).then(function (data) {
      assert.equal(data.get('decimalNumber'), 555.5);
    });
    wait();
  });
});

test('decimal | deserialize | string with \',\'', function (assert) {
  $.mockjax({
    url: '/test-models/1',
    dataType: 'json',
    responseText: { id: 1, DecimalNumber: '555,5' }
  });

  Ember.run(() => {
    store.findRecord('testModel', 1).then(function (data) {
      assert.equal(data.get('decimalNumber'), 555.5);
    });
    wait();
  });
});
