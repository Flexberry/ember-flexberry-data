/**
 * Ember Addon that adds support of projections in models.
 *
 * @module ember-flexberry-data
 * @main ember-flexberry-data
 */

import Store from './mixins/store';
import Adapter from './mixins/adapter';
import Model from './models/model';
import create from './utils/create';
import { attr, belongsTo, hasMany } from './utils/attributes';

import OfflineModel from './models/offline-model';
import OfflineModelMixin from './mixins/offline-model';
import BaseStore from './stores/base-store';
import LocalSerializer from './serializers/local-serializer';
import LocalAdapter from './adapters/local-adapter';
import OfflineGlobalsService from './services/offline-globals';
import Syncer from './syncer';

/**
 * This namespace contains classes and methods to support work in offline mode.
 */
let Offline = {
  Store: BaseStore,
  Model: OfflineModel,
  ModelMixin: OfflineModelMixin,
  Adapter: LocalAdapter,
  Serializer: LocalSerializer,
  GlobalsService: OfflineGlobalsService,
  Syncer: Syncer
};

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

export { Offline, Projection };
