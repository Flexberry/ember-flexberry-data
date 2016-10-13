/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import DS from 'ember-data';
import isAsync from '../utils/is-async';
import isObject from '../utils/is-object';
import generateUniqueId from '../utils/generate-unique-id';
import IndexedDBAdapter from '../query/indexeddb-adapter';
import QueryObject from '../query/query-object';
import QueryBuilder from '../query/builder';
import FilterOperator from '../query/filter-operator';
import Condition from '../query/condition';
import { SimplePredicate, ComplexPredicate } from '../query/predicate';
import Dexie from 'npm:dexie';

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
      let idba = new IndexedDBAdapter(db);
      let queryObject = query instanceof QueryObject ? query : this._makeQueryObject(store, modelName, query, projection);
      return idba.query(queryObject).then(records => new RSVP.Promise((resolve, reject) => {
        let promises = Ember.A();
        for (let i = 0; i < records.data.length; i++) {
          let record = records.data[i];
          promises.pushObject(this._completeLoadRecord(store, type, record, projection, originType));
        }

        RSVP.all(promises).then(() => {
          resolve(records);
        }).catch((reason) => {
          reject(reason);
        });
      }));
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
    let createOperation = (db) => {
      let hash = store.serializerFor(snapshot.modelName).serialize(snapshot, { includeId: true });
      return new RSVP.Promise((resolve, reject) => {
        db.table(type.modelName).add(hash).then((id) => {
          db.table(type.modelName).get(id).then((record) => {
            resolve(record);
          }).catch(reject);
        }).catch(reject);
      });
    };

    return dexieService.performQueueOperation(db, createOperation);
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
    let updateOperation = (db) => {
      let hash = store.serializerFor(snapshot.modelName).serialize(snapshot, { includeId: true });
      return new RSVP.Promise((resolve, reject) => {
        db.table(type.modelName).put(hash).then((id) => {
          db.table(type.modelName).get(id).then((record) => {
            resolve(record);
          }).catch(reject);
        }).catch(reject);
      });
    };

    return dexieService.performQueueOperation(db, updateOperation);
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
    return dexieService.performQueueOperation(db, (db) => db.table(type.modelName).delete(snapshot.id));
  },

  /**
    Create record if her not exist, or update record.

    @param {DS.Store} store
    @param {DS.Model} type
    @param {DS.Snapshot} snapshot
    @return {Promise}
  */
  updateOrCreate(store, type, snapshot) {
    let dexieService = this.get('dexieService');
    let db = dexieService.dexie(this.get('dbName'), store);
    let hash = store.serializerFor(snapshot.modelName).serialize(snapshot, { includeId: true });
    return dexieService.performQueueOperation(db, (db) => db.table(type.modelName).put(hash));
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

  /**
    Completes loading record for given projection.

    @method _completeLoadingRecord
    @param {subclass of DS.Store} store Store to use for complete loading record.
    @param {subclass of DS.Model} type Model type.
    @param {Object} record Main record loaded by adapter.
    @param {Object} [projection] Projection for complete loading of record.
    @param {subclass of DS.Model} [originType] Type of model that referencing to main record's model type.
    @return {Object} Completely loaded record with all properties
                     include relationships corresponds to given projection
    @private
  */
  _completeLoadRecord: function(store, type, record, projection, originType) {
    let promises = Ember.A();
    if (!Ember.isNone(projection) && projection.attributes) {
      let attributes = projection.attributes;
      for (let attrName in attributes) {
        if (attributes.hasOwnProperty(attrName)) {
          this._replaceIdToHash(store, type, record, attributes, attrName, promises);
        }
      }
    } else {
      let relationshipNames = Ember.get(type, 'relationshipNames');
      let allRelationshipNames = Ember.A().concat(relationshipNames.belongsTo, relationshipNames.hasMany);
      let relationshipsByName = Ember.get(type, 'relationshipsByName');
      let originTypeModelName = !Ember.isNone(originType) ? originType.modelName : '';
      allRelationshipNames.forEach(function(attrName) {
        // Avoid loops formed by inverse attributes.
        let possibleInverseType = store.modelFor(relationshipsByName.get(attrName).type);
        let relationshipsByNameOfPossibleInverseType = Ember.get(possibleInverseType, 'relationshipsByName');
        let inverseAttribute = relationshipsByName.get(attrName).options.inverse;
        let possibleInverseTypeMeta = !Ember.isNone(inverseAttribute) ? relationshipsByNameOfPossibleInverseType.get(inverseAttribute) : null;
        if ((Ember.isNone(possibleInverseTypeMeta) || relationshipsByName.get(attrName).type !== originTypeModelName) && !Ember.isEmpty(record[attrName])) {
          this._replaceIdToHash(store, type, record, relationshipsByName, attrName, promises);
        }
      }, this);
    }

    return RSVP.all(promises).then(() => {
      let relationshipNames = Ember.get(type, 'relationshipNames');
      let belongsTo = relationshipNames.belongsTo;
      for (let i = 0; i < belongsTo.length; i++) {
        let relationshipName = belongsTo[i];
        if (!isAsync(type, relationshipName) && !isObject(record[relationshipName])) {
          record[relationshipName] = null;
        }
      }

      let hasMany = relationshipNames.hasMany;
      for (let i = 0; i < hasMany.length; i++) {
        let relationshipName = hasMany[i];
        if (!Ember.isArray(record[relationshipName])) {
          record[relationshipName] = [];
        } else {
          if (!isAsync(type, relationshipName)) {
            let hasUnloadedObjects = false;
            for (let j = 0; j < record[relationshipName].length; j++) {
              if (!isObject(record[relationshipName][j])) {
                hasUnloadedObjects = true;
              }
            }

            if (hasUnloadedObjects) {
              record[relationshipName] = [];
            }
          }
        }
      }

      return record;
    });
  },

  _loadRelatedRecord(store, type, id, proj, originType) {
    let modelName = proj.modelName ? proj.modelName : proj.type;
    let builder = new QueryBuilder(store, modelName);
    builder.byId(id);

    if (proj && proj.modelName) {
      let attrNames = 'id';
      let attrs = proj.attributes;
      for (let key in attrs) {
        if (attrs.hasOwnProperty(key) && !Ember.isNone(attrs[key].kind)) {
          attrNames += ',' + key;
        }
      }

      builder.select(attrNames);
    }

    let query = builder.build();
    if (Ember.$.isEmptyObject(builder._select)) {
      // Now if projection is not specified then only 'id' field will be selected.
      query.select = [];
    }

    query.originType = originType;
    if (proj && proj.modelName) {
      query.projection = proj;
    }

    return this.queryRecord(store, type, query);
  },

  _replaceIdToHash(store, type,  record, attributes, attrName, promises) {
    let attr = attributes.hasOwnProperty(attrName) ? attributes[attrName] : attributes.get(attrName);
    let modelName = attr.modelName ? attr.modelName : attr.type;
    let relatedModelType = (attr.kind === 'belongsTo' || attr.kind === 'hasMany') ? store.modelFor(modelName) : null;
    switch (attr.kind) {
      case 'attr':
        break;
      case 'belongsTo':
        if (!isAsync(type, attrName)) {
          // let primaryKeyName = this.serializer.get('primaryKey');
          let id = record[attrName];
          if (!Ember.isNone(id) && (!isObject(id))) {
            promises.pushObject(this._loadRelatedRecord(store, relatedModelType, id, attr, type).then((relatedRecord) => {
              delete record[attrName];
              record[attrName] = relatedRecord;
            }));
          }
        }

        break;
      case 'hasMany':
        if (!isAsync(type, attrName)) {
          if (Ember.isArray(record[attrName])) {
            let ids = Ember.copy(record[attrName]);
            delete record[attrName];
            record[attrName] = [];
            let pushToRecordArray = (relatedRecord) => {
              record[attrName].push(relatedRecord);
            };

            for (var i = 0; i < ids.length; i++) {
              let id = ids[i];
              if (!isObject(id)) {
                promises.pushObject(this._loadRelatedRecord(store, relatedModelType, id, attr, type).then(pushToRecordArray));
              } else {
                pushToRecordArray(id);
              }
            }
          } else {
            record[attrName] = [];
          }
        }

        break;
      default:
        throw new Error(`Unknown kind of projection attribute: ${attr.kind}`);
    }
  }
});
