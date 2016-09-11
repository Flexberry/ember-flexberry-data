import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Country = Projection.Model.extend({
  Name: DS.attr('string')
});

export default Country;
