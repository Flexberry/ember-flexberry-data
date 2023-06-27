import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';

let Model = EmberFlexberryDataModel.extend({
  pole: DS.attr('string')
});

export default Model;
