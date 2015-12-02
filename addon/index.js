/**
 * Ember Addon that adds support of projections in models.
 *
 * @module ember-flexberry-projections
 * @main ember-flexberry-projections
 */

import Store from './mixins/store';
import Adapter from './mixins/adapter';
import Model from './models/model';
import create from './utils/create';
import {attr, belongsTo, hasMany} from './utils/attributes';

/**
 * This namespace contains classes and methods for working with projections.
 *
 * @class Projection
 * @static
 * @public
 */
let Projection = {
  Store: Store,
  Adapter: Adapter,
  Model: Model,
  create: create,
  attr: attr,
  belongsTo: belongsTo,
  hasMany: hasMany
};

export default Projection;
