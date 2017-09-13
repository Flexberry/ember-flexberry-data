import { module, test } from 'qunit';

import { GeographyPredicate } from 'ember-flexberry-data/query/predicate';

module('query');

test('predicate | geography | constructor', function (assert) {
  assert.throws(() => new GeographyPredicate(), Error);
  assert.throws(() => new GeographyPredicate(''), Error);
  assert.throws(() => new GeographyPredicate(null), Error);

  let p = new GeographyPredicate('Coordinates');

  assert.ok(p);
  assert.equal(p.attributePath, 'Coordinates');
});
