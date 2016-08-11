/* globals module */
module.exports = {
  afterInstall: function() {
    var _this = this;
    return this.addBowerPackagesToProject([
      { name: 'localforage', target: '1.3.3' }
    ]).then(function() {
      return _this.addAddonsToProject({
        packages: [
          'https://github.com/Flexberry/ember-localforage-adapter.git',
          { name: 'ember-browserify', target: '1.1.9' }
        ]
      });
    }).then(function () {
      return _this.addPackagesToProject([
        { name: 'dexie', target: '1.3.6' },
        { name: 'node-uuid', target: '1.4.7' }
      ]);
    });
  },

  normalizeEntityName: function() {}
};
