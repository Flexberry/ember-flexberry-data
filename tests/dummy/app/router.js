import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  constructor() {
    super(...arguments);

    this.location = config.locationType;
    this.rootURL = config.rootURL;
  }
}

Router.map(function() {
  this.route('suggestion', { path: 'suggestion/:id' });
});
