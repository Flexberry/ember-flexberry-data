import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  flag: DS.attr('boolean'),

  master: DS.belongsTo('validations/master', {
    inverse: null,
    async: false
  }),

  details: DS.hasMany('validations/detail', {
    inverse: 'aggregator',
    async: false
  }),

  // Model validation rules.
  validations: {
    flag: {
      presence: {
        message: 'Flag is required'
      },
      inclusion: {
        in: [true],
        message: 'Flag must be \'true\' only'
      }
    },
    master: {
      presence: {
        message: 'Master is required'
      }
    }
  }
});

// Edit form projection.
Model.defineProjection('BaseE', 'validations/base', {
  flag: Projection.attr('Flag'),
  master: Projection.belongsTo('validations/master', 'Master', {
    text: Projection.attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
  details: Projection.hasMany('validations/detail', 'details', {
    number: Projection.attr('Number')
  })
});

export default Model;
