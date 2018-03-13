import DS from 'ember-data';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  firstName: attr('string'),
  lastName: attr('string'),
  age: attr('number'),
  coordinates: attr('string'),
  Manager: DS.belongsTo('employee', {
    inverse: null,
    async: false
  }),
  uid: attr('guid')
});
