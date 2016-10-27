import Ember from 'ember';

export default function isAsync(type, attrName) {
  let relationshipMeta = Ember.get(type, 'relationshipsByName').get(attrName);
  return (relationshipMeta && relationshipMeta.options && relationshipMeta.options.hasOwnProperty('async')) ? relationshipMeta.options.async : true;
}
