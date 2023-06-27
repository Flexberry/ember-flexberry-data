/**
 * The base class of parameters for logical predicate.
 *
 * @module ember-flexberry-data
 * @namespace Query
 * @class BaseParam
 */
export class BaseParam {
  constructor() {
  }
}

/**
 * The class of const parameter for logical predicate.
 *
 * @namespace Query
 * @class ConstParam
 * @extends BaseParam
 *
 * @param constValue {String|Number} The value of parameter.
 * @constructor
 */
export class ConstParam extends BaseParam {
  constructor(constValue) {
    super();

    this._constValue = constValue;
  }

  /**
   * The value of parameter for logical predicate.
   *
   * @property constValue
   * @type String|Number
   * @public
   */
  get constValue() {
    return this._constValue;
  }

  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of the parameter.
   * @public
   */
  toString() {
    return `${this._constValue}`;
  }
}

/**
 * The class of attribute parameter for logical predicate.
 *
 * @namespace Query
 * @class AttributeParam
 * @extends BaseParam
 *
 * @param attributePath {String} The path to the attribute for filtering.
 * @constructor
 */
export class AttributeParam extends BaseParam {
  constructor(attributePath) {
    super();

    this._attributePath = attributePath;
  }

  /**
   * The path to the attribute.
   *
   * @property attributePath
   * @type String
   * @public
   */
  get attributePath() {
    return this._attributePath;
  }


  /**
   * Converts this instance to string.
   *
   * @method toString
   * @return {String} Text representation of the parameter.
   * @public
   */
  toString() {
    return `${this._attributePath}`;
  }
}
