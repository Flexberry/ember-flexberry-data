import Route from '@ember/routing/route';

export default class SuggestionRoute extends Route {
  model(params) {
    return this.store.findRecord('ember-flexberry-dummy-suggestion', params.id);
  }
}
