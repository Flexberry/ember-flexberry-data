/**
  @method isEmbedded
  @param {DS.Store} store
  @param {DS.Model} modelType
  @param {String} relationshipName
  @return {Boolean}
*/
export default function isEmbedded(store, modelType, relationshipName) {
  let serializerAttrs = store.serializerFor(modelType.modelName).get('attrs');
  return serializerAttrs && serializerAttrs[relationshipName] &&
    ((serializerAttrs[relationshipName].embedded && serializerAttrs[relationshipName].embedded === 'always') ||
    (serializerAttrs[relationshipName].deserialize && serializerAttrs[relationshipName].deserialize === 'records'));
}
