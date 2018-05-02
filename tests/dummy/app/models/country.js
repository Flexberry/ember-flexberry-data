import DS from 'ember-data';
import Model from 'ember-flexberry-data/models/model';

let Country = Model.extend({
  Name: DS.attr('string')
});

export default Country;
