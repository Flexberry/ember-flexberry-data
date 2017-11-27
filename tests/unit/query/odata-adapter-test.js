import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import Condition from 'ember-flexberry-data/query/condition';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, GeographyPredicate, NotPredicate } from 'ember-flexberry-data/query/predicate';
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
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName eq 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | simple predicate | eq | guid', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('uid', FilterOperator.Eq, '3bcc4730-9cc1-4237-a843-c4b1de881d7c');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=Uid eq 3bcc4730-9cc1-4237-a843-c4b1de881d7c&$select=CustomerID`);
});

test('adapter | odata | simple predicate | eq | null', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('firstName', FilterOperator.Eq, null);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=FirstName eq null&$select=CustomerID`);
});

test('adapter | odata | simple predicate | eq | master pk', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('Manager', FilterOperator.Eq, '3bcc4730-9cc1-4237-a843-c4b1de881d7c');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=Manager/EmployeeID eq 3bcc4730-9cc1-4237-a843-c4b1de881d7c&$select=CustomerID`);
});

test('adapter | odata | simple predicate | eq | master master pk', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('Manager.Manager', FilterOperator.Eq, '3bcc4730-9cc1-4237-a843-c4b1de881d7c');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=Manager/Manager/EmployeeID eq 3bcc4730-9cc1-4237-a843-c4b1de881d7c&$select=CustomerID`);
});

test('adapter | odata | simple predicate | eq | master field | with cast', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('Manager', FilterOperator.Eq, 'cast(3bcc4730-9cc1-4237-a843-c4b1de881d7c,Edm.Guid)');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=Manager/EmployeeID eq cast(3bcc4730-9cc1-4237-a843-c4b1de881d7c,Edm.Guid)&$select=CustomerID`);
});

test('adapter | odata | simple predicate | eq | master id', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('Manager.id', FilterOperator.Eq, '3bcc4730-9cc1-4237-a843-c4b1de881d7c');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=Manager/EmployeeID eq 3bcc4730-9cc1-4237-a843-c4b1de881d7c&$select=CustomerID`);
});

test('adapter | odata | simple predicate | eq | master field', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where('Manager.First Name', FilterOperator.Eq, 'Vasya');

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=Manager/First Name eq 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | simple predicate | eq | boolean', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user').where('activated', FilterOperator.Eq, true);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyApplicationUsers', `$filter=Activated eq true&$select=__PrimaryKey`);
});

test('adapter | odata | simple predicate | eq | enum', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user').where('gender', FilterOperator.Eq, 'Male');

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyApplicationUsers', `$filter=Gender eq EmberFlexberryDummy.Gender'Male'&$select=__PrimaryKey`);
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

test('adapter | odata | string predicate', function (assert) {
  // Arrange.
  let builder = new QueryBuilder(store, 'customer').where(new StringPredicate('firstName').contains('a'));

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=contains(FirstName,'a')&$select=CustomerID`);
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
  runTest(assert, builder, 'Customers', `$filter=geo.intersects(Coordinates,geography'SRID=12345;` +
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
  runTest(assert, builder, 'Customers', `$filter=geo.intersects(Coordinates,geography'SRID=12345;` +
    `POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))') and FirstName eq 'Vasya'&$select=CustomerID`);
});

test('adapter | odata | detail predicate | all | with geography predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').all(new GeographyPredicate('applicationUser.coordinates').
    intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/all(f:geo.intersects(f/ApplicationUser/Coordinates,geography'SRID=12345;` +
    `POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'))&$select=__PrimaryKey`);
});

test('adapter | odata | detail predicate | any | with geography predicate', function (assert) {
  // Arrange.
  let dp = new DetailPredicate('userVotes').any(new GeographyPredicate('applicationUser.coordinates').
    intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'));

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(dp);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=UserVotes/any(f:geo.intersects(f/ApplicationUser/Coordinates,geography'SRID=12345;` +
    `POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'))&$select=__PrimaryKey`);
});

test('adapter | odata | not predicate | any | with simple predicate', function (assert) {
  // Arrange.
  let innerPredicate = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(np);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=not (FirstName eq 'Vasya')&$select=CustomerID`);
});

test('adapter | odata | not predicate | any | with complex predicate', function (assert) {
  // Arrange.
  let sp1 = new SimplePredicate('firstName', FilterOperator.Eq, 'Vasya');
  let sp2 = new SimplePredicate('firstName', FilterOperator.Eq, 'Petya');
  let innerPredicate = new ComplexPredicate(Condition.Or, sp1, sp2);
  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(np);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=not (FirstName eq 'Vasya' or FirstName eq 'Petya')&$select=CustomerID`);
});

test('adapter | odata | not predicate | any | with geography predicate', function (assert) {
  // Arrange.
  let innerPredicate = new GeographyPredicate('coordinates').
  intersects('SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))');
  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(np);

  // Act && Assert.
  runTest(assert, builder, 'Customers',
  `$filter=not (geo.intersects(Coordinates,geography'SRID=12345;POLYGON((-127.89734578345 45.234534534,-127.89734578345 45.234534534))'))&$select=CustomerID`);
});

test('adapter | odata | not predicate | any | with detail predicate', function (assert) {
  // Arrange.
  let innerPredicate = new DetailPredicate('userVotes').all(new SimplePredicate('applicationUser.name', FilterOperator.Eq, 'Vasya'));

  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment').where(np);

  // Act && Assert.
  runTest(assert, builder, 'EmberFlexberryDummyComments', `$filter=not (UserVotes/all(f:f/ApplicationUser/Name eq 'Vasya'))&$select=__PrimaryKey`);
});

test('adapter | odata | not predicate | any | with string predicate', function (assert) {

  // Arrange.
  let innerPredicate = new StringPredicate('firstName').contains('a');
  let np = new NotPredicate(innerPredicate);

  // Act.
  let builder = new QueryBuilder(store, 'customer').where(np);

  // Act && Assert.
  runTest(assert, builder, 'Customers', `$filter=not (contains(FirstName,'a'))&$select=CustomerID`);
});

function runTest(assert, builder, modelPath, expectedUrl) {
  let adapter = new ODataAdapter(`${baseUrl}/${modelPath}`, store);
  let url = adapter.getODataFullUrl(builder.build());
  assert.equal(url, `${baseUrl}/${modelPath}?${expectedUrl}`);
}
