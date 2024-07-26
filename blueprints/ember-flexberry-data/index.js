/* globals module */
module.exports = {
  afterInstall: function() {
    return this.addPackagesToProject([
      { name: 'dexie', target: '2.0.2' },
      { name: 'ember-uuid', target: '2.0.0' },
      { name: 'ember-moment', target: '^9.0.1' }
    ]);
  },

  normalizeEntityName: function() {}
};
