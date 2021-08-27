import FilterOperator from './filter-operator';
import Condition from './condition';
import moment from 'moment';

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
 * @param timeless {Boolean} When true, dates will be filtered without time.
 * @constructor
 */
export class DatePredicate extends BasePredicate {
  constructor(attributePath, operator, value, timeless) {
    super();

    let momentFromValue = moment(value);
    if (!momentFromValue.isValid()) {
      throw new Error(`Date isn't valid or null (for null values use SimplePredicate)`);
    }

    this._attributePath = attributePath;
    this._operator = FilterOperator.tryCreate(operator);
    this._value = value;
    this._timeless = timeless;
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
   * Flag for dates.
   *
   * @property timeless
   * @type Boolean
   * @public
   */
  get timeless() {
    return this._timeless;
  }

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of the predicate.
   * @public
   */
  toString() {
    return this._timeless ? `(date(${this._attributePath}) ${this._operator} ${this._value})` :
      `(${this._attributePath} ${this._operator} ${this._value})`;
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
 * The base class of logical predicate for spatial attributes.
 *
 * @namespace Query
 * @class SpatialPredicate
 * @extends BasePredicate
 *
 * @param {String} attributePath The path to the attribute for predicate.
 * @constructor
 */
export class SpatialPredicate extends BasePredicate {
  constructor(attributePath) {
    super();

    if (!attributePath) {
      throw new Error('Attribute path is required for SpatialPredicate constructor.');
    }

    this._attributePath = attributePath;
    this._options = null;
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
   * The filter operator.
   *
   * @property operator
   * @type Query.FilterOperator
   * @public
   */
   get operator() {
    return this._options.operator;
  }

  /**
   * The spatial type value that has to be the second argument of the spatial function,
   * assuming the attribute is the first argument.
   *
   * @property spatial
   * @type {String}
   * @public
   */
   get spatial() {
    return this._options.spatial;
  }

  /**
   * The spatial function to call.
   *
   * @property spatialFunction
   * @type {String}
   * @public
   */
  get spatialFunction() {
    return this._function;
  }

  /**
   * The spatial type namespace.
   *
   * @property spatialNamespace
   * @type {String}
   * @public
   */
  get spatialNamespace() {
      throw this._getAbstractPropertyError('spatialNamespace');
  }

  /**
   * The spatial type.
   *
   * @property spatialType
   * @type {String}
   * @public
   */
  get spatialType() {
      throw this._getAbstractPropertyError('spatialType');
  }

  /**
   * The value for filtering.
   *
   * @property value
   * @type String|Number
   * @public
   */
   get value() {
    return this._options.value;
  }

  /**
   * Sets the spatial predicate metadata that has to be used on build the distance condition with the attribute.
   * 
   * @method distance
   * @param {String} spatial The spatial type value that has to have a distance from the attribute.
   * @param operator {Query.FilterOperator|String} The filter operator.
   * @param value {String|Number} The value for filtering.
   * @return {Query.SpatialPredicate} Returns this instance.
   * @chainable
   */
  distance(spatial, operator, value) {
    this._function = 'distance';
    this._options = {
      spatial: spatial,
      operator: FilterOperator.tryCreate(operator),
      value: value,
    }
    return this;
  }

  /**
   * Sets the spatial predicate metadata that has to be used on build the intersection condition with the attribute.
   *
   * @method intesects
   * @param {String} spatial The spatial type value that has to intersect with the attribute.
   * @return {Query.SpatialPredicate} Returns this instance.
   * @chainable
   */
  intersects(spatial) {
    this._function = 'intersects';
    this._options = {
      spatial: spatial,
    }
    return this;
  }

  _getAbstractPropertyError(property) {
    return new Error(`The ${property} property must be overridden in the SpatialPredicate subtypes.`);
  }
}

/**
 * The predicate class for geography attributes.
 *
 * @namespace Query
 * @class GeographyPredicate
 * @extends SpatialPredicate
 */
export class GeographyPredicate extends SpatialPredicate {
  /**
   * The geography type namespace.
   *
   * @property spatialNamespace
   * @type {String}
   * @public
   */
  get spatialNamespace() {
    return 'geo';
  }

  /**
   * The geography type.
   *
   * @property spatialType
   * @type {String}
   * @public
   */
  get spatialType() {
    return 'geography';
  }
}

/**
 * The predicate class for geometry attributes.
 *
 * @namespace Query
 * @class GeometryPredicate
 * @extends SpatialPredicate
 */
export class GeometryPredicate extends SpatialPredicate {  /**
   * The geometry type namespace.
   *
   * @property spatialNamespace
   * @type {String}
   * @public
   */
  get spatialNamespace() {
    return 'geom';
  }

  /**
   * The geometry type.
   *
   * @property spatialType
   * @type {String}
   * @public
   */
  get spatialType() {
    return 'geometry';
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
 * The class of not predicate.
 *
 * @namespace Query
 * @class NotPredicate
 * @extends BasePredicate
 *
 * @param predicate {Object} Another predicate.
 * @constructor
 */
export class NotPredicate extends BasePredicate {
  constructor(predicate) {
    if (!predicate) {
      throw new Error('Inner predicate is required.');
    }

    super();

    this._predicate = predicate;
  }

  /**
   * Predicate getter.
   *
   * @property predicate
   * @type String
   * @public
   */
  get predicate() {
    return this._predicate;
  }

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of result predicate.
   * @public
   */
  toString() {
    return `not ${this._predicate}`;
  }
}

/**
 * The predicate class that implements the isof function.
 *
 * Its constructor implements the following signatures:
 *   - `new IsOfPredicate(typeName)`
 *   - `new IsOfPredicate(expression, typeName)`
 *
 * Where:
 *   - `typeName` - type name to which the current instance will be assigned.
 *   - `expression` - an expression relative to the current instance that must point to an object for assigning a type.
 *
 * @namespace Query
 * @class IsOfPredicate
 * @extends BasePredicate
 *
 * @param ...args
 * @constructor
 */
export class IsOfPredicate extends BasePredicate {
  constructor(...args) {
    super();

    let expression;
    let typeName = args[0];
    if (args.length === 2) {
      expression = args[0];
      typeName = args[1];
    }

    if (!typeName) {
      throw new Error('Type name is required.');
    }

    this._expression = expression;
    this._typeName = typeName;
  }

  /**
   * Expression getter.
   *
   * @property expression
   * @type String
   * @public
   */
  get expression() {
    return this._expression;
  }

  /**
   * Type name getter.
   *
   * @property typeName
   * @type String
   * @public
   */
  get typeName() {
    return this._typeName;
  }

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of result predicate.
   * @public
   */
  toString() {
    return `isof(${this._expression ? `${this._expression}, ` : ''}'${this._typeName}')`;
  }
}

/**
 * The class of true predicate.
 *
 * @namespace Query
 * @class TruePredicate
 * @extends BasePredicate
 * @constructor
 */
export class TruePredicate extends BasePredicate {
  constructor() {
    super();
  }

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of the predicate.
   * @public
   */
  toString() {
    return 'true';
  }
}

/**
 * The class of false predicate.
 *
 * @namespace Query
 * @class FalsePredicate
 * @extends BasePredicate
 * @constructor
 */
export class FalsePredicate extends BasePredicate {

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of the predicate.
   * @public
   */
  toString() {
    return 'false';
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
 * Throws error if specified argument is not a predicate.
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

  throw new Error(`Could not create predicate from arguments`);
}

/**
  Convert string to predicate.

  @method stringToPredicate
  @param stringPredicate
  @return {BasePredicate}
*/
export function stringToPredicate(stringPredicate) {
  let predicate;
  try {
    predicate = eval('function fromString() { return ' + stringPredicate + '; } fromString;')();
  } finally {
    return predicate;
  }
}
