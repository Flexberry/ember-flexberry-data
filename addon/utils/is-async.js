import { get } from '@ember/object';

export default function isAsync(type, attrName) {
  let relationshipMeta = get(type, 'relationshipsByName').get(attrName);
  return (relationshipMeta && relationshipMeta.options && relationshipMeta.options.hasOwnProperty('async')) ? relationshipMeta.options.async : true;
}
