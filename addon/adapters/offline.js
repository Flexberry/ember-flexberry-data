/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import DS from 'ember-data';
import isAsync from '../utils/is-async';
import isObject from '../utils/is-object';
import generateUniqueId from '../utils/generate-unique-id';
import IndexeddbAdapter from '../query/indexeddb-adapter';
import QueryObject from '../query/query-object';
import QueryBuilder from '../query/builder';
import FilterOperator from '../query/filter-operator';
import Condition from '../query/condition';
import { SimplePredicate, ComplexPredicate } from '../query/predicate';
import Dexie from 'npm:dexie';

/**
  Default adapter for {{#crossLink "Offline.LocalStore"}}{{/crossLink}}.

  @class Offline
  @namespace Adapter
  @extends <a href="http://emberjs.com/api/data/classes/DS.Adapter.html">DS.Adapter</a>
*/
var OfflineAdapter = DS.Adapter.extend({
  /**
    Accumulates schemas of models used in Dexie.

    @property _schemas
    @type Object
    @private
  */
  _schemas: {},

  defaultSerializer: 'offline',

  //queue: LFQueue.create(),
  //cache: LFCache.create(),
  //caching: 'model',
  coalesceFindRequests: true,

  /**
    Database name for IndexedDB.

    @property databaseName
    @type String
  */
  databaseName: undefined,

  /*
    Adapter initialization.
  */
  init() {
    this._super(...arguments);
    Ember.assert('Error: database name for IndexedDB is not defined', !Ember.isNone(this.databaseName));
  },

  shouldBackgroundReloadRecord() {
    return false;
  },

  shouldReloadAll() {
    return true;
  },

  /*
    Generate globally unique IDs for records.
  */
  generateIdForRecord: generateUniqueId,

  /**
    Clear adapter's cache and IndexedDB's store.

    @method clear
  */
  clear: function () {
    // clear data in databse
    var db = new Dexie(this.databaseName);
    return db.delete();
  },

  /**
    This is the main entry point into finding records.

    @method findRecord
    @param {DS.Store} store
    @param {DS.Model} type
    @param {Object|String|Integer|null} id
  */
  findRecord(store, type, id) {
    let table = this._getTableForOperationsByModelType(type);
    return table.get(id);
  },

  findAll(store, type) {
    let db = new Dexie(this.databaseName);
    let table = db.table(type.modelName);
    return table.toArray();
  },

  findMany(store, type, ids) {
    let promises = Ember.A();
    let records = Ember.A();
    let addRecord = (record) => {
      records.pushObject(record);
    };

    for (let i = 0; i < ids.length; i++) {
      promises.pushObject(this.findRecord(store, type, ids[i]).then(addRecord));
    }

    return Ember.RSVP.all(promises).then(() => {
      Ember.RSVP.resolve(records.compact());
    }).catch(function(reason) {
      Ember.RSVP.reject(reason);
    });
  },

  queryRecord(store, type, query) {
    return this.query(store, type, query).then(result => new Ember.RSVP.Promise((resolve) => resolve(result[0])));
  },

  /**
    Supports query language objects or queries that look like this:
     {
       <property to query>: <value to match>,
       ...
     }

    (in this case every property added to the query is an "AND" query, not "OR")
  */
  query(store, type, query) {
    let modelName = type.modelName;
    let proj = this._extractProjectionFromQuery(modelName, type, query);
    let originType = null;
    if (query && query.originType) {
      originType = query.originType;

      delete query.originType;
    }

    let indexedDBAdapter = new IndexeddbAdapter(this.databaseName);

    let _this = this;
    let queryForIndexedDBAdapter = query instanceof QueryObject ? query : this._makeQueryObject(store, modelName, query, proj);
    return indexedDBAdapter.query(store, queryForIndexedDBAdapter).then((recordArray) =>
      new Ember.RSVP.Promise((resolve, reject) => {
        let promises = Ember.A();
        for (let i = 0; i < recordArray.length; i++) {
          let record = recordArray[i];
          promises.pushObject(_this._completeLoadRecord(store, type, record, proj, originType));
        }

        Ember.RSVP.all(promises).then(() => {
          resolve(recordArray);
        }).catch((reason) => {
          reject(reason);
        });
      })
    );
  },

  createRecord(store, type, snapshot) {
    return this._updateOrCreate(store, type, snapshot);
  },

  updateRecord(store, type, snapshot) {
    return this._updateOrCreate(store, type, snapshot);
  },

  deleteRecord(store, type, snapshot) {
    let table = this._getTableForOperationsByModelType(type);
    return table.delete(snapshot.id);
  },

  // private

  /**
    Gets [WritableTable](https://github.com/dfahlander/Dexie.js/wiki/WriteableTable) class for given model type.
    Creates [Dexie's schema](https://github.com/dfahlander/Dexie.js/wiki/Version.stores()) that contains only 'id' property for specified model type.
    Preparing database and execute `callback` with good database.
    IMPORTANT: From function `callback` must be returned `Promise`, after resolve `Promise`, database will be closed.

    @method _getTableForOperationsByModelType
    @param {subclass of DS.Model} type Model type.
    @return {WritableTable} Instance of [WritableTable](https://github.com/dfahlander/Dexie.js/wiki/WriteableTable) class for given model type.
    @method dexie
    @private
    @param {DS.Model} type
    @param {Function} callback Function that has one parameters, database is ready for use.
    @return {Promise}
  */
  _getTableForOperationsByModelType(type) {
    let schemas = this.get('_schemas');
    if (!schemas[type.modelName]) {
      schemas[type.modelName] = {
        schema: this._createSchema(type),
        version: Object.keys(schemas).length + 1,
      };

      this.set('_schemas', schemas);
    }
  dexie(type, callback) {
    return new RSVP.Promise((resolve, reject) => {
      let db = this._dexie(this.get('dbName'));
      db.open().then((db) => {
        let currentSchema = this._currentSchema(db);
        if (!currentSchema[type.modelName]) {
          db.close();
          db.version(db.verno).stores(currentSchema);
          db.version(db.verno + 0.1).stores(this._createSchema(type));
        }

    let db = new Dexie(this.databaseName);
    for (let schema in schemas) {
      db.version(schemas[schema].version).stores(schemas[schema].schema);
    }
        return db.open();
      }).catch(Dexie.NoSuchDatabaseError, () => {
        db.version(0.1).stores(this._createSchema(type));
        return db.open();
      }).catch((error) => {
        reject(error);
      }).finally(() => {
        if (db.isOpen()) {
          let promise = callback(db);
          promise.finally(db.close);
          resolve(promise);
        } else {
          reject(new Error('Sorry, database does not open...'));
        }
      });
    });
  },

    return db[type.modelName];
  /**
    Return new instance of Dexie database.

    @method _dexie
    @private
    @param {String} dbName
    @param {Object} [options]
    @param {Array} [options.addons]
    @param {Boolean} [options.autoOpen=false]
    @param {IDBFactory} [options.indexedDB=window.indexedDB]
    @param {IDBKeyRange} [options.IDBKeyRange]
    @return {Dexie} Dexie database.
  */
  _dexie(dbName, options) {
    return new Dexie(dbName, merge({
      autoOpen: false,
      indexedDB: window.indexedDB,
    }, options));
  },

  /**
    Return schema of model for Dexie.

    @method _createSchema
    @private
    @param {DS.Model} type
    @return {Object} Schema of model for Dexie.
  */
  _createSchema(type) {
    let schema = {};
    schema[type.modelName] = 'id';

    type.eachAttribute((name) => {
      schema[type.modelName] += `,${name}`;
    });

    type.eachRelationship((name, { kind }) => {
      switch (kind) {
        case 'belongsTo':
          schema[type.modelName] += `,${name}`;
          break;

        case 'hasMany':
          schema[type.modelName] += `,*${name}`;
          break;

        default:
          throw new Error(`Unknown kind: '${kind}'.`);
      }
    });

    return schema;
  },

  _updateOrCreate(store, type, snapshot) {
    const serializer = store.serializerFor(type.modelName);
    const recordHash = serializer.serialize(snapshot, { includeId: true });
    return this._getTableForOperationsByModelType(snapshot.type).put(recordHash);
  /**
    Return schema of database.
    IMPORTANT: If database has been never opened, schema will be empty.

    @method _schemaFromDB
    @private
    @param {Dexie} db
    @return {Object} Schema of database.
  */
  _currentSchema(db) {
    let schema = {};
    db.tables.forEach((table) => {
      let projection = [table.schema.primKey].concat(table.schema.indexes);
      schema[table.name] = projection.map(attribute => attribute.src).join(',');
    });
    return schema;
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
      const queryValue = query[property];

      // I suppose it's possible to encounter problems when queryValue will have 'Date' type...
      predicates.push(new SimplePredicate(property, FilterOperator.Eq, queryValue.toString()));
    }

    if (predicates.length === 1) {
      builder.where(predicates[0]);
    } else if (predicates.length > 1) {
      let cp = new ComplexPredicate(Condition.And, predicates[0], predicates[1]);
      for (let i = 2; i < predicates.length; i++) {
        cp.and(predicates[i]);
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

    return Ember.RSVP.all(promises).then(() => {
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
    let relatedRecord = store.peekRecord(modelName, id);
    if (Ember.isNone(relatedRecord)) {
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
    } else {
      let relatedRecordObject = relatedRecord.serialize({ includeId: true });
      return this._completeLoadRecord(store, type, relatedRecordObject, proj, originType);
    }
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

export default OfflineAdapter;
