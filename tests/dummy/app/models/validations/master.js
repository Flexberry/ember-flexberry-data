import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  text: DS.attr('string')
});

// Edit form projection.
Model.defineProjection('MasterL', 'validations/master', {
  text: attr('Text')
});

export default Model;
