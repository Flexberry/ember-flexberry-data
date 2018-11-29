/* globals module */
module.exports = {
  afterInstall: function() {
    var _this = this;
    return _this.addAddonsToProject({
      packages: [
        { name: 'ember-auto-import', target: '1.2.16' },
        { name: 'ember-data', target: '3.5.0' },
        { name: 'ember-moment', target: '7.8.0' }
      ]
    }).then(function () {
      return _this.addPackagesToProject([
        { name: 'dexie', target: '2.0.2' },
        { name: 'node-uuid', target: '1.4.8' }
      ]);
    });
  },

  normalizeEntityName: function() {}
};
