/* globals module */
module.exports = {
  afterInstall: function() {
    var _this = this;
    return _this.addAddonsToProject({
      packages: [
        { name: 'ember-moment', target: '7.6.0' }
      ]
    }).then(function () {
      return _this.addPackagesToProject([
        { name: 'dexie', target: '2.0.2' },
        { name: 'node-uuid', target: '1.4.7' }
      ]);
    });
  },

  normalizeEntityName: function() {}
};
