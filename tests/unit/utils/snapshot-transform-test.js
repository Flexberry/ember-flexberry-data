import SnapshotTransform from 'ember-flexberry-data/utils/snapshot-transform';
import { module, test } from 'qunit';

module('snapshotTransform');

test('it exists', function(assert) {
  let func = SnapshotTransform.transformForSerialize;
  assert.ok(func);
});
