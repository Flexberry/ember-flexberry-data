/* globals module */
module.exports = {
  afterInstall: function() {
    var _this = this;
    return _this.addAddonsToProject({
      packages: [
        { name: 'ember-browserify', target: '1.1.9' }
      ]
    }).then(function () {
      return _this.addPackagesToProject([
        { name: 'dexie', target: '1.3.6' },
        { name: 'node-uuid', target: '1.4.7' }
      ]);
    });
  },

  normalizeEntityName: function() {}
};
