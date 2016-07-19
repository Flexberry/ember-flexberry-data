import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';
import DS from 'ember-data';
import isModelInstance from 'ember-flexberry-data/utils/is-model-instance';

let App;

let customerModel = DS.Model.extend({
  contactName: DS.attr('string')
});

module('Unit | Utility | is model instance', {
  setup: function() {
    App = startApp();
    App.register('model:customer', customerModel);
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  let model;
  Ember.run(function () {
    model = App.__container__.lookup('service:store').createRecord('customer', { contactName: 'John' });
  });
  let result = isModelInstance(model);
  assert.ok(result);
});
