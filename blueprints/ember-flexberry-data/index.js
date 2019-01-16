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
        { name: 'dexie', target: '1.4.2' },
        { name: 'node-uuid', target: '1.4.7' },
        { name: 'ember-moment', target: '6.0.0' }
      ]);
    });
  },

  normalizeEntityName: function() {}
};
