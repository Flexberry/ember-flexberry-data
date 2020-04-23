import { CustomPredicate } from 'ember-flexberry-data/query/predicate';

/**
  The class equal zero custom predicate.
  Checks whether attribute equals zero.

  @class EqZeroCustomPredicate
  @extends CustomPredicate

  @param {String} attributePath Attribute path.
  @constructor
*/
export class EqZeroCustomPredicate extends CustomPredicate {
  constructor(attributePath) {
    let args = { attributePath };
    args.converters = {};
    args.converters.odata = function(adapter, predicate, modelName, prefix/*, level*/) {
      const attribute = adapter.getODataAttributeName(modelName, predicate.attributePath, prefix);

      return `${attribute} eq 0`;
    };

    args.converters.indexeddb = function(jsAdapter, predicate, table) {
      return table.filter(predicate.jsConverter(jsAdapter, predicate, { booleanAsString: true }));
    };

    args.converters.js = function(adapter, predicate/*, options*/) {
      return (obj) => {
        const attributeValue = adapter.getValue(obj, predicate.attributePath);
        return attributeValue === 0;
      };
    };

    super(args);

    this._attributePath = attributePath;
  }

  get attributePath() {
    return this._attributePath;
  }

  toString() {
    return `(${this._attributePath} = 0)`;
  }
}

/**
  The class not custom predicate.
  Inverts inner predicate.

  @class NotCustomPredicate
  @extends CustomPredicate

  @param {BasePredicate} predicate Inner predicate.
  @constructor
*/
export class NotCustomPredicate extends CustomPredicate {
  constructor(predicate) {
    let args = { predicate };
    args.converters = {};
    args.converters.odata = function(adapter, predicate, modelName, prefix, level) {
      return `not(${adapter.convertPredicateToODataFilterClause(predicate.predicate, modelName, prefix, level)})`;
    };

    args.converters.indexeddb = function(jsAdapter, predicate, table) {
      return table.filter(predicate.jsConverter(jsAdapter, predicate, { booleanAsString: true }));
    };

    args.converters.js = function(adapter, predicate, options) {
      return (obj) => {
        const innerPredicateFunction = adapter.getAttributeFilterFunction(predicate.predicate, options);
        return !innerPredicateFunction(obj);
      };
    };

    super(args);

    this._predicate = predicate;
  }

  get predicate() {
    return this._predicate;
  }

  toString() {
    return `not ${this._predicate}`;
  }
}
