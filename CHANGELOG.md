# Change Log

## [Unreleased]

## [0.3.1] - 2016-07-26
### Added
- As you can see, we started to use integrated tests with OData...

### Removed
- Method `QueryBuilder.expand` removed.

### Fixed
- Error in building OData query for details.
- Missing classes in `Query` namespace that should be exported.
- Error in building OData query for projections.
- Error in building OData query for details.
- Method `store.findRecord` now correctly returns single object.
- Using properties for relationships in projections do not cause errors when apply `selectByProjection` method of query language for reading models.

## [0.3.0] - 2016-07-19
### Added
- Support `polymorphic` options for `belongsTo` relationships.
- Support special 'id' attribute at query language:

  ```javascript
  new SimplePredicate('manager', 'eq', key) === new SimplePredicate('manager.id', 'eq', key)
  ```
- Classes to support work in offline mode. See `Offline` namespace in [api documentation](http://flexberry.github.io/Documentation/master/modules/ember-flexberry-data.html).

### Changed
- The addon is no longer exports `Projection` namespace with following extra changes:
    - `Projection`, `Offline`, `Adapter`, `Serializer`, `Query`, `Utils` namespaces are exporting now.
    - `Projection.Store` mixin renamed to `Projection.StoreMixin`.
    - `Projection.Adapter` mixin renamed to `Projection.AdapterMixin`.
    - All adapters were included into `Adapter` napespace.
    - All serializers were included into `Serializer` napespace.
    - All client query language classes were included into `Query` napespace.
    - `Information` class was included into `Utils` napespace.
  For more information please see [api documentation](http://flexberry.github.io/Documentation/master/modules/ember-flexberry-data.html).

### Fixed
- Using `QueryBuilder.byId` method for OData query language adapter.

### Known issues
- Using properties for relationships in projections may cause errors when apply `selectByProjection` method of query language for reading models.

## [0.2.0] - 2016-07-01
### Added
- Predicates for details with any / all functionality.
- Filtering and ordering by master (using primary key) and it's fields.
### Fixed
- Using nested complex predicates for all query language adapters.

## [0.1.0] - 2016-06-03
### Changed
- Downgrade version of `broccoli-jscs` to 1.2.2.
- Upgrade `ember-cli` to 2.4.3.

## [0.0.3] - 2016-06-02
### Added
- Implementation of abstract query language adapter for IndexedDB.
### Fixed
- Logical operators in OData queries.

## [0.0.2] - 2016-05-25
### Fixed
- Building OData URL for CRUD operations.

## [0.0.1] - 2016-05-20
The first release of ember-flexberry-data!
### Added
- Implementation of _projections_ - predefined named set of model attributes.
- Implementation of abstract query language and adapters for OData and JSON.
- Implementations of `DS.Store` and `DS.Adapter` with support of _projections_.
