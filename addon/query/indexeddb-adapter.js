/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import FilterOperator from './filter-operator';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate } from './predicate';
import BaseAdapter from './base-adapter';
import { getAttributeFilterFunction, buildProjection, buildOrder, buildTopSkip, buildFilter } from './js-adapter';
import Information from '../utils/information';
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
      let table = _this._db.table(query.modelName);
      let complexQuery = containsRelationships(query);
      let projection = query.projectionName ? query.projectionName : query.projection ? query.projection : null;
      let extendedProjection = extendProjection(query);
      let fastQuery = !complexQuery;
      if (fastQuery) {
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
            Dexie.Promise.all(data.map(i => i.loadByProjection(projection, extendedProjection))).then(() => { // TODO: loadByProjection need rewrite.
              if (!projection) {
                let jsProjection = buildProjection(query); // TODO: if used select, then missed loadByProjection call.
                data = jsProjection(data);
              }

              let length = data.length;

              let response = { meta: {}, data: data };
              if (query.count) {
                if (!offset && !limit) {
                  response.meta.count = length;
                  resolve(response);
                } else {
                  let fullTable = updateWhereClause(store, _this._db.table(query.modelName), query);
                  fullTable.count().then((count) => {
                    response.meta.count = count;
                    resolve(response);
                  }, reject);
                }
              } else {
                resolve(response);
              }
            }, reject);
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
              let topskip = buildTopSkip(query);
              data = topskip(data);
            } else {
              if (query.count && (offset || limit)) {
                let fullTable = updateWhereClause(store, _this._db.table(query.modelName), query);
                countPromise = fullTable.count().then((count) => {
                  length = count;
                }, reject);
              }
            }

            let promises = data.map(i => i.loadByProjection(projection, extendedProjection));
            if (countPromise) {
              promises.push(countPromise);
            }

            Dexie.Promise.all(promises).then(() => {
              if (!projection) {
                let jsProjection = buildProjection(query); // TODO: if used select, then missed loadByProjection call.
                data = jsProjection(data);
              }

              let response = { meta: {}, data: data };
              if (query.count) {
                response.meta.count = length;
              }

              resolve(response);
            }, reject);
          }, reject);
        }
      } else if (true) {
        // TODO: remove if statement.

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

        let joinSortedDataArrays = function(data, masterFieldName, masterData, masterPrimaryKeyName, masterTypeName) {
          // Joining array `data` on field `masterField` with array `masterData` of objects `masterTypeName`. Array `data` must be ordered by `masterField`, array `masterData` must be ordered by id. Function do not use recursive calls.
          let masterIndex = 0;
          let dataLength = data.length;
          let masterDataLength = masterData.length;
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
                let error = new Error(`Data constraint error. Not found object type '${masterTypeName}' with id ${masterKey}.`);
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

        let joinHasManyData = function(data, detailFieldName, detailsData, detailsTypeName) {
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
                let error = new Error(`Data constraint error. Not found object type '${detailsTypeName}' with id ${detailKey}.`);
                reject(error);
                break;
              }

              detailsObjects.push(detailObj);
            }

            data[dataIndex][detailFieldName] = detailsObjects;
          }
        };

        /* Алгоритм.
        * 1. Строим структуру, которая будет описывать как мы обходим дерево.
        * 2. Читаем листья самого максимального уровня N с сортировкой по id, складываем результаты в массив массивов с доп. информацией: тип данных, как отсортированы, путь и уровень.
        * 3. Читаем ветки и листья уровня N-1, если это ещё не ствол.
        * 4. Если дошли до последних веток уровня 1, где 0 - это ствол, берём первую ветку и с сортировкой по соответствующему ей полю читаем ствол.
        * 5. Берём все ветки уровня 1 и пересортировывая ствол сливаем их со стволом.
        */

        // TODO: apply projection extending.

        let currentQueryTreeDeepLevel = 0;

        let queryTree = {
          modelName: query.modelName,
          primaryKeyName: query.primaryKeyName,
          select: query.select, // TODO: include extend props. Clone this object.
          data: null,
          sorting: null,
          deepLevel: 0,
          expand: null
        };

        // будем ходить по expand-ам и сливать с предыдущим уровнем те мастера, у которых нет своих экспандов. делать это надо в цикле, пока не доберёмся до ствола.
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
              if (!parent.expand) {
                parent.expand = {};
              }

              if (parent.expand[masterPropName]) {
                continue;
              }

              // TODO: если !relationship.options.async && isEmbedded(store, modelClass, name) то джойним. добавить для expand-а async и isEmbedded и сохранить в структурке relationship.
              // TODO: получить из query.
              let master = {
                propNameInParent: masterPropName,
                modelName: exp[masterPropName].modelName,
                primaryKeyName: exp[masterPropName].primaryKeyName,
                select: exp[masterPropName].select,
                data: null,
                sorting: null,
                deepLevel: masterDeepLevel,
                expand: null,
                parent: parent,
                relationType: exp[masterPropName].relationship.type
              };
              parent.expand[masterPropName] = master;
              buildJoinPlan(exp[masterPropName].expand, master, masterDeepLevel);
              if (masterDeepLevel > currentQueryTreeDeepLevel) {
                currentQueryTreeDeepLevel = masterDeepLevel;
              }
            }
          };

          if (query.expand) {
            buildJoinPlan(query.expand, queryTree, 0);
          }

          if (query.extend.expand) {
            buildJoinPlan(query.extend.expand, queryTree, 0);
          }
        }

        let table = _this._db.table(query.modelName);

        table.toArray().then((data) => {
          queryTree.data = data;

          // Найдём текущий уровень вложенности и смерджим его с parent.
          let scanDeepLevel = function(node, deepLevel) {
            return new Ember.RSVP.Promise((resolve, reject) => {
              if (node.deepLevel === deepLevel) {
                // Load and join data.
                let loadPromises = [];
                if (!node.data) {
                  // Load data.
                  let nodeTable = _this._db.table(node.modelName);
                  let loadPromise = nodeTable.toArray().then((data) => {
                    node.data = data;
                    node.sorting = node.primaryKeyName;
                  }, reject);
                  loadPromises.push(loadPromise);
                }

                if (!node.parent.data) {
                  // Load parent data.
                  let nodeTable = _this._db.table(node.parent.modelName);
                  let loadPromise = nodeTable.toArray().then((data) => {
                    node.parent.data = data;
                    node.parent.sorting = node.parent.primaryKeyName;
                  }, reject);
                  loadPromises.push(loadPromise);
                }

                Dexie.Promise.all(loadPromises).then(() => {
                  if (node.relationType === 'belongsTo') {
                    if (node.parent.sorting !== node.propNameInParent) {
                      sortData(node.parent.data, node.propNameInParent);
                      node.parent.sorting = node.propNameInParent;
                    }

                    if (node.sorting !== node.primaryKeyName) {
                      sortData(node.data, node.primaryKeyName);
                      node.sorting = node.primaryKeyName;
                    }

                    joinSortedDataArrays(node.parent.data, node.propNameInParent, node.data, node.primaryKeyName, node.modelName);

                  } else {
                    joinHasManyData(node.parent.data, node.propNameInParent,
                      getDetailsHashMap(node.data, node.primaryKeyName),
                      node.modelName);
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

                  resolve();
                }, reject);
              } else {
                if (node.expand) {
                  let masters = Object.keys(node.expand);
                  let mastersCount = masters.length;
                  let promises = null;
                  for (let i = 0; i < mastersCount; i++) {
                    if (!promises) {
                      promises = [];
                    }

                    let masterName = masters[i];
                    promises.push(scanDeepLevel(node.expand[masterName], deepLevel));
                  }

                  if (promises) {
                    Ember.RSVP.all(promises).then(() => resolve(), reject);
                  }
                } else {
                  resolve();
                }
              }
            });
          };

          let joinQueue = Queue.create();
          joinQueue.set('continueOnError', false);

          let attachScanDeepLevelToQueue = (i) => {
            joinQueue.attach((queryItemResolve, queryItemReject) => scanDeepLevel(queryTree, i).then(queryItemResolve, queryItemReject));
          };

          // Scan query tree from leafs to root.
          for (let i = currentQueryTreeDeepLevel; i > 0; i--) {
            attachScanDeepLevelToQueue(i);
          }

          joinQueue.attach((queueItemResolve) => {
            let filter = query.predicate ? buildFilter(query.predicate, { booleanAsString: true }) : (data) => data;

            let order = buildOrder(query);
            let topskip = buildTopSkip(query);

            queryTree.data = filter(queryTree.data);
            let length = queryTree.data.length;
            queryTree.data = topskip(order(queryTree.data));

            let jsProjection = buildProjection(query);
            queryTree.data = jsProjection(queryTree.data);

            let response = { meta: {}, data: queryTree.data };
            if (query.count) {
              response.meta.count = length;
            }

            resolve(response);
            queueItemResolve();
          });
        }, reject);
      } else {
        let isBadQuery = complexQuery;
        let order = buildOrder(query);
        let topskip = buildTopSkip(query);
        let jsProjection = buildProjection(query); // TODO: if used select, then missed loadByProjection call.
        let table = this._db.table(query.modelName);
        let moment = Ember.getOwner(store).lookup('service:moment');
        let filter = query.predicate ? buildFilter(moment, query.predicate, { booleanAsString: true }) : (data) => data;
        let projection = query.projectionName ? query.projectionName : query.projection ? query.projection : null;

        Ember.warn('The next version is planned to change the behavior ' +
          'of loading data from offline store, without specify attributes ' +
          'and relationships will be loaded only their own object attributes.', projection, { id: 'IndexedDBAdapter.query' });

        (isBadQuery ? table : updateWhereClause(store, table, query)).toArray().then((data) => {
          let length = data.length;
          if (!isBadQuery) {
            data = topskip(order(data));
          }

          // TODO: loadByProjection call with query, projection already was processed into select and expand.
          // Builder.build will process extending Projection.
          Dexie.Promise.all(data.map(i => i.loadByProjection(projection, extendedProjection))).then(() => {
            if (isBadQuery) {
              data = filter(data);
              length = data.length;
              data = topskip(order(data));
            }

            if (!projection) {
              data = jsProjection(data);
            }

            let response = { meta: {}, data: data };
            if (query.count) {
              response.meta.count = length;
            }

            resolve(response);
          }, reject);
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

  if (!predicate) {
    return table;
  }

  if (predicate instanceof SimplePredicate) {
    let information = new Information(store);
    let attrType = information.getType(query.modelName, predicate.attributePath);
    let value;
    switch (attrType) {
      case 'boolean':
        value = typeof predicate.value === 'boolean' ? `${predicate.value}` : predicate.value;
        break;

      case 'date':
        let dateTransform = Ember.getOwner(store).lookup('transform:date');
        let moment = Ember.getOwner(store).lookup('service:moment');
        let valueToTransform = moment.moment(predicate.value);
        Ember.assert('Date value must be passed to query as JavaScript Date (instance or string) or as ISO 8601 string', valueToTransform.isValid());
        value = dateTransform.serialize(valueToTransform.toDate());
        break;

      default:
        value = predicate.value;
    }

    if (value === null) {
      // IndexedDB (and Dexie) doesn't support null - use JS filter instead.
      // https://github.com/dfahlander/Dexie.js/issues/153
      let moment = Ember.getOwner(store).lookup('service:moment');
      return table.filter(getAttributeFilterFunction(moment, predicate));
    }

    switch (predicate.operator) {
      case FilterOperator.Eq:
        return table.where(predicate.attributePath).equals(value);

      case FilterOperator.Neq:
        return table.where(predicate.attributePath).notEqual(value);

      case FilterOperator.Le:
        return table.where(predicate.attributePath).below(value);

      case FilterOperator.Leq:
        return table.where(predicate.attributePath).belowOrEqual(value);

      case FilterOperator.Ge:
        return table.where(predicate.attributePath).above(value);

      case FilterOperator.Geq:
        return table.where(predicate.attributePath).aboveOrEqual(value);

      default:
        throw new Error('Unknown operator');
    }
  }

  if (predicate instanceof StringPredicate || predicate instanceof ComplexPredicate) {
    let moment = Ember.getOwner(store).lookup('service:moment');
    return table.filter(getAttributeFilterFunction(moment, predicate, { booleanAsString: true }));
  }

  throw new Error(`Unsupported predicate '${predicate}'`);
}

/**
  Returns object with attributes that necessary include in projection for loading.

  @method extendProjection
  @param {QueryObject} query
  @return {Object}
*/
function extendProjection(query) {
  let extend = {};
  if (query.predicate instanceof SimplePredicate || query.predicate instanceof StringPredicate) {
    let path = '';
    Information.parseAttributePath(query.predicate.attributePath).forEach((attribute) => {
      Ember.set(extend, `${path}${attribute}`, {});
      path += `${attribute}.`;
    });
  }

  if (query.predicate instanceof DetailPredicate) {
    extend[query.predicate.detailPath] = extendProjection(query.predicate);
  }

  if (query.predicate instanceof ComplexPredicate) {
    query.predicate.predicates.forEach((predicate) => {
      Ember.merge(extend, extendProjection({ predicate }));
    });
  }

  if (query.order) {
    for (let i = 0; i < query.order.length; i++) {
      let path = '';
      let attributePath = Information.parseAttributePath(query.order.attribute(i).name);
      for (let i = 0; i < attributePath.length; i++) {
        Ember.set(extend, `${path}${attributePath[i]}`, {});
        path += `${attributePath[i]}.`;
      }
    }
  }

  return extend;
}

/**
  Checks query on contains restrictions by relationships.

  @method containsRelationships
  @param {QueryObject} query
  @return {Boolean}
*/
function containsRelationships(query) {
  let contains = false;
  if (query.predicate instanceof SimplePredicate || query.predicate instanceof StringPredicate) {
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
