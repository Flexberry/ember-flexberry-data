import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor, test } from 'ember-qunit';
import startApp from '../../helpers/start-app';

var App;

moduleFor('transform:decimal', 'Integration | Transform | decimal', {

    beforeEach: function () {
        App = startApp();
    },

    afterEach: function () {
        Ember.$.mockjax.clear();
    }

});

var TestModel = DS.Model.extend({
    decimalNumber: DS.attr('decimal')
});

test('decimal | serialize | number', function (assert) {
    App.register('model:testModel', TestModel);

    let store = App.__container__.lookup('service:store');

    $.mockjax({
        url: "/test-models",
        data: function (json) {
            assert.equal(JSON.parse(json).DecimalNumber, 555.5);
            return true;
        },
        responseText: { DecimalNumber: 555.5 }
    });

    Ember.run(function () {
        store.createRecord('testModel', {
            decimalNumber: 555.5
        }).save();
    });
});

test('decimal | serialize | string with \'.\'', function (assert) {
    App.register('model:testModel', TestModel);

    let store = App.__container__.lookup('service:store');

    $.mockjax({
        url: "/test-models",
        data: function (json) {
            assert.equal(JSON.parse(json).DecimalNumber, 555.5);
            return true;
        },
        responseText: { DecimalNumber: 555.5 }
    });

    Ember.run(function () {
        store.createRecord('testModel', {
            decimalNumber: '555.5'
        }).save();
    });

});

test('decimal | serialize | string with \',\'', function (assert) {
    App.register('model:testModel', TestModel);

    let store = App.__container__.lookup('service:store');

    $.mockjax({
        url: "/test-models",
        data: function (json) {
            assert.equal(JSON.parse(json).DecimalNumber, 555.5);
            return true;
        },
        responseText: { DecimalNumber: 555.5 }
    });

    Ember.run(function () {
        store.createRecord('testModel', {
            decimalNumber: '555,5'
        }).save();
    });
});

test('decimal | deserialize | number', function (assert) {
    App.register('model:testModel', TestModel);

    let store = App.__container__.lookup('service:store');

    $.mockjax({
        url: '/test-models/1',
        dataType: 'json',
        responseText: { id: 1, DecimalNumber: 555.5 }
    });

    Ember.run(function () {
        store.findRecord('testModel', 1).then(function (data) {
            assert.equal(data.get('decimalNumber'), 555.5);
        });
        wait();
    });
});

test('decimal | deserialize | string', function (assert) {
    App.register('model:testModel', TestModel);

    let store = App.__container__.lookup('service:store');

    $.mockjax({
        url: '/test-models/1',
        dataType: 'json',
        responseText: { id: 1, DecimalNumber: '555.5' }
    });

    Ember.run(function () {
        store.findRecord('testModel', 1).then(function (data) {
            assert.equal(data.get('decimalNumber'), 555.5);
        });
        wait();
    });
});