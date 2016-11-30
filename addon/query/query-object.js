/**
 * Object that passes as query parameter to [DS.Store](http://emberjs.com/api/data/classes/DS.Store.html) methods for reading data.
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class QueryObject
 */
export default class QueryObject {

  /**
   * @param modelName {String} The model name of the requested entities.
   * @param id {String|Number} The id of the requested entity.
   * @param projectionName {String} The name of used projection for reading the requested entities.
   * @param predicate {BasePredicate} The predicate that contains filtering conditions for requested entities.
   * @param order {OrderByClause} Ordering conditions for requested entities.
   * @param top {Number} The number of items in the queried collection to be included in the result.
   * @param skip {Number} The number of items in the queried collection that are to be skipped and not included in the result.
   * @param count {Boolean} Flag indicates to request a count of the matching entities included with the entities in the response.
   * @param expand {Object} Specifies the related entities to be included in line with retrieved entities.
   * @param select {Object} A specific set of properties for each requested entity.
   * @param primaryKeyName {Object} The name of primary key field for specified model name in modelName property.
   * @param extend {Object} A additional computed set of properties for each requested entity. Based on properties in predicate and order, but not included in select and expand.
   * @class QueryObject
   * @constructor
   */
  constructor(modelName, id, projectionName, predicate, order, top, skip, count, expand, select, primaryKeyName, extend) {
    this.id = id;
    this.modelName = modelName;
    this.projectionName = projectionName;
    this.predicate = predicate;
    this.order = order;
    this.top = top;
    this.skip = skip;
    this.count = count;
    this.expand = expand;
    this.select = select;
    this.primaryKeyName = primaryKeyName;
    this.extend = extend;
  }
}
