import attr from 'ember-data/attr';
import Proj from 'ember-flexberry-projections';

let Employee = Proj.Model.extend({
  'First Name': attr('string'),
  'Last Name': attr('string'),
  'Birth Date': attr('date')
});

Employee.defineProjection('EmployeeTestProjection', 'employee', {
  firstName: Proj.attr('First Name'),
  lastName: Proj.attr('Last Name'),
  birthDate: Proj.attr('Birth Date'),
  employee1: Proj.belongsTo('employee', 'Reports To', {
    firstName: Proj.attr('Reports To - First Name')
  }),
  order: Proj.belongsTo('order', 'Order', {
    orderDate: Proj.attr('Order Date')
  }),
  tmpChildren: Proj.hasMany('employee', 'Tmp Children', {
    lastName: Proj.attr('Tmp Children - Last Name')
  })
});

export default Employee;
