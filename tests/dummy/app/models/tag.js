import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';

let Tag = EmberFlexberryDataModel.extend({
  Name: DS.attr('string'),
  Creator: DS.belongsTo('creator', {
    inverse: 'Tags',
    async: false,
    polymorphic: true
  })
});

export default Tag;
