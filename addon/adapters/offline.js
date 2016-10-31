/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import DS from 'ember-data';
import isObject from '../utils/is-object';
import generateUniqueId from '../utils/generate-unique-id';
import IndexedDBAdapter from '../query/indexeddb-adapter';
import QueryObject from '../query/query-object';
import QueryBuilder from '../query/builder';
import FilterOperator from '../query/filter-operator';
import Condition from '../query/condition';
import { SimplePredicate, ComplexPredicate } from '../query/predicate';
import Dexie from 'npm:dexie';
import Information from '../utils/information';

const { RSVP } = Ember;

/**
  Default adapter for {{#crossLink "Offline.LocalStore"}}{{/crossLink}}.

  @class Offline
  @namespace Adapter
  @extends <a href="http://emberjs.com/api/data/classes/DS.Adapter.html">DS.Adapter</a>
*/
export default DS.Adapter.extend({
  /**
    If you would like your adapter to use a custom serializer you can set the defaultSerializer property to be the name of the custom serializer.
    [More info](http://emberjs.com/api/data/classes/DS.Adapter.html#property_defaultSerializer).

    @property defaultSerializer
    @type String
    @default 'offline'
  */
  defaultSerializer: 'offline',

  /**
    Database name for IndexedDB.

    @property dbName
    @type String
    @default 'ember-flexberry-data'
  */
  dbName: 'ember-flexberry-data',

  /**
    Instance of dexie service.

    @property dexieService
    @type Offline.DexieService
  */
  dexieService: Ember.inject.service('dexie'),

  /**
    Generate globally unique IDs for records.

    @method generateIdForRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object} inputProperties
    @return {String}
  */
  generateIdForRecord: generateUniqueId,

  /**
    Clear tables in IndexedDB database, if `table` not specified, clear all tables.

    @method clear
    @param {String} [table] Table name.
    @return {Promise}
  */
  clear(table) {
    let store = Ember.getOwner(this).lookup('service:store');
    let dexieService = this.get('dexieService');
    let db = dexieService.dexie(this.get('dbName'), store);
    if (table) {
      return dexieService.performQueueOperation(db, (db) => db.table(table).clear());
    } else {
      return RSVP.all(db.tables.map(table => dexieService.performQueueOperation(db, () => table.clear())));
    }
  },

  /**
    Delete IndexedDB database.

    @method delete
    @return {Promise}
  */
  delete() {
    return Dexie.delete(this.get('dbName'));
  },

  /**
    The `findRecord()` method is invoked when the store is asked for a record that has not previously been loaded.
    [More info](http://emberjs.com/api/data/classes/DS.Adapter.html#method_findRecord).

    @method findRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {String|Integer} id
    @return {Promise}
  */
  findRecord(store, type, id) {
    let dexieService = this.get('dexieService');
    let db = dexieService.dexie(this.get('dbName'), store);
    return dexieService.performOperation(db, (db) => db.table(type.modelName).get(id));
  },

  /**
    The `findAll()` method is used to retrieve all records for a given type.
    [More info](http://emberjs.com/api/data/classes/DS.Adapter.html#method_findAll).

    @method findAll
    @param {DS.Store} store
    @param {DS.Model} type
    @return {Promise}
  */
  findAll(store, type) {
    let dexieService = this.get('dexieService');
    let db = dexieService.dexie(this.get('dbName'), store);
    return dexieService.performOperation(db, (db) => db.table(type.modelName).toArray());
  },

  /**
    Find multiple records at once if coalesceFindRequests is true.
    [More info](http://emberjs.com/api/data/classes/DS.Adapter.html#method_findMany).

    @method findMany
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Array} ids
    @return {Promise}
  */
  findMany(store, type, ids) {
    let promises = Ember.A();
    let records = Ember.A();
    let addRecord = (record) => {
      records.pushObject(record);
    };

    for (let i = 0; i < ids.length; i++) {
      promises.pushObject(this.findRecord(store, type, ids[i]).then(addRecord));
    }

    return RSVP.all(promises).then(() => RSVP.resolve(records.compact())).catch(reason => RSVP.reject(reason));
  },

  /**
    The `queryRecord()` method is invoked when the store is asked for a single record through a query object.
    [More info](http://emberjs.com/api/data/classes/DS.Adapter.html#method_queryRecord).

    @method queryRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object|QueryObject} query
    @return {Promise}
  */
  queryRecord(store, type, query) {
    return this.query(store, type, query).then(records => new RSVP.resolve(records.data[0]));
  },

  /**
    This method is called when you call `query` on the store.
    [More info](http://emberjs.com/api/data/classes/DS.Adapter.html#method_query).

    Supports {{#crossLink "Query.QueryObject"}}{{/crossLink}} instance or objects that look like this:
      ```javascript
      {
        ...
        <property to query>: <value to match>,
        //and
        <property to query>: <value to match>,
        ...
      }
      ```

    @method query
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object|QueryObject} query
    @return {Promise}
  */
  query(store, type, query) {
    let modelName = type.modelName;
    let projection = this._extractProjectionFromQuery(modelName, type, query);
    let originType = null;
    if (query && query.originType) {
      originType = query.originType;
      delete query.originType;
    }

    let dexieService = this.get('dexieService');
    let db = dexieService.dexie(this.get('dbName'), store);
    let queryOperation = (db) => {
      let queryObject = query instanceof QueryObject ? query : this._makeQueryObject(store, modelName, query, projection);
      return new IndexedDBAdapter(db).query(queryObject);
    };

    return dexieService.performOperation(db, queryOperation);
  },

  /**
    Implement this method in a subclass to handle the creation of new records.
    [More info](http://emberjs.com/api/data/classes/DS.Adapter.html#method_createRecord).

    @method createRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {DS.Snapshot} snapshot
    @return {Promise}
  */
  createRecord(store, type, snapshot) {
    let dexieService = this.get('dexieService');
    let db = dexieService.dexie(this.get('dbName'), store);
    let hash = store.serializerFor(snapshot.modelName).serialize(snapshot, { includeId: true });
    let createOperation = (db) => new RSVP.Promise((resolve, reject) => {
      db.table(type.modelName).add(hash).then((id) => {
        db.table(type.modelName).get(id).then((record) => {
          resolve(record);
        }).catch(reject);
      }).catch(reject);
    });

    return dexieService.performQueueOperation(db, createOperation).then(() => {
      this._createOrUpdateParentModels(store, type, hash);
    });
  },

  /**
    Implement this method in a subclass to handle the updating of a record.
    [More info](http://emberjs.com/api/data/classes/DS.Adapter.html#method_updateRecord).

    @method updateRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {DS.Snapshot} snapshot
    @return {Promise}
  */
  updateRecord(store, type, snapshot) {
    let dexieService = this.get('dexieService');
    let db = dexieService.dexie(this.get('dbName'), store);
    let hash = store.serializerFor(snapshot.modelName).serialize(snapshot, { includeId: true });
    let updateOperation = (db) => new RSVP.Promise((resolve, reject) => {
      db.table(type.modelName).put(hash).then((id) => {
        db.table(type.modelName).get(id).then((record) => {
          resolve(record);
        }).catch(reject);
      }).catch(reject);
    });

    return dexieService.performQueueOperation(db, updateOperation).then(() => {
      this._createOrUpdateParentModels(store, type, hash);
    });
  },

  /**
    Implement this method in a subclass to handle the deletion of a record.
    [More info](http://emberjs.com/api/data/classes/DS.Adapter.html#method_deleteRecord).

    @method deleteRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {DS.Snapshot} snapshot
    @return {Promise}
  */
  deleteRecord(store, type, snapshot) {
    let dexieService = this.get('dexieService');
    let db = dexieService.dexie(this.get('dbName'), store);
    return dexieService.performQueueOperation(db, (db) => db.table(type.modelName).delete(snapshot.id)).then(() => {
      this._deleteParentModels(store, type, snapshot.id);
    });
  },

  /**
    Create record if it does not exist, or update changed fields of record.

    @param {DS.Store} store
    @param {DS.Model} type
    @param {DS.Snapshot} snapshot
    @param {Object} fieldsToUpdate
    @return {Promise}
  */
  updateOrCreate(store, type, snapshot, fieldsToUpdate) {
    let dexieService = this.get('dexieService');
    let db = dexieService.dexie(this.get('dbName'), store);
    let updateOrCreateOperation = (db) => new Ember.RSVP.Promise((resolve, reject) => {
      db.table(type.modelName).get(snapshot.id).then((record) => {
        if (!Ember.isNone(fieldsToUpdate) && record) {
          if (Ember.$.isEmptyObject(fieldsToUpdate)) {
            resolve();
          } else {
            let hash = store.serializerFor(snapshot.modelName).serialize(snapshot, { includeId: true });
            for (let attrName in hash) {
              if (hash.hasOwnProperty(attrName) && !fieldsToUpdate.hasOwnProperty(attrName)) {
                delete hash[attrName];
              }
            }

            return dexieService.performQueueOperation(db, (db) => db.table(type.modelName).update(snapshot.id, hash)).then(resolve, reject);
          }
        } else {
          let hash = store.serializerFor(snapshot.modelName).serialize(snapshot, { includeId: true });
          return dexieService.performQueueOperation(db, (db) => db.table(type.modelName).put(hash)).then(resolve, reject);
        }
      });
    });

    return dexieService.performOperation(db, updateOrCreateOperation);
  },

  /**
    Makes {{#crossLink "Query.QueryObject"}}{{/crossLink}} out of queries that look like this:
     {
       <property to query>: <value to match>,
       ...
     }.

    @method _makeQueryObject
    @param store Store used for making query
    @param {String} modelName The name of the model type.
    @param {Object} query Query parameters.
    @param {Object|String} [projection] Projection for query.
    @return {QueryObject} Query object for IndexedDB adapter.
    @private
  */
  _makeQueryObject(store, modelName, query, projection) {
    let builder = new QueryBuilder(store, modelName);
    if (projection && isObject(projection) && (projection.projectionName)) {
      builder.selectByProjection(projection.projectionName);
    } else if (projection && typeof projection === 'string') {
      builder.selectByProjection(projection);
    }

    let predicates = [];
    for (let property in query) {
      const queryValue = query[property] instanceof Date ? query[property].toString() : query[property];

      // I suppose it's possible to encounter problems when queryValue will have 'Date' type...
      predicates.push(new SimplePredicate(property, FilterOperator.Eq, queryValue));
    }

    if (predicates.length === 1) {
      builder.where(predicates[0]);
    } else if (predicates.length > 1) {
      let cp = new ComplexPredicate(Condition.And, predicates[0], predicates[1]);
      for (let i = 2; i < predicates.length; i++) {
        cp = cp.and(predicates[i]);
      }

      builder.where(cp);
    }

    let queryObject = builder.build();
    if (Ember.isEmpty(queryObject.projectionName)) {
      // Now if projection is not specified then only 'id' field will be selected.
      queryObject.select = [];
    }

    return queryObject;
  },

  /**
    Retrieves projection from query and returns it.
    Retrieved projection removes from the query.

    @method _extractProjectionFromQuery
    @param {String} modelName The name of the model type.
    @param {subclass of DS.Model} typeClass Model type.
    @param {Object} [query] Query parameters.
    @param {String} [query.projection] Projection name.
    @return {Object} Extracted projection from query or null
                     if projection is not set in query.
    @private
  */
  _extractProjectionFromQuery: function(modelName, typeClass, query) {
    if (query && query.projection) {
      let proj = query.projection;
      if (typeof query.projection === 'string') {
        let projName = query.projection;
        proj = typeClass.projections.get(projName);
      }

      delete query.projection;
      return proj;
    }

    // If using Query Language
    if (query && query instanceof QueryObject && !Ember.isNone(query.projectionName)) {
      let proj = typeClass.projections.get(query.projectionName);

      return proj;
    }

    return null;
  },

  _createOrUpdateParentModels(store, type, record) {
    let _this = this;
    let parentModelName = type._parentModelName;
    if (parentModelName) {
      let information = new Information(store);
      let newHash = {};
      Ember.merge(newHash, record);
      for (let attrName in newHash) {
        if (newHash.hasOwnProperty(attrName) && !information.isExist(parentModelName, attrName)) {
          delete newHash[attrName];
        }
      }

      let dexieService = _this.get('dexieService');
      let db = dexieService.dexie(_this.get('dbName'), store);
      dexieService.performQueueOperation(db, (db) => db.table(parentModelName).put(newHash)).then(() => {
        _this._createOrUpdateParentModels(store, store.modelFor(parentModelName), record);
      });
    }
  },

  _deleteParentModels(store, type, id) {
    let _this = this;
    let parentModelName = type._parentModelName;
    if (parentModelName) {
      let dexieService = _this.get('dexieService');
      let db = dexieService.dexie(_this.get('dbName'), store);
      dexieService.performQueueOperation(db, (db) => db.table(parentModelName).delete(id)).then(() => {
        _this._deleteParentModels(store, store.modelFor(parentModelName), id);
      });
    }
  }
});
