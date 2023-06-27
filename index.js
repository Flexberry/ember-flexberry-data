'use strict';

module.exports = {
  name: 'ember-flexberry-data',

  included: function(app) {
    this._super.apply(this._super, arguments);

    app.import('vendor/ember-flexberry-data/register-version.js');
  }
};
