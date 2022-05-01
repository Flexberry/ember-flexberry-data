import { module, test } from 'qunit';

import { GeometryPredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | geometry | constructor', function (assert) {
  assert.throws(() => new GeometryPredicate(), Error);
  assert.throws(() => new GeometryPredicate(''), Error);
  assert.throws(() => new GeometryPredicate(null), Error);

  let p = new GeometryPredicate('Coordinates');

  assert.ok(p);
  assert.equal(p.attributePath, 'Coordinates');
});
