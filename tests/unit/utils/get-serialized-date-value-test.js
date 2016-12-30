import getSerializedDateValue from 'ember-flexberry-data/utils/get-serialized-date-value';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

let App;

module('Unit | Utility | get serialized date value', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  let store = App.__container__.lookup('service:store');
  let dateTransform = App.__container__.lookup('transform:date');
  let date = new Date(1981, 10, 12, 13, 14, 15);
  let expectedResult = dateTransform.serialize(date);
  let result = getSerializedDateValue.call(store, date);
  assert.ok(result);
  assert.equal(result, expectedResult);
});
