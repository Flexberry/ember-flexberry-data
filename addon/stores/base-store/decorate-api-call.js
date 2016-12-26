import Ember from 'ember';
import isObject from '../../utils/is-object';

/*
  syncUp   before finder
  syncDown after  finder
  @param {String} finderType {'single'|'multiple'|'all'}
  @param {Function} decoratable method of online store
*/
export default function decorateAPICall(finderType, superFunc) {
  return function apiCall() {
    var _this = this;
    var args = arguments;
    var syncer = Ember.getOwner(_this).lookup('service:syncer');
    var _superFinder = superFunc;

    if (args.length > 0) {
      var options = args[args.length - 1];
      var bypass = (typeof options === 'object') && options.bypass;
      if (bypass) {
        return _superFinder.apply(_this, args);
      }
    }

    return _superFinder.apply(_this, args).then(function(result) {
      let queryOrOptions = isObject(args[1]) ? args[1] : isObject(args[2]) ? args[2] : null;
      let projectionName = null;
      if (!Ember.isNone(queryOrOptions)) {
        projectionName = queryOrOptions.projectionName ? queryOrOptions.projectionName :
          queryOrOptions.projection && typeof queryOrOptions.projection === 'string' ? queryOrOptions.projection : null;
      }

      if (Ember.getOwner(_this).lookup('service:offline-globals').get('isSyncDownWhenOnlineEnabled')) {
        return syncDown(result, false, projectionName, { unloadSyncedRecords: false });
      } else {
        return result;
      }
    });

    function syncDown(result, reload, projectionName) {
      if (finderType === 'all') {
        var modelName = result.get('type.modelName');
        syncer.syncDown(modelName, reload, projectionName);

      } else if (finderType === 'single') {
        syncer.syncDown(result, reload, projectionName);

      } else if (finderType === 'multiple') {
        syncer.syncDown(result, reload, projectionName);

      } else {
        throw new Error('finderType must be one of single, multiple or all, but got ' + finderType);
      }

      return result;
    }
  };
}
