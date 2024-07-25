export function cleanup() {
  for (const adapterName in this._adapterCache) {
    const adapter = this._adapterCache[adapterName];
    if (typeof adapter.destroy === 'function') {
      adapter.destroy();
    }
  }

  for (const serializerName in this._serializerCache) {
    const serializer = this._serializerCache[serializerName];
    if (typeof serializer.destroy === 'function') {
      serializer.destroy();
    }
  }
}