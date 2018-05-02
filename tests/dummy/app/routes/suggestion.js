import Route from '@ember/routing/route';

export default Route.extend({
  model: function(params) {
    return this.store.findRecord('ember-flexberry-dummy-suggestion', params.id);
  }
});
