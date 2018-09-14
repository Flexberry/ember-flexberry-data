/**
  Ember Addon that adds support of projections in models.

  @module ember-flexberry-data
  @main ember-flexberry-data
*/

import Ember from 'ember';
import version from './version';

import StoreMixin from './mixins/store';
import AdapterMixin from './mixins/adapter';
import Model from './models/model';
import create from './utils/create';
import { attr, belongsTo, hasMany } from './utils/attributes';

import OfflineModel from './models/offline-model';
import OfflineModelMixin from './mixins/offline-model';
import BaseStore from './stores/base-store';
import LocalStore from './stores/local-store';
import OnlineStore from './stores/online-store';
import OfflineSerializer from './serializers/offline';
import OfflineAdapter from './adapters/offline';
import OfflineGlobalsService from './services/offline-globals';
import Syncer from './services/syncer';

import OdataAdapter from './adapters/odata';
import BaseSerializer from './serializers/base';
import OdataSerializer from './serializers/odata';

import Information from './utils/information';

import BaseAdapter from './query/base-adapter';
import BaseBuilder from './query/base-builder';
import Builder from './query/builder';
import Condition from './query/condition';
import FilterOperator from './query/filter-operator';
import IndexedDbAdapter from './query/indexeddb-adapter';
import JsAdapter from './query/js-adapter';
import QueryOdataAdapter from './query/odata-adapter';
import OrderByClause from './query/order-by-clause';
import QueryObject from './query/query-object';
import {
  BasePredicate,
  SimplePredicate,
  DatePredicate,
  ComplexPredicate,
  StringPredicate,
  DetailPredicate,
  GeographyPredicate,
  NotPredicate,
  IsOfPredicate,
  createPredicate,
} from './query/predicate';

import UserService from './services/user';
import DexieService from './services/dexie';

import AuditModelMixin from './mixins/audit-model';

/**
  This namespace contains classes to support work in offline mode.

  @class Offline
  @static
  @public
*/
let Offline = createNamespace();
Offline.Store = BaseStore;
Offline.LocalStore = LocalStore;
Offline.Model = OfflineModel;
Offline.ModelMixin = OfflineModelMixin;
Offline.GlobalsService = OfflineGlobalsService;
Offline.Syncer = Syncer;
Offline.DexieService = DexieService;

/**
  This namespace contains classes and methods for working with projections.

  @class Projection
  @static
  @public
*/
let Projection = createNamespace();
Projection.StoreMixin = StoreMixin;
Projection.AdapterMixin = AdapterMixin;
Projection.Model = Model;
Projection.create = create;
Projection.attr = attr;
Projection.belongsTo = belongsTo;
Projection.hasMany = hasMany;
Projection.OnlineStore = OnlineStore;

/**
  This namespace contains base adapter classes for different kind of backends.

  @class Adapter
  @static
  @public
*/
let Adapter = createNamespace();
Adapter.Offline = OfflineAdapter;
Adapter.Odata = OdataAdapter;

/**
  This namespace contains base serializer classes for different kind of backends.

  @class Serializer
  @static
  @public
*/
let Serializer = createNamespace();
Serializer.Offline = OfflineSerializer;
Serializer.Base = BaseSerializer;
Serializer.Odata = OdataSerializer;

/**
  This namespace contains implementation of Flexberry Query including adapters
  for converting query object to requests for different kind of backends.

  @class Query
  @static
  @public
*/
let Query = createNamespace();
Query.BaseAdapter = BaseAdapter;
Query.BaseBuilder = BaseBuilder;
Query.Builder = Builder;
Query.Condition = Condition;
Query.FilterOperator = FilterOperator;
Query.IndexedDbAdapter = IndexedDbAdapter;
Query.JsAdapter = JsAdapter;
Query.OdataAdapter = QueryOdataAdapter;
Query.OrderByClause = OrderByClause;
Query.QueryObject = QueryObject;
Query.BasePredicate = BasePredicate;
Query.SimplePredicate = SimplePredicate;
Query.DatePredicate = DatePredicate;
Query.ComplexPredicate = ComplexPredicate;
Query.StringPredicate = StringPredicate;
Query.DetailPredicate = DetailPredicate;
Query.GeographyPredicate = GeographyPredicate;
Query.NotPredicate = NotPredicate;
Query.IsOfPredicate = IsOfPredicate;
Query.createPredicate = createPredicate;

/**
  This namespace contains helper claseses.

  @class Utils
  @static
  @public
*/
let Utils = createNamespace();
Utils.Information = Information;

/**
  This namespace contains security claseses.

  @class Security
  @static
  @public
*/
let Security = createNamespace();
Security.UserService = UserService;

/**
  This namespace contains audit claseses.

  @class Audit
  @static
  @public
*/
let Audit = createNamespace();
Audit.ModelMixin = AuditModelMixin;

function createNamespace() {
  return Ember.Namespace.create({
    VERSION: version
  });
}

export { Projection, Offline, Adapter, Serializer, Query, Utils, Security, Audit };
