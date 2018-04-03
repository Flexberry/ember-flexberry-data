import DS from 'ember-data';
import attr from 'ember-data/attr';
import { Projection } from 'ember-flexberry-data';

let Employee = Projection.Model.extend({
  'First Name': attr('string'),
  'Last Name': attr('string'),
  'Birth Date': attr('date'),
  Age: attr('number'),
  Name: attr('string'),
  Surname: attr('string'),
  employmentDate: attr('date'),
  CountryName: attr('string'),
  Price: attr('decimal'),
  Active: attr('boolean'),
  Country: DS.belongsTo('country', {
    inverse: null,
    async: false
  }),
  Creator: DS.belongsTo('creator', {
    inverse: null,
    async: false,
    polymorphic: true
  }),
  Manager: DS.belongsTo('employee', {
    inverse: null,
    async: false
  }),
  Tags: DS.hasMany('tag', {
    inverse: 'Creator',
    async: false
  }),
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

Employee.defineProjection('TestJoins', 'employee', {
  Age: Projection.attr('Age'),
  Name: Projection.attr('Name'),
  Price: Projection.attr('Price'),
  Country: Projection.belongsTo('country', 'Country', {
    Name: Projection.attr('Name')
  }),
  Creator: Projection.belongsTo('creator', 'Creator', {
    Name: Projection.attr('Name'),
    Country: Projection.belongsTo('country', 'Country', {
      Name: Projection.attr('Name')
    }),
  }),
  Tags: Projection.hasMany('tag', 'Tags', {
    Name: Projection.attr('Name'),
    Creator: Projection.belongsTo('creator', 'Creator', {
      Name: Projection.attr('Name')
    }),
  }),
});

export default Employee;
