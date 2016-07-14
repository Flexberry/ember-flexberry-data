# Change Log

## [Unreleased]
### Added
- Support `polymorphic` options for `belongsTo` relationships.
- Support special 'id' attribute at query language:

  ```javascript 
  new SimplePredicate('manager', 'eq', key) === new SimplePredicate('manager.id', 'eq', key)
  ```
### Fixed
- Using `QueryBuilder.byId` method for OData query language adapter.

## [0.2.0] - 01.07.2016
### Added
- Predicates for details with any / all functionality.
- Filtering and ordering by master (using primary key) and it's fields.
### Fixed
- Using nested complex predicates for all query language adapters.

## [0.1.0] - 03.06.2016
### Changed
- Downgrade version of `broccoli-jscs` to 1.2.2.
- Upgrade `ember-cli` to 2.4.3.

## [0.0.3] - 02.06.2016
### Added
- Implementation of abstract query language adapter for IndexedDB.
### Fixed
- Logical operators in OData queries.

## [0.0.2] - 25.05.2016
### Fixed
- Building OData URL for CRUD operations.

## [0.0.1] - 20.05.2016
The first release of ember-flexberry-data!
### Added
- Implementation of _projections_ - predefined named set of model attributes.
- Implementation of abstract query language and adapters for OData and JSON.
- Implementations of `DS.Store` and `DS.Adapter` with support of _projections_. 
