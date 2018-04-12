import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
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
  flag: attr('Flag'),
  master: belongsTo('validations/master', 'Master', {
    text: attr('Text', {
      hidden: true
    })
  }, {
    displayMemberPath: 'text'
  }),
  details: hasMany('validations/detail', 'details', {
    number: attr('Number')
  })
});

export default Model;
