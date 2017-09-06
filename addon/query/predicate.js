import FilterOperator from './filter-operator';
import Condition from './condition';

/**
 * The base class of logical predicate.
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class BasePredicate
 */
export class BasePredicate {
  constructor() {
  }
}

/**
 * The class of simple predicate for filtering attribute by value and filter operator.
 *
 * @namespace Query
 * @class SimplePredicate
 * @extends BasePredicate
 *
 * @param attributePath {String} The path to the attribute for filtering.
 * @param operator {Query.FilterOperator|String} The filter operator.
 * @param value {String|Number} The value for filtering.
 * @constructor
 */
export class SimplePredicate extends BasePredicate {
  constructor(attributePath, operator, value) {
    super();

    this._attributePath = attributePath;
    this._operator = FilterOperator.tryCreate(operator);
    this._value = value;
  }

  /**
   * The path to the attribute for filtering.
   *
   * @property attributePath
   * @type String
   * @public
   */
  get attributePath() {
    return this._attributePath;
  }

  /**
   * The filter operator.
   *
   * @property operator
   * @type Query.FilterOperator
   * @public
   */
  get operator() {
    return this._operator;
  }

  /**
   * The value for filtering.
   *
   * @property value
   * @type String|Number
   * @public
   */
  get value() {
    return this._value;
  }

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of the predicate.
   * @public
   */
  toString() {
    return `(${this._attributePath} ${this._operator} ${this._value})`;
  }
}

/**
 * The class of date predicate for filtering attribute by value and filter operator.
 *
 * @namespace Query
 * @class DatePredicate
 * @extends BasePredicate
 *
 * @param attributePath {String} The path to the attribute for filtering.
 * @param operator {Query.FilterOperator|String} The filter operator.
 * @param value {String|Date} The value for filtering.
 * @constructor
 */
export class DatePredicate extends BasePredicate {
  constructor(attributePath, operator, value) {
    super();

    this._attributePath = attributePath;
    this._operator = FilterOperator.tryCreate(operator);
    this._value = value;
  }

  /**
   * The path to the attribute for filtering.
   *
   * @property attributePath
   * @type String
   * @public
   */
  get attributePath() {
    return this._attributePath;
  }

  /**
   * The filter operator.
   *
   * @property operator
   * @type Query.FilterOperator
   * @public
   */
  get operator() {
    return this._operator;
  }

  /**
   * The value for filtering.
   *
   * @property value
   * @type String
   * @public
   */
  get value() {
    return this._value;
  }

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of the predicate.
   * @public
   */
  toString() {
    return `(${this._attributePath} ${this._operator} ${this._value})`;
  }
}

/**
 * The class of complex predicate which include multiple predicates unioned with logical condition.
 *
 * @namespace Query
 * @class ComplexPredicate
 * @extends BasePredicate
 *
 * @param condition {Query.Condition} Logical condition for predicates.
 * @param ...predicates {Query.BasePredicate} List of predicates for combining.
 * @constructor
 */
export class ComplexPredicate extends BasePredicate {
  constructor(condition, ...predicates) {
    super();

    if (predicates === null || !(predicates instanceof Array)) {
      throw new Error(`Wrong predicates`);
    }

    if (predicates.length < 2) {
      throw new Error(`Complex predicate requires at least two nested predicates`);
    }

    predicates.forEach(validatePredicate);

    this._condition = Condition.tryCreate(condition);
    this._predicates = predicates;
  }

  get condition() {
    return this._condition;
  }

  get predicates() {
    return this._predicates;
  }

  and(...predicates) {
    // Just add the predicate if conditions match.
    if (this._condition === Condition.And) {
      this.predicates.forEach(p => predicates.unshift(p));
      return new ComplexPredicate(Condition.And, ...predicates);
    }

    return super.and(...predicates);
  }

  or(...predicates) {
    // Just add the predicate if conditions match.
    if (this._condition === Condition.Or) {
      this.predicates.forEach(p => predicates.unshift(p));
      return new ComplexPredicate(Condition.Or, ...predicates);
    }

    return super.or(...predicates);
  }

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of the predicate.
   * @public
   */
  toString() {
    return `(${this._predicates.map(i => i.toString()).join(` ${this.condition} `)})`;
  }
}

/**
 * The predicate class for string attributes.
 *
 * @namespace Query
 * @class StringPredicate
 * @extends BasePredicate
 *
 * @param {String} attributePath The path to the attribute for predicate.
 * @constructor
 */
export class StringPredicate extends BasePredicate {
  constructor(attributePath) {
    super();

    if (!attributePath) {
      throw new Error('Attribute path is required for StringPredicate constructor.');
    }

    this._attributePath = attributePath;
    this._containsValue = null;
  }

  /**
   * The path to the attribute for predicate.
   *
   * @property attributePath
   * @type {String}
   * @public
   */
  get attributePath() {
    return this._attributePath;
  }

  /**
   * The value that has to be contained in the attribute.
   *
   * @property containsValue
   * @type {String}
   * @public
   */
  get containsValue() {
    return this._containsValue;
  }

  /**
   * Sets the value that the attribute has to contain.
   *
   * @method contains
   * @param {String} value The value that the attribute has to contain.
   * @return {Query.StringPredicate} Returns this instance.
   * @chainable
   */
  contains(value) {
    this._containsValue = value;
    return this;
  }
}

/**
 * The predicate class for geography attributes.
 *
 * @namespace Query
 * @class GeographyPredicate
 * @extends BasePredicate
 *
 * @param {String} attributePath The path to the attribute for predicate.
 * @constructor
 */
export class GeographyPredicate extends BasePredicate {
  constructor(attributePath) {
    super();

    if (!attributePath) {
      throw new Error('Attribute path is required for GeographyPredicate constructor.');
    }

    this._attributePath = attributePath;
    this._containsValue = null;
  }

  /**
   * The path to the attribute for predicate.
   *
   * @property attributePath
   * @type {String}
   * @public
   */
  get attributePath() {
    return this._attributePath;
  }

  /**
   * The value that has to be contained in the attribute.
   *
   * @property containsValue
   * @type {String}
   * @public
   */
  get containsValue() {
    return this._containsValue;
  }

  /**
   * Sets the value that the attribute has to contain.
   *
   * @method contains
   * @param {String} value The value that the attribute has to contain.
   * @return {Query.StringPredicate} Returns this instance.
   * @chainable
   */
  intersects(value) {
    this._containsValue = value;
    return this;
  }
}

/**
 * The predicate class for details.
 *
 * @namespace Query
 * @class DetailPredicate
 * @extends BasePredicate
 *
 * @param {String} detailPath The path to the detail for predicate.
 * @constructor
 */
export class DetailPredicate extends BasePredicate {
  constructor(detailPath) {
    super();

    if (!detailPath) {
      throw new Error('Detail path is required for DetailPredicate constructor.');
    }

    this._detailPath = detailPath;
    this._predicate = null;
    this._all = false;
    this._any = false;
  }

  /**
   * The path to the detail for predicate.
   *
   * @returns {String}
   */
  get detailPath() {
    return this._detailPath;
  }

  /**
   * The predicate for details.
   *
   * @returns {Query.BasePredicate|null}
   */
  get predicate() {
    return this._predicate;
  }

  /**
   * Is need to use predicate for all details.
   *
   * @returns {Boolean}
   */
  get isAll() {
    return this._all;
  }

  /**
   * Is need to use predicate for any detail.
   *
   * @returns {Boolean}
   */
  get isAny() {
    return this._any;
  }

  /**
   * Adds predicate for all details.
   *
   * @method all
   * @param ...args Predicate for all details.
   * @returns {Query.DetailPredicate} Returns this instance.
   * @public
   */
  all(...args) {
    this._predicate = createPredicate(...args);
    this._all = true;
    this._any = false;

    return this;
  }

  /**
   * Adds predicate for any detail.
   *
   * @method any
   * @param ...args Predicate for any detail.
   * @returns {Query.DetailPredicate} Returns this instance.
   * @public
   */
  any(...args) {
    this._predicate = createPredicate(...args);
    this._any = true;
    this._all = false;

    return this;
  }

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of the predicate.
   * @public
   */
  toString() {
    let func = 'IncompleteDeteailPredicate';
    if (this._all) {
      func = 'all';
    } else if (this._any) {
      func = 'any';
    }

    return `${func}${this._predicate ? this._predicate.toString() : '<null>'}`;
  }
}

/**
 * Combines specified predicates using `and` logic condition.
 *
 * @for BasePredicate
 * @method and
 * @param {Query.BasePredicate} ...predicates List of predicates for combining.
 * @return {Query.ComplexPredicate} Combined complex predicate with `and` logic.
 * @public
 */
BasePredicate.prototype.and = function (...predicates) {
  predicates.unshift(this);
  return new ComplexPredicate(Condition.And, ...predicates);
};

/**
 * Combines specified predicates using `or` logic condition.
 *
 * @for BasePredicate
 * @method or
 * @param {Query.BasePredicate} ...predicates List of predicates for combining.
 * @return {Query.ComplexPredicate} Combined complex predicate with `or` logic.
 * @public
 */
BasePredicate.prototype.or = function (...predicates) {
  predicates.unshift(this);
  return new ComplexPredicate(Condition.Or, ...predicates);
};

/**
 * Throws error if specified arguemnt is not a predicate.
 *
 * @param {Object} predicate Object for validate.
 */
function validatePredicate(predicate) {
  if (!predicate || !(predicate instanceof BasePredicate)) {
    throw new Error(`Wrong predicate ${predicate}`);
  }
}

/**
 * Creates predicate by various parameters.
 *
 * @namespace Query
 * @method createPredicate
 * @param args Arguments for the predicate.
 * @return {BasePredicate}
 */
export function createPredicate(...args) {
  if (args.length === 1) {
    if (args[0] && args[0] instanceof BasePredicate) {
      return args[0];
    } else {
      throw new Error(`Specified argument is not a predicate`);
    }
  }

  if (args.length === 3) {
    return new SimplePredicate(args[0], args[1], args[2]);
  }

  throw new Error(`Couldn not create predicate from arguments`);
}
