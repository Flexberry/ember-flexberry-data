import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

import { Adapter } from 'ember-flexberry-data';

import startApp from '../../helpers/start-app';

moduleFor('adapter:odata', 'Unit | Adapter | odata | ajax', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('ajax functions tests', function(assert) {
  let done = assert.async();
  const app = startApp();
  const adapter = Adapter.Odata.create(app.__container__.ownerInjection());

  Ember.run(() => {
    $.mockjax({
      url: '/test-models/test',
      responseText: { ab: 'cd' }
    });
    return adapter.callAction('/test-models', 'test', { abcd: 'def' })
    .then((msg) => {
      assert.equal(msg.ab, 'cd');
    })

    .then(() => {
      $.mockjax({
        url: '/test-models/test(abcd=\'def\')',
        type: 'GET',
        responseText: { ab: 'cd' }
      });
      return adapter.callFunction('/test-models', 'test', { abcd: 'def' })
      .then((msg) => {
        assert.equal(msg.ab, 'cd');
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
