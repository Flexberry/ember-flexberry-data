import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Tag = Projection.Model.extend({
  Name: DS.attr('string'),
  Creator: DS.belongsTo('creator', {
    inverse: 'Tags',
    async: false,
    polymorphic: true
  })
});

export default Tag;
