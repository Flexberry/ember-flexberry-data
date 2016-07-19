import Ember from 'ember';
import isObject from '../../utils/is-object';

/*
 * Extend serializer so that we can use local serializer when local adater is
 * used.
 */
export default function decorateSerializer(serializer, modelName) {
  if (serializer.get('flexberry')) {
    return serializer;
  }

  serializer.set('flexberry', true);

  var localSerializer = Ember.getOwner(this).lookup('store:local').serializerFor(modelName);

  // serialize()
  // normalizeResponse()
  // normalize() is not used in localforage adapter, so we do not decorate
  decorateSerializerMethod(serializer, localSerializer, 'serialize', 0);
  decorateSerializerMethod(serializer, localSerializer, 'normalizeResponse',   2);

  // decorateSerializerMethod(serializer, localSerializer, 'normalize', 2);

  return serializer;
}

function decorateSerializerMethod(serializer, localSerializer, methodName, wrappedArgIndex) {
  var originMethod = serializer[methodName];
  var backupMethod = function() {
    // remove flexberry from arg
    //TODO: replace to ...args
    var args = Array.prototype.slice.call(arguments);
    delete args[wrappedArgIndex].flexberry;

    return localSerializer[methodName].apply(localSerializer, args);
  };

  serializer[methodName] = function() {
    var payload = arguments[wrappedArgIndex];

    if (isObject(payload) && payload.flexberry) {
      return backupMethod.apply(localSerializer, arguments);
    } else {
      return originMethod.apply(serializer, arguments);
    }
  };
}
