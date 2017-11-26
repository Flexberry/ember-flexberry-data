import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

export default Ember.Controller.extend({

  variable: 'undefined',

  actions: {
    click() {
      let store = this.get('store');
      let modelName = 'ember-flexberry-dummy-suggestion';
      let innerPredicate = new Query.SimplePredicate('Address', Query.FilterOperator.Eq, 'Street, 200');
      console.log(innerPredicate);

      let notPredicate = new Query.NotPredicate(innerPredicate);

      //console.log(notPredicate);
      let builder = new Query.Builder(store, modelName).where(innerPredicate).select('Address,Date,Votes,Type,Author');
      store.query(modelName, builder.build());

      //console.log(store.query('ember-flexberry-dummy-suggestion', ));

    }
  }
});
