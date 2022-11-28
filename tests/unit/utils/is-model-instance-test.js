import { run } from '@ember/runloop';
import DS from 'ember-data';
import { module, test } from 'qunit';
import startApp from 'dummy/tests/helpers/start-app';
import isModelInstance from 'ember-flexberry-data/utils/is-model-instance';

let App;
let CustomerModel = DS.Model.extend({
  contactName: DS.attr('string')
});

module('Unit | Utility | is model instance', {
  beforeEach() {
    App = startApp();

    if (App) {
      App.register('model:customer', CustomerModel);
    }
  },

  afterEach() {
    run(App, 'destroy');
  },
});

test('it works', function(assert) {
  run(() => {
    let notModel;
    let model = App.__container__.lookup('service:store').createRecord('customer', {
      contactName: 'John',
    });

    assert.ok(isModelInstance(model));
    assert.notOk(isModelInstance(notModel));
  });
});
