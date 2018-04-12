/*global wait $*/
import { run } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';

import OdataAdapter from 'ember-flexberry-data/adapters/odata';

import startApp from '../../helpers/start-app';

moduleFor('adapter:odata', 'Unit | Adapter | odata | ajax', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('ajax functions tests', function(assert) {
  let done = assert.async();
  const app = startApp();
  const adapter = OdataAdapter.create(app.__container__.ownerInjection());

  run(() => {
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
    .catch(e => {
      // eslint-disable-next-line no-console
      console.log(e, e.message);
      assert.ok(false, e.message);
    })
    .finally(done);
  });
  wait();
});
