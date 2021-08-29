import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import {
  SimplePredicate,
  DatePredicate,
  ComplexPredicate,
  StringPredicate,
  DetailPredicate,
  GeographyPredicate,
  GeometryPredicate,
  NotPredicate,
  IsOfPredicate,
  TruePredicate,
  FalsePredicate
} from 'ember-flexberry-data/query/predicate';
import { ConstParam, AttributeParam } from 'ember-flexberry-data/query/parameter';
import ODataAdapter from 'ember-flexberry-data/query/odata-adapter';
import startApp from '../../helpers/start-app';

const baseUrl = 'http://services.odata.org/Northwind/Northwind.svc';
const app = startApp();
const store = app.__container__.lookup('service:store');

module('query');

test('adapter | odata | id', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').byId(42);

  // Act && Assert.
  runTest(assert, builder, 'Customers', '$filter=CustomerID eq 42&$select=CustomerID');
});

test('adapter | odata | simple predicate | eq', function (assert) {
  // Arrange.
  let resultString = `$filter=FirstName eq 'Vasya'&$select=CustomerID`;
  let builder = 
    new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, 'Vasya');
  let builderConst = 
    new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, new ConstParam('Vasya'));
  let builderAttribute = 
    new QueryBuilder(store, 'customer').where(new AttributeParam('firstName'), FilterOperator.Eq, 'Vasya');
  let builderAttributeConst = 
    new QueryBuilder(store, 'customer').where(new AttributeParam('firstName'), FilterOperator.Eq, new ConstParam('Vasya'));

  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya'));
  let builder2Const = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate('firstName', FilterOperator.Eq, new ConstParam('Vasya')));
  let builder2Attribute = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('firstName'), FilterOperator.Eq, 'Vasya'));
  let builder2AttributeConst = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('firstName'), FilterOperator.Eq, new ConstParam('Vasya')))


  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builderConst, 'Customers', resultString);
  runTest(assert, builderAttribute, 'Customers', resultString);
  runTest(assert, builderAttributeConst, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
  runTest(assert, builder2Const, 'Customers', resultString);
  runTest(assert, builder2Attribute, 'Customers', resultString);
  runTest(assert, builder2AttributeConst, 'Customers', resultString);
});

test('adapter | odata | simple predicate | two attributes', function (assert) {
  // Arrange.
  let resultString = `$filter=FirstName eq Email&$select=CustomerID`;
  let builder = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('firstName'), FilterOperator.Eq, new AttributeParam('email')));
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate('firstName', FilterOperator.Eq, new AttributeParam('email')));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | two string consts', function (assert) {
  // Arrange.
  let resultString = `$filter='firstName' eq 'email'&$select=CustomerID`;
  let builder = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new ConstParam('firstName'), FilterOperator.Eq, new ConstParam('email')));
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new ConstParam('firstName'), FilterOperator.Eq, 'email'));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | two number consts', function (assert) {
  // Arrange.
  let resultString = `$filter=1 eq 2.3&$select=CustomerID`;
  let builder = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new ConstParam(1), FilterOperator.Eq, new ConstParam(2.3)));
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new ConstParam(1), FilterOperator.Eq, 2.3));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | string with quotes', function (assert) {
  // Arrange.
  let resultString = `$filter=FirstName eq 'Va''''sy''a'&$select=CustomerID`;
  let predicateValue = `Va''sy'a`;
  let builder = 
    new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, predicateValue);
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('firstName'), FilterOperator.Eq, new ConstParam(predicateValue)));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | eq | guid', function (assert) {
  // Arrange.
  let resultString = `$filter=Uid eq 3bcc4730-9cc1-4237-a843-c4b1de881d7c&$select=CustomerID`;
  let predicateValue = '3bcc4730-9cc1-4237-a843-c4b1de881d7c';
  let builder = new QueryBuilder(store, 'customer').where('uid', FilterOperator.Eq, predicateValue);
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('uid'), FilterOperator.Eq, new ConstParam(predicateValue)));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | eq | null', function (assert) {
  // Arrange.
  let resultString = `$filter=FirstName eq null&$select=CustomerID`;
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, null);
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('firstName'), FilterOperator.Eq, new ConstParam(null)));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | eq | master pk', function (assert) {
  // Arrange.
  let resultString = `$filter=Manager/EmployeeID eq 3bcc4730-9cc1-4237-a843-c4b1de881d7c&$select=CustomerID`;
  let predicateValue = '3bcc4730-9cc1-4237-a843-c4b1de881d7c';
  let builder = new QueryBuilder(store, 'customer').where('Manager', FilterOperator.Eq, predicateValue);
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('Manager'), FilterOperator.Eq, new ConstParam(predicateValue)));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | eq | master master pk', function (assert) {
  // Arrange.
  let resultString = `$filter=Manager/Manager/EmployeeID eq 3bcc4730-9cc1-4237-a843-c4b1de881d7c&$select=CustomerID`;
  let predicateValue = '3bcc4730-9cc1-4237-a843-c4b1de881d7c';
  let builder = new QueryBuilder(store, 'customer').where('Manager.Manager', FilterOperator.Eq, predicateValue);
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('Manager.Manager'), FilterOperator.Eq, new ConstParam(predicateValue)));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | eq | master field | with cast', function (assert) {
  // Arrange.
  let resultString = `$filter=Manager/EmployeeID eq cast(3bcc4730-9cc1-4237-a843-c4b1de881d7c,Edm.Guid)&$select=CustomerID`;
  let predicateValue = 'cast(3bcc4730-9cc1-4237-a843-c4b1de881d7c,Edm.Guid)';
  let builder = new QueryBuilder(store, 'customer').where('Manager', FilterOperator.Eq, predicateValue);
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('Manager'), FilterOperator.Eq, new ConstParam(predicateValue)));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | eq | master id', function (assert) {
  // Arrange.
  let resultString = `$filter=Manager/EmployeeID eq 3bcc4730-9cc1-4237-a843-c4b1de881d7c&$select=CustomerID`;
  let predicateValue = '3bcc4730-9cc1-4237-a843-c4b1de881d7c';
  let builder = new QueryBuilder(store, 'customer').where('Manager.id', FilterOperator.Eq, predicateValue);
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('Manager.id'), FilterOperator.Eq, new ConstParam(predicateValue)));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | eq | master field', function (assert) {
  // Arrange.
  let resultString = `$filter=Manager/First Name eq 'Vasya'&$select=CustomerID`;
  let predicateValue = 'Vasya';
  let builder = new QueryBuilder(store, 'customer').where('Manager.First Name', FilterOperator.Eq, predicateValue);
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new SimplePredicate(new AttributeParam('Manager.First Name'), FilterOperator.Eq, new ConstParam(predicateValue)));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString);
  runTest(assert, builder2, 'Customers', resultString);
});

test('adapter | odata | simple predicate | eq | boolean', function (assert) {
  // Arrange.
  let resultString = `$filter=Activated eq true&$select=__PrimaryKey`;
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user').where('activated', FilterOperator.Eq, true);
  let builder2 = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
                    .where(new SimplePredicate(new AttributeParam('activated'), FilterOperator.Eq, new ConstParam(true)));

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyApplicationUsers', resultString);
  runTest(assert, builder2, 'EmberFlexberryDummyApplicationUsers', resultString);
});

test('adapter | odata | simple predicate | eq | enum', function (assert) {
  // Arrange.
  let resultString = `$filter=Gender eq EmberFlexberryDummy.Gender'Male'&$select=__PrimaryKey`;
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user').where('gender', FilterOperator.Eq, 'Male');
  let builder2 = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
                    .where(new SimplePredicate(new AttributeParam('gender'), FilterOperator.Eq, new ConstParam('Male')));

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyApplicationUsers', resultString);
  runTest(assert, builder2, 'EmberFlexberryDummyApplicationUsers', resultString);
});

test('adapter | odata | simple predicate | eq | quid', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'employee').where('externalId', FilterOperator.Eq, '0882519a-f62b-4b6d-a73e-3e727ff145cd');

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyApplicationUsers', `$filter=ExternalId eq 0882519a-f62b-4b6d-a73e-3e727ff145cd&$select=EmployeeID`);
});

test('adapter | odata | simple predicate | neq', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Neq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName ne 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | simple predicate | neq | null', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Neq, null);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName ne null&$select=CustomerID`);
});

test('adapter | odata | simple predicate | ge', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Ge, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName gt 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | simple predicate | geq', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Geq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName ge 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | simple predicate | le', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Le, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName lt 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | simple predicate | leq', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Leq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName le 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | date predicate | eq', function (assert) {
  // Arrange.
  let sampleDt = new Date(2018, 0, 31, 8, 30);  // Wed Jan 31 2018 08:30:00

  let resultString1 = `$filter=RegDate eq ${sampleDt.toISOString()}&$select=CustomerID`;
  let resultString2 = `$filter=date(RegDate) eq ${sampleDt.toISOString().substr(0, 10)}&$select=CustomerID`;
  let dp1 = new DatePredicate('regDate', FilterOperator.Eq, sampleDt);
  let dp2 = new DatePredicate('regDate', FilterOperator.Eq, sampleDt, true);

  let builder1 = new QueryBuilder(store, 'customer').where(dp1);
  let builder1Const = 
    new QueryBuilder(store, 'customer').where(new DatePredicate('regDate', FilterOperator.Eq, new ConstParam(sampleDt)));
  let builder1Attribute =
    new QueryBuilder(store, 'customer').where(new DatePredicate(new AttributeParam('regDate'), FilterOperator.Eq, sampleDt));
  let builder1AttributeConst =
    new QueryBuilder(store, 'customer').where(new DatePredicate(new AttributeParam('regDate'), FilterOperator.Eq, new ConstParam(sampleDt)));

  let builder2 = new QueryBuilder(store, 'customer').where(dp2);
  let builder2Const = 
    new QueryBuilder(store, 'customer').where(new DatePredicate('regDate', FilterOperator.Eq, new ConstParam(sampleDt), true));
  let builder2Attribute =
    new QueryBuilder(store, 'customer').where(new DatePredicate(new AttributeParam('regDate'), FilterOperator.Eq, sampleDt, true));
  let builder2AttributeConst =
    new QueryBuilder(store, 'customer').where(new DatePredicate(new AttributeParam('regDate'), FilterOperator.Eq, new ConstParam(sampleDt), true));

  // Act && Assert.
  runTest(assert, builder1, 'Customers', resultString1);
  runTest(assert, builder1Const, 'Customers', resultString1);
  runTest(assert, builder1Attribute, 'Customers', resultString1);
  runTest(assert, builder1AttributeConst, 'Customers', resultString1);
  runTest(assert, builder2, 'Customers', resultString2);
  runTest(assert, builder2Const, 'Customers', resultString1);
  runTest(assert, builder2Attribute, 'Customers', resultString1);
  runTest(assert, builder2AttributeConst, 'Customers', resultString1);
});

test('adapter | odata | date predicate | two attributes', function (assert) {
  // Arrange.
  let resultString1 = `$filter=RegDate eq RegDate &$select=CustomerID`;
  let resultString2 = `$filter=date(RegDate) eq date(RegDate)&$select=CustomerID`;

  let builder = 
    new QueryBuilder(store, 'customer').where(new DatePredicate(new AttributeParam('regDate'), FilterOperator.Eq, new AttributeParam('regDate')));
  let builderWithTimeless = 
    new QueryBuilder(store, 'customer').where(new DatePredicate(new AttributeParam('regDate'), FilterOperator.Eq, new AttributeParam('regDate'), true));
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new DatePredicate('regDate', FilterOperator.Eq, new AttributeParam('regDate')));
  let builder2WithTimeless = 
    new QueryBuilder(store, 'customer').where(new DatePredicate('regDate', FilterOperator.Eq, new AttributeParam('regDate'), true));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString1);
  runTest(assert, builderWithTimeless, 'Customers', resultString2);
  runTest(assert, builder2, 'Customers', resultString1);
  runTest(assert, builder2WithTimeless, 'Customers', resultString2);
});

test('adapter | odata | date predicate | two date consts', function (assert) {
  // Arrange.
  let sampleDt = new Date(2018, 0, 31, 8, 30);  // Wed Jan 31 2018 08:30:00

  let resultString1 = `$filter=${sampleDt.toISOString()} eq ${sampleDt.toISOString()}&$select=CustomerID`;
  let resultString2 = `$filter=${sampleDt.toISOString().substr(0, 10)} eq ${sampleDt.toISOString().substr(0, 10)}&$select=CustomerID`;
  
  let builder = 
    new QueryBuilder(store, 'customer').where(new DatePredicate(new ConstParam(sampleDt), FilterOperator.Eq, new ConstParam(sampleDt)));
  let builderWithTimeless = 
    new QueryBuilder(store, 'customer').where(new DatePredicate(new ConstParam(sampleDt), FilterOperator.Eq, new ConstParam(sampleDt), true));
  let builder2 = 
    new QueryBuilder(store, 'customer').where(new DatePredicate(new ConstParam(sampleDt), FilterOperator.Eq, sampleDt));
  let builder2WithTimeless = 
    new QueryBuilder(store, 'customer').where(new DatePredicate(new ConstParam(sampleDt), FilterOperator.Eq, sampleDt, true));

  // Act && Assert.
  runTest(assert, builder, 'Customers', resultString1);
  runTest(assert, builderWithTimeless, 'Customers', resultString2);
  runTest(assert, builder2, 'Customers', resultString1);
  runTest(assert, builder2WithTimeless, 'Customers', resultString2);
});

test('adapter | odata | date predicate | eq | master field', function (assert) {
  // Arrange.
  let sampleDt = new Date(2018, 0, 31, 8, 30);  // Wed Jan 31 2018 08:30:00

  let dp1 = new DatePredicate('Manager.employmentDate', FilterOperator.Eq, sampleDt);
  let dp2 = new DatePredicate('Manager.employmentDate', FilterOperator.Eq, sampleDt, true);

  let builder1 = new QueryBuilder(store, 'customer').where(dp1);
  let builder2 = new QueryBuilder(store, 'customer').where(dp2);

  // Act && Assert.
  runTest(assert, builder1, 'Customers', `$filter=Manager/EmploymentDate eq ${sampleDt.toISOString()}&$select=CustomerID`);
  runTest(assert, builder2, 'Customers', `$filter=date(Manager/EmploymentDate) eq ${sampleDt.toISOString().substr(0, 10)}&$select=CustomerID`);
});

test('adapter | odata | date predicate | neq', function (assert) {
  // Arrange.
  let sampleDt = new Date(2018, 0, 31, 8, 30);  // Wed Jan 31 2018 08:30:00

  let dp1 = new DatePredicate('regDate', FilterOperator.Neq, sampleDt);
  let dp2 = new DatePredicate('regDate', FilterOperator.Neq, sampleDt, true);

  let builder1 = new QueryBuilder(store, 'customer').where(dp1);
  let builder2 = new QueryBuilder(store, 'customer').where(dp2);

  // Act && Assert.
  runTest(assert, builder1, 'Customers', `$filter=RegDate ne ${sampleDt.toISOString()}&$select=CustomerID`);
  runTest(assert, builder2, 'Customers', `$filter=date(RegDate) ne ${sampleDt.toISOString().substr(0, 10)}&$select=CustomerID`);
});

test('adapter | odata | date predicate | le', function (assert) {
  // Arrange.
  let sampleDt = new Date(2018, 0, 31, 8, 30);  // Wed Jan 31 2018 08:30:00

  let dp1 = new DatePredicate('regDate', FilterOperator.Le, sampleDt);
  let dp2 = new DatePredicate('regDate', FilterOperator.Le, sampleDt, true);

  let builder1 = new QueryBuilder(store, 'customer').where(dp1);
  let builder2 = new QueryBuilder(store, 'customer').where(dp2);

  // Act && Assert.
  runTest(assert, builder1, 'Customers', `$filter=RegDate lt ${sampleDt.toISOString()}&$select=CustomerID`);
  runTest(assert, builder2, 'Customers', `$filter=date(RegDate) lt ${sampleDt.toISOString().substr(0, 10)}&$select=CustomerID`);
});

test('adapter | odata | date predicate | leq', function (assert) {
  // Arrange.
  let sampleDt = new Date(2018, 0, 31, 8, 30);  // Wed Jan 31 2018 08:30:00

  let dp1 = new DatePredicate('regDate', FilterOperator.Leq, sampleDt);
  let dp2 = new DatePredicate('regDate', FilterOperator.Leq, sampleDt, true);

  let builder1 = new QueryBuilder(store, 'customer').where(dp1);
  let builder2 = new QueryBuilder(store, 'customer').where(dp2);

  // Act && Assert.
  runTest(assert, builder1, 'Customers', `$filter=RegDate le ${sampleDt.toISOString()}&$select=CustomerID`);
  runTest(assert, builder2, 'Customers', `$filter=date(RegDate) le ${sampleDt.toISOString().substr(0, 10)}&$select=CustomerID`);
});

test('adapter | odata | date predicate | ge', function (assert) {
  // Arrange.
  let sampleDt = new Date(2018, 0, 31, 8, 30);  // Wed Jan 31 2018 08:30:00

  let dp1 = new DatePredicate('regDate', FilterOperator.Ge, sampleDt);
  let dp2 = new DatePredicate('regDate', FilterOperator.Ge, sampleDt, true);

  let builder1 = new QueryBuilder(store, 'customer').where(dp1);
  let builder2 = new QueryBuilder(store, 'customer').where(dp2);

  // Act && Assert.
  runTest(assert, builder1, 'Customers', `$filter=RegDate gt ${sampleDt.toISOString()}&$select=CustomerID`);
  runTest(assert, builder2, 'Customers', `$filter=date(RegDate) gt ${sampleDt.toISOString().substr(0, 10)}&$select=CustomerID`);
});

test('adapter | odata | date predicate | geq', function (assert) {
  // Arrange.
  let sampleDt = new Date(2018, 0, 31, 8, 30);  // Wed Jan 31 2018 08:30:00

  let dp1 = new DatePredicate('regDate', FilterOperator.Geq, sampleDt);
  let dp2 = new DatePredicate('regDate', FilterOperator.Geq, sampleDt, true);

  let builder1 = new QueryBuilder(store, 'customer').where(dp1);
  let builder2 = new QueryBuilder(store, 'customer').where(dp2);

  // Act && Assert.
  runTest(assert, builder1, 'Customers', `$filter=RegDate ge ${sampleDt.toISOString()}&$select=CustomerID`);
  runTest(assert, builder2, 'Customers', `$filter=date(RegDate) ge ${sampleDt.toISOString().substr(0, 10)}&$select=CustomerID`);
});

test('adapter | odata | string predicate', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where(new StringPredicate('firstName').contains('a'));

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=contains(FirstName,'a')&$select=CustomerID`);
});

test('adapter | odata | string predicate | string with quotes', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where(new StringPredicate('firstName').contains(`''a'`));

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=contains(FirstName,'''''a''')&$select=CustomerID`);
});

test('adapter | odata | string predicate | inside complex', function (assert) {
  // Arrange.
  let stp = new StringPredicate('firstName').contains('a');
  let sp = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(stp.and(sp));

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=contains(FirstName,'a') and FirstName eq 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | detail predicate | all | with simple predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').all(new SimplePredicate('applicationUser.name', FilterOperator.Eq, 'Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/all(f:f/ApplicationUser/Name eq 'Vasya')&$select=__PrimaryKey`);
});

test('adapter | odata | detail predicate | any | with simple predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').any(new SimplePredicate('applicationUser.name', FilterOperator.Eq, 'Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/any(f:f/ApplicationUser/Name eq 'Vasya')&$select=__PrimaryKey`);
});

test('adapter | odata | detail predicate | all | with string predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').all(new StringPredicate('applicationUser.name').contains('Oleg'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/all(f:contains(f/ApplicationUser/Name,'Oleg'))&$select=__PrimaryKey`);
});

test('adapter | odata | detail predicate | any | with string predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').any(new StringPredicate('applicationUser.name').contains('Vasya'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/any(f:contains(f/ApplicationUser/Name,'Vasya'))&$select=__PrimaryKey`);
});

test('adapter | odata | detail predicate | all | with complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('applicationUser.name', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('applicationUser.eMail', FilterOperator.Eq, 'a@b.c');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);
  let dp = new DetailPredicate('userVotes').all(cp1);

  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(
    assert,
    builder,
    'EmberFlexberryDummyComments',
    `$filter=UserVotes/all(f:f/ApplicationUser/Name eq 'Vasya' or f/ApplicationUser/EMail eq 'a@b.c')&$select=__PrimaryKey`);
});

test('adapter | odata | detail predicate | any | with complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('applicationUser.name', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('applicationUser.eMail', FilterOperator.Eq, 'a@b.c');
  let cp1 = new ComplexPredicate(Condition.And, sp1, sp2);
  let dp = new DetailPredicate('userVotes').all(cp1);

  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(
    assert,
    builder,
    'EmberFlexberryDummyComments',
    `$filter=UserVotes/all(f:f/ApplicationUser/Name eq 'Vasya' and f/ApplicationUser/EMail eq 'a@b.c')&$select=__PrimaryKey`);
});

test('adapter | odata | complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let sp3 = new SimplePredicate('age', FilterOperator.Eq, 10);
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2, sp3);

  let builder = new QueryBuilder(store, 'customer').where(cp1);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName eq 'Vasya' or LastName eq 'Ivanov' or Age eq 10&$select=CustomerID`);
});

test('adapter | odata | complex predicate | with nested complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('lastName', FilterOperator.Eq, 'Ivanov');
  let cp1 = new ComplexPredicate(Condition.Or, sp1, sp2);

  let sp3 = new SimplePredicate('age', FilterOperator.Eq, 10);
  let cp2 = new ComplexPredicate(Condition.And, cp1, sp3);

  let builder = new QueryBuilder(store, 'customer').where(cp2);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=(FirstName eq 'Vasya' or LastName eq 'Ivanov') and Age eq 10&$select=CustomerID`);
});

test('adapter | odata | order', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').orderBy('firstName,lastName asc,age desc,Manager.First Name,Manager.Last Name asc,Manager.Birth Date desc');

  // Act && Assert.
  runTest(
    assert,
    builder,
    'Customers',
    '$orderby=FirstName,LastName asc,Age desc,Manager/First Name,Manager/Last Name asc,Manager/Birth Date desc&$select=CustomerID');
});

test('adapter | odata | skip', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').skip(10);

  // Act && Assert.
  runTest(assert, builder, 'Customers', '$skip=10&$select=CustomerID');
});

test('adapter | odata | top', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').top(20);

  // Act && Assert.
  runTest(assert, builder, 'Customers', '$top=20&$select=CustomerID');
});

test('adapter | odata | count', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').count();

  // Act && Assert.
  runTest(assert, builder, 'Customers', '$count=true&$select=CustomerID');
});

test('adapter | odata | select', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
    .select(' text,  votes')
    .select(' moderated ');

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', '$select=__PrimaryKey,Text,Votes,Moderated');
});

test('adapter | odata | select by projection', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').selectByProjection('CommentE');

  // Act && Assert.
  runTest(
    assert,
    builder,
    'EmberFlexberryDummyComments',
    '$select=__PrimaryKey,Suggestion,Text,Votes,Moderated,Author,UserVotes' +
    '&' +
    '$expand=' +
      'Suggestion($select=__PrimaryKey,Address),' +
      'Author($select=__PrimaryKey,Name),' +
      'UserVotes($select=__PrimaryKey,VoteType,ApplicationUser;$expand=ApplicationUser($select=__PrimaryKey,Name))'
    );
});

test('adapter | odata | select | master fields', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').select('id,text,suggestion,author.name');

  // Act && Assert.
  runTest(
    assert,
    builder,
    'EmberFlexberryDummyComments',
    '$select=__PrimaryKey,Text,Suggestion' +
    '&' +
    '$expand=Author($select=__PrimaryKey,Name)'
    );
});

test('adapter | odata | geography predicate | intersect', function (assert) {
  // Arrange.
  let gp = new GeographyPredicate('coordinates').
  intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))');

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(gp);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=geo.intersects(geography1=Coordinates,geography2=geography'SRID=12345;` +
       `POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))')&$select=CustomerID`);
});

test('adapter | odata | geography predicate | inside complex', function (assert) {
  // Arrange.
  let gp = new GeographyPredicate('coordinates').
  intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))');
  let sp = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(gp.and(sp));

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=geo.intersects(geography1=Coordinates,geography2=geography'SRID=12345;` +
  `POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))') and FirstName eq 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | detail predicate | all | with geography predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').all(new GeographyPredicate('applicationUser.coordinates').
    intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/all(f:geo.intersects(geography1=f/ApplicationUser/Coordinates,` +
    `geography2=geography'SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'))&$select=__PrimaryKey`);
});

test('adapter | odata | detail predicate | any | with geography predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').any(new GeographyPredicate('applicationUser.coordinates').
    intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/any(f:geo.intersects(geography1=f/ApplicationUser/Coordinates,` +
     `geography2=geography'SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'))&$select=__PrimaryKey`);
});

test('adapter | odata | geometry predicate | intersect', function (assert) {
  // Arrange.
  let gp = new GeometryPredicate('coordinates').
  intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))');

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(gp);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=geom.intersects(geometry1=Coordinates,geometry2=geometry'SRID=12345;` +
       `POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))')&$select=CustomerID`);
});

test('adapter | odata | geometry predicate | inside complex', function (assert) {
  // Arrange.
  let gp = new GeometryPredicate('coordinates').
  intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))');
  let sp = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(gp.and(sp));

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=geom.intersects(geometry1=Coordinates,geometry2=geometry'SRID=12345;` +
  `POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))') and FirstName eq 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | detail predicate | all | with geometry predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').all(new GeometryPredicate('applicationUser.coordinates').
    intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/all(f:geom.intersects(geometry1=f/ApplicationUser/Coordinates,` +
    `geometry2=geometry'SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'))&$select=__PrimaryKey`);
});

test('adapter | odata | detail predicate | any | with geometry predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').any(new GeometryPredicate('applicationUser.coordinates').
    intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/any(f:geom.intersects(geometry1=f/ApplicationUser/Coordinates,` +
     `geometry2=geometry'SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'))&$select=__PrimaryKey`);
});

test('adapter | odata | not predicate | with simple predicate', function (assert) {
  // Arrange.
  let innerPredicate = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(np);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=not(FirstName eq 'Vasya')&$select=CustomerID`);
});

test('adapter | odata | not predicate | with complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('firstName', FilterOperator.Eq, 'Petya');
  let innerPredicate = new ComplexPredicate(Condition.Or, sp1, sp2);
  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(np);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=not(FirstName eq 'Vasya' or FirstName eq 'Petya')&$select=CustomerID`);
});

test('adapter | odata | not predicate | with geography predicate', function (assert) {
  // Arrange.
  const POLYGON = 'SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))';
  let innerPredicate = new GeographyPredicate('coordinates').intersects(POLYGON);
  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(np);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=not(geo.intersects(geography1=Coordinates,geography2=geography'${POLYGON}'))&$select=CustomerID`);
});

test('adapter | odata | not predicate | with geometry predicate', function (assert) {
  // Arrange.
  const POLYGON = 'SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))';
  let innerPredicate = new GeometryPredicate('coordinates').intersects(POLYGON);
  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(np);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=not(geom.intersects(geometry1=Coordinates,geometry2=geometry'${POLYGON}'))&$select=CustomerID`);
});

test('adapter | odata | not predicate | with detail predicate', function (assert) {
  // Arrange.
  let innerPredicate = new DetailPredicate('userVotes').all(new SimplePredicate('applicationUser.name', FilterOperator.Eq, 'Vasya'));

  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(np);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=not(UserVotes/all(f:f/ApplicationUser/Name eq 'Vasya'))&$select=__PrimaryKey`);
});

test('adapter | odata | not predicate | with string predicate', function (assert) {
  // Arrange.
  let innerPredicate = new StringPredicate('firstName').contains('a');
  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(np);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=not(contains(FirstName,'a'))&$select=CustomerID`);
});

test('adapter | odata | isof predicate | only type', function (assert) {
  // Arrange.
  let predicate = new IsOfPredicate('bot');

  // Act.
  let builder = new QueryBuilder(store, 'creator').where(predicate);

  // Assert.
  runTest(assert, builder, 'Creator', `$filter=isof($it,'.Bot')&$select=CreatorID`);
});

test('adapter | odata | isof predicate | with expression', function (assert) {
  // Arrange.
  let predicate = new IsOfPredicate('Creator', 'bot');

  // Act.
  let builder = new QueryBuilder(store, 'tag').where(predicate);

  // Assert.
  runTest(assert, builder, 'Tag', `$filter=isof(Creator,'.Bot')&$select=id`);
});

test('adapter | odata | isof predicate | inside complex', function (assert) {
  // Arrange.
  let predicate = new SimplePredicate('Age', 'geq', 0).and(new IsOfPredicate('bot'));

  // Act.
  let builder = new QueryBuilder(store, 'creator').where(predicate);

  // Assert.
  runTest(assert, builder, 'Creator', `$filter=Age ge 0 and isof($it,'.Bot')&$select=CreatorID`);
});

test('adapter | odata | isof predicate | inside not', function (assert) {
  // Arrange.
  let predicate = new NotPredicate(new IsOfPredicate('bot'));

  // Act.
  let builder = new QueryBuilder(store, 'creator').where(predicate);

  // Assert.
  runTest(assert, builder, 'Creator', `$filter=not(isof($it,'.Bot'))&$select=CreatorID`);
});

test('adapter | odata | true predicate', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where(new TruePredicate());

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=true&$select=CustomerID`);
});

test('adapter | odata | true predicate | complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let tp1 = new TruePredicate();
  let cp1 = new ComplexPredicate(Condition.Or, sp1, tp1);

  let builder = new QueryBuilder(store, 'customer').where(cp1);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName eq 'Vasya' or true&$select=CustomerID`);

  // Arrange.
  cp1 = new ComplexPredicate(Condition.And, sp1, tp1);

  builder = new QueryBuilder(store, 'customer').where(cp1);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName eq 'Vasya' and true&$select=CustomerID`);
});

test('adapter | odata | true predicate | details predicate all', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').all(new TruePredicate());

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/all(f:true)&$select=__PrimaryKey`);
});

test('adapter | odata | true predicate | details predicate any', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').any(new TruePredicate());

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/any(f:true)&$select=__PrimaryKey`);
});

test('adapter | odata | false predicate', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where(new FalsePredicate());

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=false&$select=CustomerID`);
});

test('adapter | odata | false predicate | complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let fp1 = new FalsePredicate();
  let cp1 = new ComplexPredicate(Condition.Or, sp1, fp1);

  let builder = new QueryBuilder(store, 'customer').where(cp1);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName eq 'Vasya' or false&$select=CustomerID`);

  // Arrange.
  cp1 = new ComplexPredicate(Condition.And, sp1, fp1);

  builder = new QueryBuilder(store, 'customer').where(cp1);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName eq 'Vasya' and false&$select=CustomerID`);
});

test('adapter | odata | false predicate | details predicate all', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').all(new FalsePredicate());

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/all(f:false)&$select=__PrimaryKey`);
});

test('adapter | odata | false predicate | details predicate any', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').any(new FalsePredicate());

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/any(f:false)&$select=__PrimaryKey`);
});

function runTest(assert, builder, modelPath, expectedUrl) {
  let adapter = new ODataAdapter(`${baseUrl}/${modelPath}`, store);
  let url = adapter.getODataFullUrl(builder.build());
  assert.equal(url, `${baseUrl}/${modelPath}?${expectedUrl}`);
}
