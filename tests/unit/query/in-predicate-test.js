import { module, test } from 'qunit';

import { InPredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | in | constructor', function (assert) {
  assert.throws(() => new InPredicate(), Error);
  assert.throws(() => new InPredicate(''), Error);
  assert.throws(() => new InPredicate(null), Error);
  assert.throws(() => new InPredicate(null, ''), Error);
  assert.throws(() => new InPredicate('', null), Error);
  assert.throws(() => new InPredicate('', ''), Error);
  assert.throws(() => new InPredicate('', 2), Error);

  let p = new InPredicate('City', ['Perm', 'Moscow', 'Paris']);

  assert.ok(p);
  assert.equal(p.attributePath, 'City');
});
