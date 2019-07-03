/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import DS from 'ember-data';

/**
  Store that used in online mode by default.

  @class OnlineStore
  @namespace OData
  @extends <a href="http://emberjs.com/api/data/classes/DS.Store.html">DS.Store</a>
  @private
*/
export default DS.Store.extend({

  /**
    Delete all record from the current store.
    @method deleteRecord
    @param {String} modelName modelName
    @param {Object} filter filter
  */
  deleteAllRecords: function(modelName, filter) {
    let adapter = this.adapterFor(modelName);
    if (Ember.isNone(adapter.deleteAllRecords)) {
      Ember.assert('Method \'deleteAllRecords\' is missing');
    }

    return adapter.deleteAllRecords(adapter.store, modelName, filter);
  },

  /**
    A method to send batch update, create or delete models in single transaction.

    It is recommended to create new models with identifiers, otherwise, after saving, the model object in the store will be created anew.

    The array which fulfilled the promise may contain the following values:
    - `new model object` - for records created without client id.
    - `same model object` - for created, updated or unaltered records.
    - `null` - for deleted records.

    @method batchUpdate
    @param {DS.Model[]|DS.Model} models Is array of models or single model for batch update.
    @return {Promise} A promise that fulfilled with an array of models in the new state.
  */
  batchUpdate(models) {
    return this.adapterFor('application').batchUpdate(this, models);
  },
});
