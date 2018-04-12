import { run, later  } from '@ember/runloop';
import { get } from '@ember/object';
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
import destroyApp from '../../helpers/destroy-app';

let app;

module('Unit | Model | validations', {
  beforeEach: function() {
    app = startApp();
  },
  afterEach: function() {
    destroyApp(app);
  }
});

test('validation fails when data is not loaded', function(assert) {
  assert.expect(7);

  run(() => {
    let store = app.__container__.lookup('service:store');
    let baseModel = store.createRecord('validations/base');

    run(() => {
      let asyncOperationsCompleted = assert.async();

      baseModel.validate().catch((e) => {
        assert.strictEqual(e, get(baseModel, 'errors'), 'Validation failed & validation errors object returned');
        assert.strictEqual(get(e, 'flag')[0], 'Flag is required', 'Boolean required validator works properly');
        assert.strictEqual(get(e, 'flag')[1], 'Flag must be \'true\' only', 'Boolean value validator works properly');
        assert.strictEqual(get(e, 'flag').length, 2);
        assert.strictEqual(get(e, 'master')[0], 'Master is required', 'BelongsTo required validator works properly');
        assert.strictEqual(get(e, 'master').length, 1);
        assert.strictEqual(get(e, 'details').length, 0, 'Validation rules for hasMany relationship are not used when details array is empty');
      }).finally(() => {
        asyncOperationsCompleted();
      });
    });
  });
});

test('validation fails when data is invalid', function(assert) {
  assert.expect(5);

  run(() => {
    let store = app.__container__.lookup('service:store');
    let baseModel = store.createRecord('validations/base', {
      flag: false,
      master: store.createRecord('validations/master', { text: 'Master text' })
    });

    run(() => {
      let asyncOperationsCompleted = assert.async();

      baseModel.validate().catch((e) => {
        assert.strictEqual(e, get(baseModel, 'errors'), 'Validation failed & validation errors object returned');
        assert.strictEqual(get(e, 'flag')[0], 'Flag must be \'true\' only', 'Flag must be \'true\' only', 'Boolean value validator works properly');
        assert.strictEqual(get(e, 'flag').length, 1);
        assert.strictEqual(get(e, 'master').length, 0);
        assert.strictEqual(get(e, 'details').length, 0, 'Validation rules for hasMany relationship are not used when details array is empty');
      }).finally(() => {
        asyncOperationsCompleted();
      });
    });
  });
});

test('validation fails when details data is not loaded', function(assert) {
  assert.expect(8);

  run(() => {
    let store = app.__container__.lookup('service:store');
    let baseModel = store.createRecord('validations/base', {
      flag: true,
      master: store.createRecord('validations/master', { text: 'Master text' })
    });

    let detailModel1 = store.createRecord('validations/detail');
    let detailModel2 = store.createRecord('validations/detail');

    let details = baseModel.get('details');
    details.pushObject(detailModel1);
    details.pushObject(detailModel2);

    // In aggregator model details observers handlers are running through Ember.run.once,
    // it leads to some execution delay, thats why we use Ember.run.later hare to start assertions.
    let asyncOperationsCompleted = assert.async();
    later(() => {
      baseModel.validate().catch((e) => {
        assert.strictEqual(e, get(baseModel, 'errors'), 'Validation failed & validation errors object returned');
        assert.strictEqual(get(e, 'flag').length, 0);
        assert.strictEqual(get(e, 'master').length, 0);
        assert.strictEqual(get(e, 'details').length, 4, 'Errors array for hasMany relationship contains errors for all related details');
        assert.strictEqual(get(e, 'details')[0], 'Number is required');
        assert.strictEqual(get(e, 'details')[1], 'Number is invalid');
        assert.strictEqual(get(e, 'details')[2], 'Number is required');
        assert.strictEqual(get(e, 'details')[3], 'Number is invalid');
      }).finally(() => {
        asyncOperationsCompleted();
      });
    }, 500);
  });
});

test('validation fails when details data is invalid', function(assert) {
  assert.expect(5);

  run(() => {
    let store = app.__container__.lookup('service:store');
    let baseModel = store.createRecord('validations/base', {
      flag: true,
      master: store.createRecord('validations/master', { text: 'Master text' })
    });

    // Detail with valid (odd) number.
    let detailModel1 = store.createRecord('validations/detail', { number: 1 });

    // Detail with invalid number.
    let detailModel2 = store.createRecord('validations/detail', { number: 2 });

    let details = baseModel.get('details');
    details.pushObject(detailModel1);
    details.pushObject(detailModel2);

    // In aggregator model details observers handlers are running through Ember.run.once,
    // it leads to some execution delay, thats why we use Ember.run.later hare to start assertions.
    let asyncOperationsCompleted = assert.async();
    later(() => {
      baseModel.validate().catch((e) => {
        assert.strictEqual(e, get(baseModel, 'errors'), 'Validation failed & validation errors object returned');
        assert.strictEqual(get(e, 'flag').length, 0);
        assert.strictEqual(get(e, 'master').length, 0);
        assert.strictEqual(get(e, 'details').length, 1, 'Errors array for hasMany relationship contains errors for all details with invalid data');
        assert.strictEqual(get(e, 'details')[0], 'Number must be an odd');
      }).finally(() => {
        asyncOperationsCompleted();
      });
    }, 500);
  });
});

test('validation succeeds when all data is valid', function(assert) {
  assert.expect(4);

  run(() => {
    let store = app.__container__.lookup('service:store');
    let baseModel = store.createRecord('validations/base', {
      flag: true,
      master: store.createRecord('validations/master', { text: 'Master text' })
    });

    // Details with valid (odd) numbers.
    let detailModel1 = store.createRecord('validations/detail', { number: 1 });
    let detailModel2 = store.createRecord('validations/detail', { number: 3 });

    let details = baseModel.get('details');
    details.pushObject(detailModel1);
    details.pushObject(detailModel2);

    // In aggregator model details observers handlers are running through Ember.run.once,
    // it leads to some execution delay, thats why we use Ember.run.later hare to start assertions.
    let asyncOperationsCompleted = assert.async();
    later(() => {
      baseModel.validate().then((e) => {
        assert.strictEqual(e, get(baseModel, 'errors'), 'Validation secceeds & validation errors object returned');
        assert.strictEqual(get(e, 'flag').length, 0);
        assert.strictEqual(get(e, 'master').length, 0);
        assert.strictEqual(get(e, 'details').length, 0);
      }).finally(() => {
        asyncOperationsCompleted();
      });
    }, 500);
  });
});
