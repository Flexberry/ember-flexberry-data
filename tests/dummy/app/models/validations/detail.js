import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  aggregator: DS.belongsTo('validations/base', {
    inverse: 'details',
    async: false
  }),

  number: DS.attr('number'),

  // Model validation rules.
  validations: {
    number: {
      presence: {
        message: 'Number is required'
      },
      numericality: {
        odd: true,
        messages: {
          numericality: 'Number is invalid',
          odd: 'Number must be an odd'
        }
      }
    }
  }
});

// Edit form projection.
Model.defineProjection('DetailE', 'validations/detail', {
  number: Projection.attr('Number')
});

export default Model;
