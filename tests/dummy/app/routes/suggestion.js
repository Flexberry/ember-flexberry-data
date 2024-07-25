import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SuggestionRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('ember-flexberry-dummy-suggestion', params.id).then(function(user) {
      return user;
  });
  }
}
