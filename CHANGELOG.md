# Change Log

## [0.7.1-beta.3] - 2016-11-03
### Added
- Default error handlers in `syncer` service. Override [`resolveServerError`](https://github.com/Flexberry/ember-flexberry-data/blob/5a4ae8a2ab6e8c85dff17a6908b25ead887b6f6d/addon/services/syncer.js#L222) and [`resolveNotFoundRecord`](https://github.com/Flexberry/ember-flexberry-data/blob/5a4ae8a2ab6e8c85dff17a6908b25ead887b6f6d/addon/services/syncer.js#L259) methods to add custom logic.

### Changed
- Changed arguments for `syncUp` method of `syncer` service, first parameter now can be and array of jobs for execute, object with options for sync is second parameter now. **Important**. This changes are breaking!

### Fixed
- Optimized performance of loading relationships from IndexedDB.

## [0.7.1-beta.2] - 2016-10-31
### Added
- Now `dexie` service can work with multiple DBs.
- Now hashes received via `dexie` service have `loadRelationships` method that can be used for replacing ids with hashes when reading synchronous relationships.
- Some parameters checks for `builder` and `information` classes.

### Fixed
- Loading relationships in offline mode moved "under" offline adapter layer, i.e. offline adapter now get "full object" at once with embedded objects for embedded relationships. So now fixed:
    - `indexeddb-adapter` apply filters after loading relationships. This allows to filter data by master and detail model's proprties.
    - There is no relationships that "disappear" unexpectedly after reading data.
    - Improved performance for reading data in offline mode (but for some cases improving performance is still required).

## [0.7.1-beta.1] - 2016-10-28
### Fixed
- Filter by boolean value in offline mode, if restriction was passed via complex predicate.

## [0.7.1-beta.0] - 2016-10-27
### Fixed
- `syncer` service now makes casting for `boolean` type and corrected casting for `null` value of all types while performing sync up.
- Serializing attributes of `boolean`, `number` and `decimal` types when saving offline.
- Now it is able to save and read `null` value in `boolean` attributes in offline mode.

## [0.6.2-beta.30] - 2016-10-21
### Added
- Base model properties:
    - `isSyncingUp` - true if model is syncing up.
    - `isCreatedDuringSyncUp` - true if model is created during sync up process.
    - `isUpdatedDuringSyncUp` - true if model is updated last time during sync up process.
    - `isDestroyedDuringSyncUp` - true if model is destroyed during sync up process.

### Fixed
- Now we are saving information about model type of polymorphic belongsTo relationships into local store. Setting proper types of polymorphic belongsTo relationships should come in next versions of addon.

## [0.6.2-beta.29] - 2016-10-20
### Fixed
- Saving of wrong relationship type for polymorphic belongsTo relationships in offline audit objects.

## [0.6.2-beta.28] - 2016-10-19
### Added
- Saving of base models logic for offline (for create/update/delete operations). Now it is not using transactions (will be added in next versions).

### Changed
- Disable models unloads after sync down and sync up operations in `syncer` service.

## [0.6.2-beta.27] - 2016-10-18
### Fixed
- Some internal bugs in `syncDown` method of `syncer` service.

## [0.6.2-beta.26] - 2016-10-18
### Fixed
- If `queryRecord` method did not find any record, it still tries to call `didLoad`.

## [0.6.2-beta.25] - 2016-10-17
### Added
- `allowSyncDownRelatedRecordsWithoutProjection` option for offline settings. If true then record will be synced down completely, i.e. including with all related records with arbitrary nesting. Otherwise only requested record will be synced down without related records.

## [0.6.2-beta.24] - 2016-10-17
### Fixed
- When rollback `belongsTo` relationships, if relationship was reset to null then rollback relationship attempts to apply for null.
- When rollback `belongsTo` relationships, there was no rollback for canonical state of relationship.
- If model is not support `rollbackBelongsTo` mehod then it should not be called.

### Known issues
- Event `didLoad` fired for model instance only when model loads first time. We added manual triggering of this event to save state, because model instance can be loaded in another projection.

## [0.6.2-beta.23] - 2016-10-16
### Fixed
- Small optimization of performance for sync down operation.
- `syncer` service waited for loading only one last relationship when restoring changes for record while performing sync up.
- `syncer` service was not considered types of attributes when restoring values while performing sync up, now it makes casting for `date` and `number` types.
-  Audit fields was not filled because `save` method of `offline-model` mixin for offline run first (before `save` method of `audit-model` mixin).

## [0.6.2-beta.22] - 2016-10-15
### Added
- `syncer` service now saves changed relationships for sync up process.

### Changed
- `syncer` service now selects jobs for sync up using query language. This allows select at once 'Unexecuted' and 'Failed' jobs and sort them.

## [0.6.2-beta.21] - 2016-10-15
### Changed
- Now we don't replace entire record when sync down. Instead we save only changed properties which are specified in projection for existing records in local store.

### Fixed
- Update IndexedDB database failed if database version in offline schema was specified as string.
- Sorting in `indexeddb-adapter` is now applying before skip and top.

## [0.6.2-beta.20] - 2016-10-14
### Added
- Ability to specify option for unloading records from online store when sync down. It's topical for sync down big data. Please add `{ unloadSyncedRecords: true }` as fourth parameter in `syncDown` method calls where needed.

### Changed
- Search by string (by all fields in lists) is now case insensitive in offline mode.

### Fixed
- Not quite adequate implementation of `updateRecord` method of `offline` adapter.
- Search by empty fields in `js-adapter`.

## [0.6.2-beta.19] - 2016-10-12
### Added
- `timeout` property to `odata` adapter.

### Fixed
- Loading related records logic in `offline` adapter for synchronous reading.

## [0.6.2-beta.18] - 2016-10-11
### Fixed
- `reloadLocalRecords` method tried to clear table using model class instead of model name.
- Projection passed in options now processing correctly in `findAll` and `findRecord` methods of local store.

## [0.6.2-beta.17] - 2016-10-10
### Changed
- Fix problems with getting `dexie` service.

## [0.6.2-beta.16] - 2016-10-10
### Changed
- Property `queueSyncDownWorksCount` was moved to `dexie` service.

## [0.6.2-beta.15] - 2016-10-07
### Changed
- Property `queueSyncDownWorksCount` now stores actual number of objects that should be synced down.

### Removed
- Property `completeSyncDownWorksCount` in `base-store` was removed.

## [0.6.2-beta.14] - 2016-10-07
### Added
- Now you can specify table name for `clear` method from `Adapter.Offline` for clear one table.
- Ability to specify query object in `syncDown` method of `syncer` service in case of syncing down records by model mype.

### Fixed
- Method `normalizeArrayResponse` from `Serializer.Offline` did not expect that adapter can return response in various format.
- Time of processing CRUD operations in offline adapter.
- Closing IndexedDB connection during CRUD operations.
- Errors during parallel requests to IndexedDB (now using queue of requests).

### Removed
- Obsolete code in `syncer` service.

## [0.6.2-beta.13] - 2016-10-05
### Fixed
- Casting to string only `Date` instead of all types.

## [0.6.2-beta.12] - 2016-10-05
### Added
- Properties `queueSyncDownWorksCount` and `completeSyncDownWorksCount` in `base-store` class for tracking count of objects that should be synced down.

## [0.6.2-beta.11] - 2016-10-04
### Fixed
- Syncing down records with option `syncDownWhenOnlineEnabled` is now using specified projection for online store's method call.
- Normalize array response for included objects.

## [0.6.2-beta.10] - 2016-10-04
### Added
- Support `count` function in `Query.Builder` for offline.

## [0.6.2-beta.9] - 2016-10-03
### Changed
- Service `Syncer` now not sync relationships if projection not specified.

### Fixed
- Option `useOnlineStore` not apply due to error check `offlineModels` options.
- Property `offlineModels` now use in `createRecord` and `scheduleSave` methods from `Offline.Store`.
- Now not delete `useOnlineStore` parameter from object for `query` and `queryRecord` methods.

## [0.6.2-beta.7] - 2016-10-01
### Added
- Property `offlineModels` of `Offline.Store` for specified models that by default loaded from offline.

### Fixed
- Remove validation from audit models.
- Responses format in `Offline` adapter at `createRecord` and `updateRecord` methods.
- Disable offline audit for agent model.
- Convert object into `QueryObject` for query.
- Save record in offline mode.

## [0.6.2-beta.2] - 2016-09-28
### Breaking changes
- Now uses static `offlineSchema` for Dexie. You must define `offlineSchema` in `Store` your application.

### Fixed
- Error at attempt to save existing records into IndexedDB.

## [0.6.2-beta.1] - 2016-09-23
### Changed
- Update Dexie to 1.4.2 version.

### Fixed
- Now `changedBelongsTo` is empty after saving the created model.

### Known issues
- Methods `findRecord`, `findAll` and `findMany` from `Adapter.Offline` returns model with relationships as id's not depending on options.

## [0.6.2-beta.0] - 2016-09-21
### Changed
- `Offline.LocalStore` and `Adapter.Offline`:
    - Renamed property `databaseName` to `dbName`.
- `Query.IndexedDBAdapter`:
    - Unnecessary `store` instance for `query` method.
    - No build schema by projection for query.

### Fixed
- `Adapter.Offline`:
    - Logic for dynamic schema versioning.
- `Query.IndexedDBAdapter`:
    - IndexedDB not support filter by keys type of `boolean`.

## [0.6.1] - 2016-09-16
### Fixed
- `Adapter.Offline`:
    - Using primary key type of string.
    - Schema versioning for [Dexie](https://github.com/dfahlander/Dexie.js/wiki/Design#database-versioning).

## [0.6.0] - 2016-09-14
### Added
- Query language support for `offline` adapter.
- Dependency on [`node-uuid` package](https://github.com/broofa/node-uuid). Please update addon using `ember install` command or add this dependency to `package.json` manually.

### Changed
- Model key automatically added for queries without projection (using method `Query.Builder.select`).
- Moved base model validation from [`ember-flexberry` addon](https://github.com/Flexberry/ember-flexberry).
- Update models for supporting role based security.

### Fixed
- Errors in building queries without projection (using `Query.Builder.select`).

### Removed
- Dependency on `ember-locaforage-adapter` addon and `localforage` library. **Please remove these dependencies** from `package.json` and `bower.json` in your application. Also **please delete corresponding folders** from `node_modules` and `bower_components` in applicatoin's sources.

## [0.5.0] - 2016-09-05
### Added
- Enum support for OData query language adapter.
- `guid` transform to support adding constraints on attributes with guid type via query language.
- Methods for rollback relationships of model:
  - `changedBelongsTo` - to find out `belongsTo` relationships were changed.
  - `rollbackBelongsTo` - to perform rollback `belongsTo` relationships operation.
  - `changedHasMany` - to find out `hasMany` relationships were changed.
  - `rollbackHasMany` - to perform rollback `hasMany` relationships operation.
- Synchronization of model changes made in offline mode using `syncUp` method (with a server) in `Syncer` class.
- Models for supporting client side audit.

### Changed
- Now `syncer` is an ember service.

### Fixed
- Using captions instead keys for enum fields in `syncer`.
- Now using `query` method instead of `queryRecord` in `Syncer` because of [issue in `ember-data@2.4.3`](https://github.com/emberjs/data/issues/4310).
- Added missing files to `app/initializers` which are required for offline support.

## [0.4.0] - 2016-08-14
### Added
- Transforms, models, enums and enum initializer from [`ember-flexberry`](https://github.com/Flexberry/ember-flexberry) addon.
- `decimal` transform for ability to use '.' and ',' as decimal separator in float numbers. So now it is possible to use `decimal` type for declaring attributes of models.
- CRUD operations tests for OData.

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
