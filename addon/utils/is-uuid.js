/**
  @method isUUID
  @param {DS.Store} uuid
  @return {Boolean}
*/
export default function isUUID(uuid) {
  let uuidStr = '' + uuid;
  uuidStr = uuidStr.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
  if (uuidStr === null) {
    return false;
  }

  return true;
}
