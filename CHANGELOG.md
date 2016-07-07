# Change Log

## [Unreleased]
### Added
- Support special 'id' attribute at query language:

  ```javascript 
  new SimplePredicate('manager', 'eq', key) === new SimplePredicate('manager.id', 'eq', key)
  ```

## [0.2.0] - 01.07.2016
### Added
- Predicates for details with any / all functionality.
- Filtering and ordering by master (using primary key) and it's fields.
### Fixed
- Using nested complex predicates for all adapters.

