/* globals module */
module.exports = {
  afterInstall: function() {
    var _self = this;
    return this.addBowerPackagesToProject([
      { name: 'localforage', target: '1.3.3' }
    ]).then(function() {
      return _self.addAddonsToProject({
        packages: [
          'https://github.com/Flexberry/ember-localforage-adapter.git',
          { name: 'ember-browserify', target: '1.1.9' }
        ]
      });
    }).then(function () {
      return _self.addPackagesToProject([
        { name: 'dexie', target: '1.3.6' }
      ]);
    });
  },

  normalizeEntityName: function() {}
};
