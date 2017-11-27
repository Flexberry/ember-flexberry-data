import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('suggestion', { path: 'suggestion/:id' });
  this.route('mytest');
});

export default Router;
