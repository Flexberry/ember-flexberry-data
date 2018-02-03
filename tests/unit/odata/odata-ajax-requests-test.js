import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import executeTest from '../CRUD/odata/execute-odata-test';
import startApp from '../../helpers/start-app';

var App;
executeTest('ajax | requests', (store, assert) => {
  let done = assert.async();
  Ember.run(() => {
    (() => {
        App = startApp();
        adapter = App.__container__.lookup('adapter:application');
        $.mockjax({
          url: '/test-models',
          data: function (json) {
            assert.equal(JSON.parse(json).DecimalNumber, 555.5);
            return true;
          },
          responseText: { ab: 'cd' }
        });
        return adapter.callAction('abcd', 'def', { abcd: 'def' })
          .then((data) => {
            assert.equal(data.get('length'), 6, 'Leq | length');
            assert.ok(data.any(item => item.get('karma') === 5.5), 'Leq | data');
          });
      })
      .then(() => {

      })

      .catch(e => console.log(e, e.message))
      .finally(done);
  });
  wait();
});
