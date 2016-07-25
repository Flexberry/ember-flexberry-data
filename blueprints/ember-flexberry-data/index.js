/*jshint node:true*/
module.exports = {
  description: 'Adds necessary packages to application',

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  afterInstall: function(options) {
    var _this = this;
    return this.addBowerPackagesToProject([
      { name: 'localforage', target: '1.3.3' }
    ]).then(function() {
      return _this.addAddonsToProject({
        packages: [
          { name: 'ember-browserify', target: '1.1.9' },
          { name: 'dexie', target: '1.3.6' },
          'https://github.com/Flexberry/ember-localforage-adapter.git'
        ]
      });
    });
  },

  normalizeEntityName: function() {}
};
