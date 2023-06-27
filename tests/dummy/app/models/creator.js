import DS from 'ember-data';
import Model from 'ember-flexberry-data/models/model';

let Creator = Model.extend({
  Name: DS.attr('string'),
  Age: DS.attr('number'),
  Country: DS.belongsTo('country', {
    inverse: null,
    async: false
  })
});

export default Creator;
