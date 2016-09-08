import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.findRecord('ember-flexberry-dummy-suggestion', params.id);
  }
});
