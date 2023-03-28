import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

export default function getSerializedDateValue(value, timeless) {
  let dateTransform = getOwner(this).lookup('transform:date');
  let moment = getOwner(this).lookup('service:moment');
  let valueToTransform = moment.moment(value);
  if (timeless) {
    return valueToTransform.format('YYYY-MM-DD');
  }

  assert('Date value must be passed as JavaScript Date (instance or string) or as ISO 8601 string', valueToTransform.isValid());
  return dateTransform.serialize(valueToTransform.toDate());
}
