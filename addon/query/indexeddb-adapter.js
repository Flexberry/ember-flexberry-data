/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import FilterOperator from './filter-operator';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, GeographyPredicate, GeometryPredicate } from './predicate';
import BaseAdapter from './base-adapter';
import JSAdapter from 'ember-flexberry-data/query/js-adapter';
import Information from '../utils/information';
import getSerializedDateValue from '../utils/get-serialized-date-value';
import Dexie from 'npm:dexie';
import Queue from '../utils/queue';

/**
  Class of query language adapter that allows to load data from IndexedDB.

  @namespace Query
  @class IndexedDBAdapter
  @extends Query.BaseAdapter
*/
export default class extends BaseAdapter {
  /**
    @param {Dexie} db Dexie database instance.
    @class IndexedDBAdapter
    @constructor
  */
  constructor(db) {
    super();

    if (!db) {
      throw new Error('Database must be.');
    }

    this._db = db;
  }

  /**
    Loads data from IndexedDB.

    @method query
    @param {DS.Store or subclass} store Store instance to the adapter.
    @param {QueryObject} query QueryObject instance to the adapter.
    @return {Promise} Promise with loaded data.
  */
  query(store, query) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let _this = this;
      let jsAdapter;
      let datePredicates = [];
      if (query.predicate instanceof ComplexPredicate) {
        datePredicates = query.predicate.predicates.filter(predicate => predicate instanceof DatePredicate);
      }

      if (query.predicate instanceof DatePredicate || datePredicates.length > 0) {
        let moment = Ember.getOwner(store).lookup('service:moment');
        jsAdapter = new JSAdapter(moment);
      } else {
        jsAdapter = new JSAdapter();
      }

      let table = _this._db.table(query.modelName);
      let complexQuery = containsRelationships(query);

      let sortData = function(data, sortField) {
        // Sorting array by `sortField` and asc.
        let singleSort = function(a, b) {
          let aVal = a[sortField];
          let bVal = b[sortField];
          return (!aVal && bVal) || (aVal < bVal) ? -1 : (aVal && !bVal) || (aVal > bVal) ? 1 : 0;
        };

        data.sort(singleSort);
      };

      let getDetailsHashMap = function(data, primaryKeyName) {
        let ret = Ember.Map.create();
        let dataLength = data.length;
        for (let i = 0; i < dataLength; i++) {
          let obj = data[i];
          let key = obj[primaryKeyName];
          ret.set(key, obj);
        }

        return ret;
      };

      let joinSortedDataArrays = function(data, masterFieldName, masterData, masterPrimaryKeyName, masterTypeName, dataTypeName) {
        // Joining array `data` on field `masterField` with array `masterData` of objects `masterTypeName`. Array `data` must be ordered by `masterField`, array `masterData` must be ordered by id. Function do not use recursive calls.
        let masterIndex = 0;
        let dataLength = data.length;
        let masterDataLength;
        if (!masterData) {
          // TODO: May be return?
          masterDataLength = 0;
        } else {
          masterDataLength = masterData.length;
        }

        for (let dataIndex = 0; dataIndex < dataLength; dataIndex++) {
          let masterKey = data[dataIndex][masterFieldName];
          if (!masterKey) {
            continue;
          }

          let moveMastersForvard = true;
          while (moveMastersForvard) {
            let masterDataValue = masterData[masterIndex];

            // TODO: Check if Debug Mode build then use this.
            if (!masterDataValue || !masterDataValue.hasOwnProperty(masterPrimaryKeyName)) {
              let error = new Error(`Metadata consistance error. ` +
              `Not found property '${masterPrimaryKeyName}' in type '${masterTypeName}'.`);
              reject(error);
              break;
            }

            if (masterKey > masterDataValue[masterPrimaryKeyName] && masterIndex < masterDataLength) {
              masterIndex++;
            } else if (masterKey < masterDataValue[masterPrimaryKeyName] || masterIndex >= masterDataLength) {
              let objectId = data[dataIndex].id;
              let error = new Error(`Data constraint error. Not found object type '${masterTypeName}' with id ${masterKey}. ` +
              `It used in object of type '${dataTypeName}' with id '${objectId}'`);
              reject(error);
              break;
            }

            if (masterKey === masterDataValue[masterPrimaryKeyName]) {
              data[dataIndex][masterFieldName] = masterDataValue;
              moveMastersForvard = false;
              continue;
            }
          }
        }
      };

      let joinHasManyData = function(data, detailFieldName, detailsData, detailsTypeName, dataTypeName) {
        // Joining array `data` on field `masterField` with hash map `detailsData` of objects `detailsTypeName`. Function do not use recursive calls.
        let dataLength = data.length;
        for (let dataIndex = 0; dataIndex < dataLength; dataIndex++) {
          let detailsKeys = data[dataIndex][detailFieldName];
          if (!detailsKeys) {
            continue;
          }

          let detailsKeysLength = detailsKeys.length;
          let detailsObjects = [];
          for (let i = 0; i < detailsKeysLength; i++) {
            let detailKey = detailsKeys[i];
            let detailObj = detailsData.get(detailKey);

            if (!detailObj) {
              let objectId = data[dataIndex].id;
              let error = new Error(`Data constraint error. Not found object type '${detailsTypeName}' with id ${detailKey}. ` +
              `It used in object of type '${dataTypeName}' with id '${objectId}'`);
              reject(error);
              break;
            }

            detailsObjects.push(detailObj);
          }

          data[dataIndex][detailFieldName] = detailsObjects;
        }
      };

      let buildJoinTree = function(joinTree) {
        let currentQueryTreeDeepLevel = 0;

        if (!complexQuery && (!query.expand || Object.keys(query.expand).length === 0) && query.select.length === 1 && query.select[0] === 'id') {
          return currentQueryTreeDeepLevel;
        }

        if (query.expand || query.extend) {
          let buildJoinPlan = function(exp, parent, deepLevel) {
            if (!exp) {
              return;
            }

            let masterPropNames = Object.keys(exp);
            let length = masterPropNames.length;
            let masterDeepLevel = deepLevel + 1;
            for (let i = 0; i < length; i++) {
              let masterPropName = masterPropNames[i];

              // Performing joining only if relationship is not async and embedded.
              if (exp[masterPropName].relationship.async || !exp[masterPropName].relationship.isEmbedded) {
                continue;
              }

              if (!parent.expand) {
                parent.expand = {};
              }

              if (!parent.expand[masterPropName]) {
                parent.expand[masterPropName] = {
                  propNameInParent: masterPropName,
                  modelName: exp[masterPropName].modelName,
                  primaryKeyName: exp[masterPropName].primaryKeyName,
                  data: null,
                  sorting: null,
                  deepLevel: masterDeepLevel,
                  expand: null,
                  parent: parent,
                  relationType: exp[masterPropName].relationship.type
                };
              }

              buildJoinPlan(exp[masterPropName].expand, parent.expand[masterPropName], masterDeepLevel);
              if (masterDeepLevel > currentQueryTreeDeepLevel) {
                currentQueryTreeDeepLevel = masterDeepLevel;
              }
            }
          };

          if (query.expand) {
            buildJoinPlan(query.expand, joinTree, 0);
          }

          if (query.extend.expand) {
            buildJoinPlan(query.extend.expand, joinTree, 0);
          }
        }

        return currentQueryTreeDeepLevel;
      };

      let joinTree = {
        modelName: query.modelName,
        primaryKeyName: query.primaryKeyName,
        data: null,
        sorting: null,
        deepLevel: 0,
        expand: null
      };

      let currentQueryTreeDeepLevel = buildJoinTree(joinTree);

      let joinDataByJoinTree = function(joinTree, applyFilter, applyOrder, applyTopSkip, applyProjection, count) {

        // Sort data and merge join data level by level.
        let scanDeepLevel = function(node, deepLevel) {
          return new Ember.RSVP.Promise((resolve, reject) => {
            if (node.deepLevel === deepLevel) {
              let processData = () => {
                if (node.relationType === 'belongsTo') {
                  if (node.parent.sorting !== node.propNameInParent) {
                    sortData(node.parent.data, node.propNameInParent);
                    node.parent.sorting = node.propNameInParent;
                  }

                  if (node.sorting !== node.primaryKeyName) {
                    sortData(node.data, node.primaryKeyName);
                    node.sorting = node.primaryKeyName;
                  }

                  joinSortedDataArrays(node.parent.data, node.propNameInParent, node.data, node.primaryKeyName, node.modelName, node.parent.modelName);

                } else {
                  joinHasManyData(node.parent.data, node.propNameInParent,
                    getDetailsHashMap(node.data, node.primaryKeyName),
                    node.modelName, node.parent.modelName);
                }

                // Remove node from parent.expand.
                let masters = Object.keys(node.parent.expand);
                let mastersCount = masters.length;
                let masterName;
                let masterFound = false;
                for (let i = 0; i < mastersCount; i++) {
                  masterName = masters[i];
                  if (node.parent.expand[masterName].propNameInParent === node.propNameInParent) {
                    masterFound = true;
                    break;
                  }
                }

                if (masterFound) {
                  delete node.parent.expand[masterName];
                }
              };

              // Load and join data.
              let loadPromises = [];

              // If parent data is one record and relationship is belongsTo then apply filter by master id from parent data.
              let filterById;

              if (!node.parent.data) {
                // Load parent data.
                let nodeTable = _this._db.table(node.parent.modelName);
                let loadPromise = new Ember.RSVP.Promise((loadResolve, loadReject) => {
                  nodeTable.toArray().then((data) => {
                    node.parent.data = data;
                    node.parent.sorting = node.parent.primaryKeyName;
                    loadResolve();
                  }, loadReject);});
                loadPromises.push(loadPromise);
              } else if (node.parent.data.length === 1 && node.relationType === 'belongsTo') {
                filterById = node.parent.data[0][node.propNameInParent];
              }

              if (!node.data) {
                // Load data.
                let nodeTable = _this._db.table(node.modelName);
                if (filterById) {
                  nodeTable = nodeTable.where(node.primaryKeyName).equals(filterById);
                }

                let loadPromise = new Ember.RSVP.Promise((loadResolve, loadReject) => {nodeTable.toArray().then((data) => {
                  node.data = data;
                  node.sorting = node.primaryKeyName;
                  loadResolve();
                }, loadReject);});
                loadPromises.push(loadPromise);
              }

              Ember.RSVP.all(loadPromises).then(() => {
                processData();
                resolve();
              }, reject);

            } else {
              if (node.expand) {
                let joinRelationsQueue = Queue.create();
                joinRelationsQueue.set('continueOnError', false);

                let masters = Object.keys(node.expand);
                let mastersCount = masters.length;
                let attachScanDeepLevelToRelationsQueue = (masterName) => {
                  joinRelationsQueue.attach((queryItemResolve, queryItemReject) => {
                    // load data for optimal performance.
                    let expandedMaster = node.expand[masterName];
                    let loadPromise;
                    let skipScan = false;
                    if (node.data && !expandedMaster.data) {
                      let nodeDataLength = node.data.length;
                      if (nodeDataLength === 0) {
                        skipScan = true;
                      } else if (nodeDataLength <= 50) { // Magical constant which depend on list form max rows.
                        let anyOfKeys = [];

                        for (let i = 0; i < nodeDataLength; i++) {
                          let relationKeyValue = node.data[i][masterName];

                          if (relationKeyValue) {
                            if (expandedMaster.relationType === 'belongsTo') {
                              anyOfKeys.push(relationKeyValue);
                            } else {
                              anyOfKeys = anyOfKeys.concat(relationKeyValue);
                            }
                          }
                        }

                        if (anyOfKeys.length === 0) {
                          skipScan = true;
                        } else {
                          loadPromise = new Ember.RSVP.Promise((loadResolve, loadReject) => {
                            _this._db.table(expandedMaster.modelName)
                            .where(expandedMaster.primaryKeyName)
                            .anyOf(anyOfKeys)
                            .toArray()
                            .then((loadedData) => {
                              expandedMaster.data = loadedData;
                              expandedMaster.sorting = expandedMaster.primaryKeyName;
                              loadResolve();
                            }, loadReject);
                          });
                        }
                      }
                    }

                    Ember.RSVP.all([loadPromise]).then(() => {
                      if (!skipScan) {
                        scanDeepLevel(expandedMaster, deepLevel).then(queryItemResolve, queryItemReject);
                      } else {
                        queryItemResolve();
                      }
                    });
                  });
                };

                for (let i = 0; i < mastersCount; i++) {
                  let masterName = masters[i];
                  attachScanDeepLevelToRelationsQueue(masterName);
                }

                joinRelationsQueue.attach((queueItemResolve) => {
                  resolve();
                  queueItemResolve();
                });
              } else {
                resolve();
              }
            }
          });
        };

        let joinQueue = Queue.create();
        joinQueue.set('continueOnError', false);

        let attachScanDeepLevelToQueue = (i) => {
          joinQueue.attach((queryItemResolve, queryItemReject) => scanDeepLevel(joinTree, i).then(queryItemResolve, queryItemReject));
        };

        // Scan query tree from leafs to root.
        for (let i = currentQueryTreeDeepLevel; i > 0; i--) {
          attachScanDeepLevelToQueue(i);
        }

        joinQueue.attach((queueItemResolve) => {
          let applyFilterOrderTopSkipProjection = function(data, applyFilter, applyOrder, applyTopSkip, applyProjection, count) {
            if (applyFilter) {
              let filter = query.predicate ? jsAdapter.buildFilter(query.predicate, { booleanAsString: true }) : (dataForFilter) => dataForFilter;
              data = filter(data);
            }

            if (applyOrder) {
              let order = jsAdapter.buildOrder(query);
              data = order(data);
            }

            let length = count ? count : data.length;

            if (applyTopSkip) {
              let topskip = jsAdapter.buildTopSkip(query);
              data = topskip(data);
            }

            if (applyProjection) {
              let jsProjection = jsAdapter.buildProjection(query);
              data = jsProjection(data);
            }

            let response = { meta: {}, data: data };
            if (query.count) {
              response.meta.count = length;
            }

            resolve(response);
          };

          applyFilterOrderTopSkipProjection(joinTree.data, applyFilter, applyOrder, applyTopSkip, applyProjection, count);
          queueItemResolve();
        });
      };

      if (!complexQuery) {
        let offset = query.skip;
        let limit = query.top;

        table = updateWhereClause(store, table, query);

        if (table instanceof _this._db.Table && !query.order) {
          // Go this way if filter is empty and no sorting.
          if (offset) {
            table = table.offset(offset);
          }

          if (limit) {
            table = table.limit(limit);
          }

          table.toArray().then((data) => {
            let length = data.length;
            let countPromise;

            if (query.count && (offset || limit)) {
              let fullTable = updateWhereClause(store, _this._db.table(query.modelName), query);
              countPromise = fullTable.count().then((count) => {
                length = count;
              }, reject);
            }

            let promises;
            if (countPromise) {
              promises = [countPromise];
            }

            Dexie.Promise.all(promises).then(() => {
              joinTree.data = data;
              joinDataByJoinTree(joinTree, false, false, false, true, length);
            });
          }, reject);
        } else {
          // Go this way if used simple filter.
          if (table instanceof this._db.Table) {
            table = table.toCollection();
          }

          let skipTopApplyed = false;

          if (query.order) {
            let sortFunc = function(a) {
                let len = query.order.length;

                let singleSort = function(a, b, i) {
                  if (i === undefined) {
                    i = 0;
                  }

                  if (i >= len) {
                    return 0;
                  }

                  let attrName = query.order.attribute(i).name;
                  let direction = query.order.attribute(i).direction;
                  i = i + 1;

                  let aVal = a[attrName];
                  let bVal = b[attrName];
                  if (!direction || direction === 'asc') {
                    return (!aVal && bVal) || (aVal < bVal) ? -1 : (aVal && !bVal) || (aVal > bVal) ? 1 : singleSort(a, b, i);
                  } else {
                    return (aVal && !bVal) || (aVal > bVal) ? -1 : (!aVal && bVal) || (aVal < bVal) ? 1 : singleSort(a, b, i);
                  }
                };

                return a.sort(singleSort);
              };

            table = table.toArray(sortFunc);
          } else {
            if (offset) {
              table = table.offset(offset);
            }

            if (limit) {
              table = table.limit(limit);
            }

            skipTopApplyed = true;
            table = table.toArray();
          }

          table.then(data => {
            let length = data.length;
            let countPromise;

            // if this is result of sortBy() Promise need apply top-skip.
            if (!skipTopApplyed) {
              let topskip = jsAdapter.buildTopSkip(query);
              data = topskip(data);
            } else {
              if (query.count && (offset || limit)) {
                let fullTable = updateWhereClause(store, _this._db.table(query.modelName), query);
                countPromise = fullTable.count().then((count) => {
                  length = count;
                }, reject);
              }
            }

            let promises;
            if (countPromise) {
              promises = [countPromise];
            }

            Dexie.Promise.all(promises).then(() => {
              joinTree.data = data;
              joinDataByJoinTree(joinTree, false, true, false, true, length);
            }, reject);
          }, reject);
        }
      } else {
        table.toArray().then((data) => {
          joinTree.data = data;
          joinDataByJoinTree(joinTree, true, true, true, true);
        }, reject);
      }
    });
  }
}

/**
  Builds Dexie `WhereClause` for filtering data.
  Filtering only with Dexie can applied only for simple cases (for `SimplePredicate`).
  For complex cases all logic implemened programmatically.

  @param {DS.Store or subclass} store Store instance.
  @param {Dexie.Table} table Table instance for loading objects.
  @param {Query} query Query language instance for loading data.
  @returns {Dexie.Collection|Dexie.Table} Table or collection that can be used with `toArray` method.
*/
function updateWhereClause(store, table, query) {
  let predicate = query.predicate;

  if (query.id) {
    if (!predicate) {
      predicate = new SimplePredicate('id', FilterOperator.Eq, query.id);
    } else {
      predicate = predicate.and(new SimplePredicate('id', FilterOperator.Eq, query.id));
    }
  }

  if (predicate instanceof GeographyPredicate) {
    Ember.warn('GeographyPredicate is not supported in indexedDB-adapter');
    return table;
  }

  if (predicate instanceof GeometryPredicate) {
    Ember.warn('GeometryPredicate is not supported in indexedDB-adapter');
    return table;
  }

  if (!predicate) {
    return table;
  }

  if (predicate instanceof SimplePredicate || predicate instanceof DatePredicate) {
    let information = new Information(store);
    let attrType = information.getType(query.modelName, predicate.attributePath);
    let value;
    switch (attrType) {
      case 'boolean':
        value = typeof predicate.value === 'boolean' ? `${predicate.value}` : predicate.value;
        break;

      case 'date':
        value = getSerializedDateValue.call(store, predicate.value, predicate.timeless);
        break;

      default:
        value = predicate.value;
    }

    if (value === null) {
      // IndexedDB (and Dexie) doesn't support null - use JS filter instead.
      // https://github.com/dfahlander/Dexie.js/issues/153
      let jsAdapter = predicate instanceof DatePredicate ? new JSAdapter(Ember.getOwner(store).lookup('service:moment')) : new JSAdapter();

      return table.filter(jsAdapter.getAttributeFilterFunction(predicate));
    }

    let moment;
    let nextValue;
    if (predicate.timeless) {
      moment = Ember.getOwner(store).lookup('service:moment');
      nextValue = moment.moment(value, 'YYYY-MM-DD').add(1, 'd').format('YYYY-MM-DD');
    }

    switch (predicate.operator) {
      case FilterOperator.Eq:
        return predicate.timeless ?
          table.where(predicate.attributePath).between(value, nextValue, false) :
          table.where(predicate.attributePath).equals(value);

      case FilterOperator.Neq:
        return predicate.timeless ?
          table.where(predicate.attributePath).below(value).or(predicate.attributePath).aboveOrEqual(nextValue) :
          table.where(predicate.attributePath).notEqual(value);

      case FilterOperator.Le:
        return table.where(predicate.attributePath).below(value);

      case FilterOperator.Leq:
        return predicate.timeless ?
          table.where(predicate.attributePath).below(nextValue) :
          table.where(predicate.attributePath).belowOrEqual(value);

      case FilterOperator.Ge:
        return predicate.timeless ?
          table.where(predicate.attributePath).aboveOrEqual(nextValue) :
          table.where(predicate.attributePath).above(value);

      case FilterOperator.Geq:
        return table.where(predicate.attributePath).aboveOrEqual(value);

      default:
        throw new Error('Unknown operator');
    }
  }

  if (predicate instanceof StringPredicate) {
    let jsAdapter = new JSAdapter();
    return table.filter(jsAdapter.getAttributeFilterFunction(predicate, { booleanAsString: true }));
  }

  if (predicate instanceof ComplexPredicate) {
    let datePredicates = predicate.predicates.filter(pred => pred instanceof DatePredicate);
    let jsAdapter = datePredicates.length > 0 ? new JSAdapter(Ember.getOwner(store).lookup('service:moment')) : new JSAdapter();

    return table.filter(jsAdapter.getAttributeFilterFunction(predicate, { booleanAsString: true }));
  }

  throw new Error(`Unsupported predicate '${predicate}'`);
}

/**
  Checks query on contains restrictions by relationships.

  @method containsRelationships
  @param {QueryObject} query
  @return {Boolean}
*/
function containsRelationships(query) {
  let contains = false;
  if (query.predicate instanceof SimplePredicate || query.predicate instanceof StringPredicate || query.predicate instanceof DatePredicate) {
    contains = Information.parseAttributePath(query.predicate.attributePath).length > 1;
  }

  if (query.predicate instanceof DetailPredicate) {
    return true;
  }

  if (query.predicate instanceof ComplexPredicate) {
    query.predicate.predicates.forEach((predicate) => {
      if (containsRelationships({ predicate })) {
        contains = true;
      }
    });
  }

  if (query.order) {
    for (let i = 0; i < query.order.length; i++) {
      let attributePath = query.order.attribute(i).name;
      if (Information.parseAttributePath(attributePath).length > 1) {
        contains = true;
      }
    }
  }

  return contains;
}
