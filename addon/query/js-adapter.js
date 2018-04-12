import { isNone } from '@ember/utils';
import { warn } from '@ember/debug';
import BaseAdapter from './base-adapter';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, GeographyPredicate } from './predicate';
import FilterOperator from './filter-operator';
import Condition from './condition';
import Information from '../utils/information';

/**
 * Class of query language adapter that translates query object into JS function which
 * filters native JS array of objects by specified logic.
 *
 * ```js
 * const data = [
 *   { Name: 'A', Surname: 'X', Age: 10 },
 *   { Name: 'B', Surname: 'Y', Age: 11 },
 *   { Name: 'B', Surname: 'Z', Age: 12 }
 * ];
 *
 * let adapter = new JSAdapter(moment);
 * let builder = new QueryBuilder(store, 'AnyUnknownModel').where('Name', FilterOperator.Eq, 'B');
 * let filter = adapter.buildFunc(builder.build());
 *
 * let result = filter(data); // Y and Z
 * ```
 *
 * All filters uses short circuit logic ([wiki](https://en.wikipedia.org/wiki/Short-circuit_evaluation)).
 *
 * @module ember-flexberry-data
 * @class JsAdapter
 * @extends Query.BaseAdapter
 */
export default class JSAdapter extends BaseAdapter {
  /**
    @param {Moment} moment Moment service.
    @class IndexedDBAdapter
    @constructor
  */
  constructor(moment) {
    super();

    if (moment) {
      this._moment = moment;
    }
  }

  /**
   * Builds JS function for filtering JS array of objects by specified logic from query.
   *
   * @method buildFunc
   * @param query Query language instance.
   * @returns {Function} Function for filtering JS array of objects.
   */
  buildFunc(query) {
    let filter = query.predicate ? this.buildFilter(query.predicate) : (data) => data;
    let order = this.buildOrder(query);
    let projection = this.buildProjection(query);
    let topSkip = this.buildTopSkip(query);
    return function (data) {
      return projection(topSkip(order(filter(data))));
    };
  }

  /**
   * Builds function for windowing array of objects using data from the query.
   *
   * @param {QueryObject} query Query instance.
   * @returns {Function}
   */
  buildTopSkip(query) {
    if (!query.top && !query.skip) {
      return data => data;
    }

    return data => {
      let r = [];
      for (let i = 0; i < data.length; i++) {
        if (i < query.skip) {
          continue;
        }

        r.push(data[i]);

        if (r.length >= query.top) {
          break;
        }
      }

      return r;
    };
  }

  /**
   * Builds function for ordering array of objects using data from the query.
   *
   * @param {QueryObject} query Query instance.
   * @returns {Function}
   */
  buildOrder(query) {
    if (!query.order) {
      return data => data;
    }

    let desc = (a, b, p) => {
      let av = this.getValue(a, p);
      let bv = this.getValue(b, p);
      if (av > bv) {
        return -1;
      } else if (av < bv) {
        return 1;
      } else {
        return 0;
      }
    };

    let asc = (a, b, p) => {
      let av = this.getValue(a, p);
      let bv = this.getValue(b, p);
      if (av < bv) {
        return -1;
      } else if (av > bv) {
        return 1;
      } else {
        return 0;
      }
    };

    return function (data) {
      return data.sort((a, b) => {
        for (let i = 0; i < query.order.length; i++) {
          let p = query.order.attribute(i);
          let r = p.direction === 'desc' ? desc(a, b, p.name) : asc(a, b, p.name); // TODO: desc / asc constants
          if (r === 0) {
            continue;
          }

          return r;
        }

        return 0;
      });
    };
  }

  /**
   * Builds function for selecting subset of properties from array of objects using data from the query.
   *
   * @param {QueryObject} query Query instance.
   * @returns {Function}
   */
  buildProjection(query) {
    let select = query.select;
    let expand = query.expand;
    let expandKeys = Object.keys(expand);
    if (!select || select.length === 0) {
      return data => data;
    }

    return function (data) {
      let dataMap = data.map(item => {
        let r = {};

        let applySelect = function (r, item, select, exclude) {
          if (!item) {
            return;
          }

          let length = select.length;
          for (let i = 0; i < length; i++) {
            let key = select[i];
            if (exclude.indexOf(key) === -1) {
              r[key] = item[key];
            }
          }
        };

        applySelect(r, item, select, expandKeys);

        let processExpand = function(r, item, expand, expandKeys) {
          if (!expand) {
            return;
          }

          let length = expandKeys.length;
          for (let i = 0; i < length; i++) {
            let expandKey = expandKeys[i];

            let expandItem = expand[expandKey];
            let expandItemSelect = expandItem.select;
            let expandItemExpand = expandItem.expand;
            let expandItemExpandKeys = Object.keys(expandItemExpand);

            if (expandItem.relationship.type === 'belongsTo') {
              let itemValue = item[expandKey];
              if (itemValue) {
                // Try to include attr that stores type of relationship for polymorphic master in offline mode.
                // It makes sense only when buildProjection was called from indexeddb-adapter.
                // Otherwise given object always will not contain attr with polymorphic relationship type name.
                if (expandItem.relationship.polymorphic) {
                  let polymorphicMasterTypeKey = '_' + expandKey + '_type';
                  if (item.hasOwnProperty(polymorphicMasterTypeKey)) {
                    r[polymorphicMasterTypeKey] = item[polymorphicMasterTypeKey];
                  }
                }

                r[expandKey] = {};
                applySelect(r[expandKey], itemValue, expandItemSelect, expandItemExpandKeys);
                processExpand(r[expandKey], itemValue, expandItemExpand, expandItemExpandKeys);
              } else {
                r[expandKey] = null;
              }
            } else {
              r[expandKey] = [];
              let detailsCount = isNone(item[expandKey]) ? 0 : item[expandKey].length;
              for (let j = 0; j < detailsCount; j++) {
                let itemValue = item[expandKey][j];
                if (itemValue) {
                  r[expandKey].push({});
                  applySelect(r[expandKey][j], itemValue, expandItemSelect, expandItemExpandKeys);
                  processExpand(r[expandKey][j], itemValue, expandItemExpand, expandItemExpandKeys);
                }
              }
            }
          }
        };

        processExpand(r, item, expand, expandKeys);
        return r;
      });
      return dataMap;
    };
  }

  /**
    Builds function for filtering array of objects using predicate.

    @param {Query.BasePredicate} predicate Predicate for filtering array of objects.
    @param {Object} [options] Object with options for transfer `getAttributeFilterFunction` function.
    @return {Function}
  */
  buildFilter(predicate, options) {
    let b1 = predicate instanceof SimplePredicate;
    let b2 = predicate instanceof StringPredicate;
    let b3 = predicate instanceof DetailPredicate;
    let b4 = predicate instanceof DatePredicate;
    let b5 = predicate instanceof GeographyPredicate;

    if (b1 || b2 || b3 || b4) {
      let filterFunction = this.getAttributeFilterFunction(predicate, options);
      return this.getFilterFunctionAnd([filterFunction]);
    }

    if (b5) {
      warn('GeographyPredicate is not supported in js-adapter',
      false,
      { id: 'ember-flexberry-data-debug.js-adapter.geography-predicate-is-not-supported' });
      return function (data) {
        return data;
      };
    }

    if (predicate instanceof ComplexPredicate) {
      let filterFunctions = predicate.predicates.map(predicate => this.getAttributeFilterFunction(predicate, options));
      switch (predicate.condition) {
        case Condition.And:
          return this.getFilterFunctionAnd(filterFunctions);

        case Condition.Or:
          return this.getFilterFunctionOr(filterFunctions);

        default:
          throw new Error(`Unsupported condition '${predicate.condition}'.`);
      }
    }

    throw new Error(`Unsupported predicate '${predicate}'`);
  }

  /**
    Returns function for checkign single object using predicate.

    @param {Query.BasePredicate} predicate Predicate for an attribute.
    @param {Object} [options] Object with options.
    @param {Object} [options.booleanAsString] If this option set as `true` and type of `predicate.value` equals boolean, convert value to string.
    @returns {Function} Function for checkign single object.
  */
  getAttributeFilterFunction(predicate, options) {
    let _this = this;
    if (!predicate) {
      return (i) => i;
    }

    if (predicate instanceof SimplePredicate || predicate instanceof DatePredicate) {
      let value = predicate.value;
      if (options && options.booleanAsString && typeof value === 'boolean') {
        value = `${value}`;
      }

      return (i) => {
        let datesIsValid = false;
        let valueFromHash = _this.getValue(i, predicate.attributePath);
        let momentFromHash;
        if (predicate instanceof DatePredicate) {
          if (predicate.timeless) {
            valueFromHash = _this._moment.moment(valueFromHash, 'YYYY-MM-DD').format();
          }

          momentFromHash = _this._moment.moment(valueFromHash);
          let momentFromValue = _this._moment.moment(value);
          datesIsValid = momentFromHash.isValid() && momentFromValue.isValid();
        }

        switch (predicate.operator) {
          case FilterOperator.Eq:
            if (datesIsValid) {
              return momentFromHash.isSame(value);
            }

            return valueFromHash === value;
          case FilterOperator.Neq:
            if (datesIsValid) {
              return !momentFromHash.isSame(value);
            }

            return valueFromHash !== value;
          case FilterOperator.Le:
            if (datesIsValid) {
              return momentFromHash.isBefore(value);
            }

            return valueFromHash < value;
          case FilterOperator.Leq:
            if (datesIsValid) {
              return momentFromHash.isSameOrBefore(value);
            }

            return valueFromHash <= value;
          case FilterOperator.Ge:
            if (datesIsValid) {
              return momentFromHash.isAfter(value);
            }

            return valueFromHash > value;
          case FilterOperator.Geq:
            if (datesIsValid) {
              return momentFromHash.isSameOrAfter(value);
            }

            return valueFromHash >= value;
          default:
            throw new Error(`Unsupported filter operator '${predicate.operator}'.`);
        }
      };
    }

    if (predicate instanceof StringPredicate) {
      return (i) => (_this.getValue(i, predicate.attributePath) || '').toLowerCase().indexOf(predicate.containsValue.toLowerCase()) > -1;
    }

    if (predicate instanceof DetailPredicate) {
      let detailFilter = _this.buildFilter(predicate.predicate, options);
      if (predicate.isAll) {
        return function (i) {
          let detail = _this.getValue(i, predicate.detailPath);
          if (!detail) {
            return false;
          }

          let result = detailFilter(detail);
          return result.length === detail.length;
        };
      } else if (predicate.isAny) {
        return function (i) {
          let detail = _this.getValue(i, predicate.detailPath);
          if (!detail) {
            return false;
          }

          let result = detailFilter(detail);
          return result.length > 0;
        };
      } else {
        throw new Error(`Unsupported detail operation.`);
      }
    }

    if (predicate instanceof ComplexPredicate) {
      let filterFunctions = predicate.predicates.map(predicate => _this.getAttributeFilterFunction(predicate, options));
      switch (predicate.condition) {
        case Condition.And:
          return function (i) {
            let check = true;
            for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
              check &= filterFunctions[funcIndex](i);
              if (!check) {
                break;
              }
            }

            return check;
          };

        case Condition.Or:
          return function (i) {
            let check = false;
            for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
              check |= filterFunctions[funcIndex](i);
              if (check) {
                break;
              }
            }

            return check;
          };

        default:
          throw new Error(`Unsupported condition '${predicate.condition}'.`);
      }
    }

    throw new Error(`Unsupported predicate '${predicate}'.`);
  }

  /**
   Loads value from object by specified attribute path.

  @param {Object} item Object for load value.
  @param {String} attributePath The path to the attribute.
  @returns {*|undefined} Value of attribute or `undefined`.
  */
  getValue(item, attributePath) {
    let attributes = Information.parseAttributePath(attributePath);
    let search = item;
    for (let i = 0; i < attributes.length; i++) {
      search = search[attributes[i]];
      if (!search) {
        // Don't return constant null / undefined - we need to distinguish them.
        return search;
      }

      if (typeof search === 'object' && !(search instanceof Array) && !attributes[i + 1]) {
        // TODO: In fact, it can not only be `id`.
        return search.id;
      }
    }

    return search;
  }

  /**
   * Returns complex filter function for `and` condition.
   * Result function filters array of objects and returns those, for which
   * all attribute filter functions returned `true`.
   * Result function uses short circuit logic ([wiki](https://en.wikipedia.org/wiki/Short-circuit_evaluation)).
   *
   * @param {Function[]} filterFunctions Array of attribute filter functions.
   * @returns {Function} Complex filter function for `or` condition.
   */
  getFilterFunctionAnd(filterFunctions) {
    return function (data) {
      let result = [];
      for (let itemIndex = 0; itemIndex < data.length; itemIndex++) {
        let check = true;
        for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
          check &= filterFunctions[funcIndex](data[itemIndex]);
          if (!check) {
            break;
          }
        }

        if (check) {
          result.push(data[itemIndex]);
        }
      }

      return result;
    };
  }

  /**
   * Returns complex filter function for `or` condition.
   * Result function filters array of objects and returns those, for which
   * at least one attribute filter function returned `true`.
   * Result function uses short circuit logic ([wiki](https://en.wikipedia.org/wiki/Short-circuit_evaluation)).
   *
   * @param {Function[]} filterFunctions Array of attribute filter functions.
   * @returns {Function} Complex filter function for `or` condition.
   */
  getFilterFunctionOr(filterFunctions) {
    return function (data) {
      let result = [];
      for (let itemIndex = 0; itemIndex < data.length; itemIndex++) {
        let check = false;
        for (let funcIndex = 0; funcIndex < filterFunctions.length; funcIndex++) {
          check |= filterFunctions[funcIndex](data[itemIndex]);
          if (check) {
            break;
          }
        }

        if (check) {
          result.push(data[itemIndex]);
        }
      }

      return result;
    };
  }
}
