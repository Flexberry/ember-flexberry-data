import uuid from 'node-uuid';

/**
 * @return { String } RFC4122 version 4 UUID
 */
export default function generateUniqueId() {
  return uuid.v4();
}
