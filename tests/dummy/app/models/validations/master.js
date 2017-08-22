import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  text: DS.attr('string')
});

// Edit form projection.
Model.defineProjection('MasterL', 'validations/master', {
  text: Projection.attr('Text')
});

export default Model;
