import DS from 'ember-data';
import OfflineModel from 'ember-flexberry-data/models/offline-model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';

let EmployeeOffline = OfflineModel.extend({
  'First Name': DS.attr('string'),
  'Last Name': DS.attr('string'),
  'Birth Date': DS.attr('date'),
  Age: DS.attr('number'),
  Name: DS.attr('string'),
  Surname: DS.attr('string'),
  CountryName: DS.attr('string'),
  Price: DS.attr('decimal'),
  manager: DS.belongsTo('employee-offline'),
  externalId: DS.attr('guid')
});

EmployeeOffline.defineProjection('EmployeeTestProjection', 'employee-offline', {
  firstName: attr('First Name'),
  lastName: attr('Last Name'),
  birthDate: attr('Birth Date'),
  employee1: belongsTo('employee-offline', 'Reports To', {
    firstName: attr('Reports To - First Name')
  }),
  tmpChildren: hasMany('employee-offline', 'Tmp Children', {
    lastName: attr('Tmp Children - Last Name')
  })
});

export default EmployeeOffline;
