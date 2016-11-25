import Ember from 'ember';

export default function getSerializedDateValue(value) {
  let dateTransform = Ember.getOwner(this).lookup('transform:date');
  let moment = Ember.getOwner(this).lookup('service:moment');
  let valueToTransform = moment.moment(value);
  Ember.assert('Date value must be passed as JavaScript Date (instance or string) or as ISO 8601 string', valueToTransform.isValid());
  return dateTransform.serialize(valueToTransform.toDate());
}
