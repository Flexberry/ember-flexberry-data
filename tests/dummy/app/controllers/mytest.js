import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

export default Ember.Controller.extend({

  variable: 'undefined',

  actions: {
    click() {
      let store = this.get('store');
      //let builder = new Query.Builder(store).from('ember-flexberry-dummy-suggestion').selectByProjection('FlexberryObjectlistviewCustomFilter');
      let builder = new Query.Builder(store).from('ember-flexberry-dummy-suggestion').selectByProjection('FlexberryObjectlistviewCustomFilter');

      console.log(store.query('ember-flexberry-dummy-suggestion', builder.build()));

    }
  }
});
