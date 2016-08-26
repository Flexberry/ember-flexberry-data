# Change Log

## [Unreleased]
### Changed
- Now `syncer` is a ember service.

## [0.5.0-beta.4] - 2016-08-25
### Fixed
- Using captions instead keys for enum fields in `syncer`.
- Missing attributes in `audit-entity-offline` serializer.

## [0.5.0-beta.3] - 2016-08-24
### Added
- Methods for rollback relationships of model:
  - `changedBelongsTo` - to find out `belongsTo` relationships were changed.
  - `rollbackBelongsTo` - to perform rollback `belongsTo` relationships operation.
  - `changedHasMany` - to find out `hasMany` relationships were changed.
  - `rollbackHasMany` - to perform rollback `hasMany` relationships operation.

### Fixed
- Attribute type for `operationType` in `audit-entity` model.
- Now using `query` method instead of `queryRecord` in `Syncer` because of [issue in `ember-data@2.4.3`](https://github.com/emberjs/data/issues/4310).

## [0.5.0-beta.2] - 2016-08-23
### Changed
- Updated audit model to match server model.

## [0.5.0-beta.0] - 2016-08-19
### Added
- Synchronization of model changes made in offline mode using `syncUp` method (with a server) in `Syncer` class.

### Fixed
- Added missing files to `app/initializers` which are required for offline support.

## [0.4.0] - 2016-08-14
### Added
- Transforms and enum initializer from [`ember-flexberry`](https://github.com/Flexberry/ember-flexberry) addon.
- `decimal` transform for ability to use '.' and ',' as decimal separator in float numbers. So now it is possible to use `decimal` type for declaring attributes of models.

### Changed
- Function `enumCaptions` now returns object without null values.
- Offline support:
    - It is not necessary now to specify projection when syncing down or reading data from offline storage.

### Fixed
- Using `pathForType` function in `ODataAdapter` for building URL.
- It is possible now to specify `namespace` property in `ODataAdapter` for building URL.

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
