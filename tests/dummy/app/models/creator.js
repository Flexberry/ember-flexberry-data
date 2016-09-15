import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Creator = Projection.Model.extend({
  Name: DS.attr('string'),
  Age: DS.attr('number')
});

export default Creator;
