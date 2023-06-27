import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';

let Employee = EmberFlexberryDataModel.extend({
  'First Name': DS.attr('string'),
  'Last Name': DS.attr('string'),
  'Birth Date': DS.attr('date'),
  Age: DS.attr('number'),
  Name: DS.attr('string'),
  Surname: DS.attr('string'),
  employmentDate: DS.attr('date'),
  CountryName: DS.attr('string'),
  Price: DS.attr('decimal'),
  Active: DS.attr('boolean'),
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
  externalId: DS.attr('guid')
});

Employee.defineProjection('EmployeeTestProjection', 'employee', {
  firstName: attr('First Name'),
  lastName: attr('Last Name'),
  birthDate: attr('Birth Date'),
  employee1: belongsTo('employee', 'Reports To', {
    firstName: attr('Reports To - First Name')
  }),
  tmpChildren: hasMany('employee', 'Tmp Children', {
    lastName: attr('Tmp Children - Last Name')
  })
});

Employee.defineProjection('TestJoins', 'employee', {
  Age: attr('Age'),
  Name: attr('Name'),
  Price: attr('Price'),
  Country: belongsTo('country', 'Country', {
    Name: attr('Name')
  }),
  Creator: belongsTo('creator', 'Creator', {
    Name: attr('Name'),
    Country: belongsTo('country', 'Country', {
      Name: attr('Name')
    }),
  }),
  Tags: hasMany('tag', 'Tags', {
    Name: attr('Name'),
    Creator: belongsTo('creator', 'Creator', {
      Name: attr('Name')
    }),
  }),
});

export default Employee;
