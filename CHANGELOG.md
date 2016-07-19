# Change Log

## [Unreleased]
### Added
- Support special 'id' attribute at query language:

  ```javascript 
  new SimplePredicate('manager', 'eq', key) === new SimplePredicate('manager.id', 'eq', key)
  ```
- Classes to support work in offline mode. See `Offline` namespace in [api documentation](http://flexberry.github.io/Documentation/master/modules/ember-flexberry-data.html).

### Changed
- The addon is no longer exports `Projection` namespace. Instead with following extra changes:
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

## [0.2.0] - 01.07.2016
### Added
- Predicates for details with any / all functionality.
- Filtering and ordering by master (using primary key) and it's fields.
### Fixed
- Using nested complex predicates for all adapters.

