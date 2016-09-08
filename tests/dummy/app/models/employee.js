import DS from 'ember-data';
import attr from 'ember-data/attr';
import { Projection } from 'ember-flexberry-data';

let Employee = Projection.Model.extend({
  'First Name': attr('string'),
  'Last Name': attr('string'),
  'Birth Date': attr('date'),
  Age: attr('number'),
  Name: attr('string'),
  manager: DS.belongsTo('employee'),
  externalId: attr('guid')
});

Employee.defineProjection('EmployeeTestProjection', 'employee', {
  firstName: Projection.attr('First Name'),
  lastName: Projection.attr('Last Name'),
  birthDate: Projection.attr('Birth Date'),
  employee1: Projection.belongsTo('employee', 'Reports To', {
    firstName: Projection.attr('Reports To - First Name')
  }),
  tmpChildren: Projection.hasMany('employee', 'Tmp Children', {
    lastName: Projection.attr('Tmp Children - Last Name')
  })
});

export default Employee;
