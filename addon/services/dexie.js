/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import Dexie from 'npm:dexie';
import Queue from '../utils/queue';
import isEmbedded from '../utils/is-embedded';

const { isArray, get, merge } = Ember;

/**
  Service for storing [Dexie](https://github.com/dfahlander/Dexie.js) instance for application.

  @class DexieService
  @namespace Offline
  @extends Ember.Service
  @public
*/
export default Ember.Service.extend(Ember.Evented, {
  /* Queue for requests to Dexie */
  _queue: Queue.create(),

  /**
    Contains instances of Dexie.

    @property _dexie
    @type Object
  */
  _dexie: {},

  /**
    Count of objects that should be synced down.

    @property queueSyncDownWorksCount
    @type Number
    @default 0
  */
  queueSyncDownWorksCount: 0,

  /**
    Count of objects that should be synced up.

    @property queueSyncUpWorksCount
    @type Number
    @default 0
  */
  queueSyncUpWorksCount: 0,

  /**
    Total count of objects that should be synced up on current sync up operation.

    @property queueSyncUpTotalWorksCount
    @type Number
    @default 0
  */
  queueSyncUpTotalWorksCount: 0,

  /**
    Total count of objects that should be synced up on current sync up operation.

    @property queueSyncUpTotalWorksCount
    @type String
    @default null
  */
  queueSyncUpCurrentModelName: null,

  /**
    Allows to enable or disable continuation of performing CRUD operations in queue if error occurs.

    @property queueContinueOnError
    @type Boolean
    @default true
  */
  queueContinueOnError: true,

  init() {
    this.get('_queue').set('continueOnError', this.get('queueContinueOnError'));
  },

  /**
    Return the only instance of Dexie database with specified schemas.
    Schemas are specified in base store in `offlineSchema` property.

    @method dexie
    @param {String} dbName
    @param {DS.Store or subclass} store
    @param {Object} [options]
    @param {Array} [options.addons]
    @param {Boolean} [options.autoOpen]
    @param {IDBFactory} [options.indexedDB]
    @param {IDBKeyRange} [options.IDBKeyRange]
    @return {Dexie} Dexie database.
  */
  dexie(dbName, store, options) {
    let dexie = this.get('_dexie')[dbName];
    if (dexie instanceof Dexie) {
      return dexie;
    }

    let db =  new Dexie(dbName, merge({}, options));
    let schemas = store.get('offlineSchema')[dbName];
    for (let version in schemas) {
      db.version(+version).stores(schemas[version]);
    }

    db.tables.forEach((table) => {
      let TableClass = table.defineClass({});

      TableClass.prototype.loadByProjection = function(projection, extend) {
        let modelClass = store.modelFor(table.name);
        let relationshipNames = get(modelClass, 'relationshipNames');
        let relationshipsByName = get(modelClass, 'relationshipsByName');
        let primaryKeyNameFromSerializer = store.serializerFor(table.name).get('primaryKey');
        let primaryKeyName = primaryKeyNameFromSerializer ? primaryKeyNameFromSerializer : 'id';

        let promises = [];
        let relationshipsToIterate = Ember.A();

        if (projection && typeof projection === 'string') {
          projection = get(modelClass, 'projections').get(projection);
        }

        if (projection) {
          // Killing two birds with one stone.
          for (let attributeName in this) {
            if (attributeName !== primaryKeyName && this.hasOwnProperty(attributeName)) {
              let attrIsNotPolymorphicRelationshipType = true;
              if (attributeName.length > 5 && attributeName[0] === '_' && attributeName.slice(-5) === '_type') {
                let possibleRelationshipName = attributeName.slice(1, -5);
                let relationship = relationshipsByName.get(possibleRelationshipName);
                if (relationship && relationship.options.polymorphic) {
                  attrIsNotPolymorphicRelationshipType = false;
                }
              }

              if (!projection.attributes.hasOwnProperty(attributeName) &&
                (!extend || !extend.hasOwnProperty(attributeName)) && attrIsNotPolymorphicRelationshipType) {
                delete this[attributeName];
              }

              if ((projection.attributes.hasOwnProperty(attributeName) &&
                (projection.attributes[attributeName].kind === 'belongsTo' || projection.attributes[attributeName].kind === 'hasMany')) ||
                (extend && extend.hasOwnProperty(attributeName) && relationshipsByName.get(attributeName))) {
                relationshipsToIterate.pushObject(attributeName);
              }
            }
          }
        } else {
          relationshipsToIterate.pushObjects(relationshipNames.belongsTo);
          relationshipsToIterate.pushObjects(relationshipNames.hasMany);
        }

        relationshipsToIterate.forEach((name) => {
          let relationship = relationshipsByName.get(name);
          let saveRelationship = (hash) => {
            if (!hash) {
              throw new Error(`Not found relationship with key '${this[name]}' in '${relationship.type}' table.`);
            }

            if (relationship.options.inverse) {
              if (!projection || !get(projection, `attributes.${name}.attributes.${relationship.options.inverse}`)) {
                hash[relationship.options.inverse] = null;
              }
            }

            if (relationship.kind === 'hasMany') {
              for (let i = 0; i < this[name].length; i++) {
                if (this[name][i] === hash.id) {
                  this[name][i] = hash;
                }
              }
            } else if (relationship.kind === 'belongsTo') {
              this[name] = hash;
            }

            return hash.loadByProjection(projection && projection.attributes[name], extend && extend[name]);
          };

          if (this[name] && !relationship.options.async && isEmbedded(store, modelClass, name)) {
            let ids = isArray(this[name]) ? this[name] : [this[name]];
            ids.forEach((id) => {
              promises.push(db.table(relationship.type).get(id, saveRelationship));
            });
          }
        });
        return Dexie.Promise.all(promises);
      };
    });

    this.get(`_dexie`)[dbName] = db;
    return db;
  },

  /**
    Add operation to queue of Dexie oprations.

    @method performQueueOperation
    @param {Dexie} db
    @param {Function} operation
    @return {Promise} Promise for added to queue operation.
  */
  performQueueOperation(db, operation) {
    return this._queue.attach((resolve) => {
      if (!db.isOpen()) {
        return db.open().then((db) => {
          operation(db).then(() => {
            resolve();
          });
        });
      } else {
        return operation(db).then(() => {
          resolve();
        });
      }
    });
  },

  /**
    Perform Dexie opration without adding it to queue.

    @method performOperation
    @param {Dexie} db
    @param {Function} operation
    @return {Promise} Result of performed operation.
  */
  performOperation(db, operation) {
    if (!db.isOpen()) {
      return db.open().then((db) => operation(db));
    } else {
      return operation(db);
    }
  }
});
