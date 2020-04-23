import { module, test } from 'qunit';

import { CustomPredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | custom | constructor', function (assert) {
  assert.throws(() => new CustomPredicate('error'), Error);
  assert.throws(() => new CustomPredicate(123), Error);

  let p = new CustomPredicate({
    testOption: 'Test',
    converters: {
      odata: () => {
        return 'OdataFilter';
      }
    }
  });

  assert.ok(p);
  assert.ok(p.options);
  assert.equal(p.options.testOption, 'Test');
  assert.ok(p.odataConverter instanceof Function);
  assert.equal(p.odataConverter(), 'OdataFilter');
});
