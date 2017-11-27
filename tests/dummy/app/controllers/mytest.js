import Ember from 'ember';
import { Query } from 'ember-flexberry-data';

export default Ember.Controller.extend({

  variable: 'undefined',

  actions: {
    click() {
      let store = this.get('store');
      let modelName = 'ember-flexberry-dummy-suggestion';

      //let innerPredicate = new Query.SimplePredicate('address', Query.FilterOperator.Eq, 'Street, 200');

      // let sp1 = new Query.SimplePredicate('address', Query.FilterOperator.Eq, 'Street, 200');
      // let sp2 = new Query.SimplePredicate('date', Query.FilterOperator.Eq, '11.09.2017');
      // let innerPredicate = new Query.ComplexPredicate(Query.Condition.Or, sp1, sp2);

      let innerPredicate = new Query.StringPredicate('address').contains('Street');
      
      console.log(innerPredicate);

      let notPredicate = new Query.NotPredicate(innerPredicate);

      console.log(notPredicate.toString());
      let builder = new Query.Builder(store, modelName).selectByProjection('SuggestionL').where(notPredicate);
      console.log(store.query(modelName, builder.build()));

      //.where(innerPredicate).

    }
  }
});
