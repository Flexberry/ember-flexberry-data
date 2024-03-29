import { getOwner } from '@ember/application';
import { isNone } from '@ember/utils';
import isObject from '../../utils/is-object';

/*
  syncUp   before finder
  syncDown after  finder
  @param {String} finderType {'single'|'multiple'|'all'}
  @param {Function} decoratable method of online store
*/
export default function decorateAPICall(finderType, superFunc) {
  return function apiCall() {
    let _this = this;
    let args = arguments;
    let syncer = getOwner(_this).lookup('service:syncer');
    let _superFinder = superFunc;

    if (args.length > 0) {
      let options = args[args.length - 1];
      let bypass = (typeof options === 'object') && options.bypass;
      if (bypass) {
        return _superFinder.apply(_this, args);
      }
    }

    return _superFinder.apply(_this, args).then(function(result) {
      let queryOrOptions = isObject(args[1]) ? args[1] : isObject(args[2]) ? args[2] : null;
      let projectionName = null;
      if (!isNone(queryOrOptions)) {
        projectionName = queryOrOptions.projectionName ? queryOrOptions.projectionName :
          queryOrOptions.projection && typeof queryOrOptions.projection === 'string' ? queryOrOptions.projection : null;
      }

      if (getOwner(_this).lookup('service:offline-globals').get('isSyncDownWhenOnlineEnabled')) {
        return syncDown(result, false, projectionName);
      } else {
        return result;
      }
    });

    function syncDown(result, reload, projectionName) {
      if (finderType === 'all') {
        let modelName = result.get('type.modelName');
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
