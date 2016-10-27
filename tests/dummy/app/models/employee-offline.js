import DS from 'ember-data';
import attr from 'ember-data/attr';
import { Projection, Offline } from 'ember-flexberry-data';

let EmployeeOffline = Offline.Model.extend({
  'First Name': attr('string'),
  'Last Name': attr('string'),
  'Birth Date': attr('date'),
  Age: attr('number'),
  Name: attr('string'),
  Surname: attr('string'),
  CountryName: attr('string'),
  Price: attr('decimal'),
  manager: DS.belongsTo('employee-offline'),
  externalId: attr('guid')
});

EmployeeOffline.defineProjection('EmployeeTestProjection', 'employee-offline', {
  firstName: Projection.attr('First Name'),
  lastName: Projection.attr('Last Name'),
  birthDate: Projection.attr('Birth Date'),
  employee1: Projection.belongsTo('employee-offline', 'Reports To', {
    firstName: Projection.attr('Reports To - First Name')
  }),
  tmpChildren: Projection.hasMany('employee-offline', 'Tmp Children', {
    lastName: Projection.attr('Tmp Children - Last Name')
  })
});

export default EmployeeOffline;
