import FilterOperator from './query-filter-operator';
import Condition from './query-condition';

/**
 * Base class of logical predicate.
 *
 * @module ember-flexberry-projections
 * @class BasePredicate
 * @public
 */
export class BasePredicate {
  constructor() {
  }
}

/**
 * Class of simple predicate for filtering property by value and filter operator.
 *
 * @module query
 * @class SimplePredicate
 */
export class SimplePredicate extends BasePredicate {
  /**
   * Class constructor.
   *
   * @param property {String} The name of the property for filtering.
   * @param operator {FilterOperator} The filter operator.
   * @param value {*} The value for filtering.
   */
  constructor(property, operator, value) {
    super();

    this._propertyName = property;
    this._operator = FilterOperator.tryCreate(operator);
    this._value = value;
  }

  get property() {
    return this._propertyName;
  }

  get operator() {
    return this._operator;
  }

  get value() {
    return this._value;
  }

  toString() {
    return `(${this._propertyName} ${this._operator} ${this._value})`;
  }
}

/**
 * Class of complex predicate which include multiple predicates unioned with logical condition.
 *
 * @module query
 * @class ComplexPredicate
 */
export class ComplexPredicate extends BasePredicate {
  /**
   * Class constructor.
   *
   * @param condition {Condition} Logical condition for predicates.
   * @param predicates
     */
  constructor(condition, ...predicates) {
    super();

    if (predicates === null || !(predicates instanceof Array)) {
      throw new Error(`Wrong predicates`);
    }

    if (predicates.length < 2) {
      throw new Error(`Complex predicate requires at least two nested predicates`);
    }

    predicates.forEach(i => {
      if (!i || !(i instanceof BasePredicate)) {
        throw new Error(`Wrong predicate ${i}`);
      }
    });

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

  toString() {
    return `(${this._predicates.map(i => i.toString()).join(` ${this.condition} `)})`;
  }
}

export class StringPredicate extends BasePredicate {
  constructor(attributeName) {
    super();

    this._attributeName = attributeName;
  }

  get attributeName() {
    return this._attributeName;
  }

  get containsValue() {
    return this._containsValue;
  }

  contains(value) {
    this._containsValue = value;
    return this;
  }

  caseSensitive() {
    this._caseSensitive = true;
    return this;
  }
}

BasePredicate.prototype.and = function (...predicates) {
  predicates.unshift(this);
  return new ComplexPredicate(Condition.And, ...predicates);
};

BasePredicate.prototype.or = function (...predicates) {
  predicates.unshift(this);
  return new ComplexPredicate(Condition.Or, ...predicates);
};
