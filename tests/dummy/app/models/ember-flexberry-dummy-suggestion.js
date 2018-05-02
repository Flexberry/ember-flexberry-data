import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo, hasMany } from 'ember-flexberry-data/utils/attributes';

var Model = EmberFlexberryDataModel.extend({
  address: DS.attr('string'),
  text: DS.attr('string'),
  date: DS.attr('date'),
  votes: DS.attr('number'),
  moderated: DS.attr('boolean'),

  // This property is for flexberry-lookup component. No inverse relationship here.
  type: DS.belongsTo('ember-flexberry-dummy-suggestion-type', {
    inverse: null,
    async: false
  }),

  // This property is for flexberry-lookup component. No inverse relationship here.
  author: DS.belongsTo('ember-flexberry-dummy-application-user', {
    inverse: null, async: false
  }),

  // This property is for flexberry-lookup component. No inverse relationship here.
  editor1: DS.belongsTo('ember-flexberry-dummy-application-user', {
    inverse: null,
    async: false
  }),

  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  files: DS.hasMany('ember-flexberry-dummy-suggestion-file', {
    inverse: 'suggestion',
    async: false
  }),

  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  userVotes: DS.hasMany('ember-flexberry-dummy-vote', {
    inverse: 'suggestion',
    async: false
  }),

  // This property is for flexberry-groupedit component.
  // Inverse relationship is necessary here.
  comments: DS.hasMany('ember-flexberry-dummy-comment', {
    inverse: 'suggestion',
    async: false
  }),
});

// Edit form projection.
Model.defineProjection('SuggestionE', 'ember-flexberry-dummy-suggestion', {
  address: attr('Address'),
  text: attr('Text'),
  date: attr('Date'),
  votes: attr('Votes'),
  moderated: attr('Moderated'),
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  editor1: belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  files: hasMany('ember-flexberry-dummy-suggestion-file', 'Files', {
    order: attr('Order'),
    file: attr('File')
  }),
  userVotes: hasMany('ember-flexberry-dummy-vote', 'User votes', {
    voteType: attr('Vote type'),
    author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: attr('Name', {
        hidden: true
      }),
      eMail: attr('Email')
    }, {
      displayMemberPath: 'name'
    })
  }),
  comments: hasMany('ember-flexberry-dummy-comment', 'Comments', {
    text: attr('Text'),
    votes: attr('Votes'),
    moderated: attr('Moderated'),
    author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
      name: attr('Name', {
        hidden: true
      })
    }, {
      displayMemberPath: 'name'
    })
  })
});

// List form projection.
Model.defineProjection('SuggestionL', 'ember-flexberry-dummy-suggestion', {
  address: attr('Address'),
  text: attr('Text'),
  date: attr('Date'),
  votes: attr('Votes'),
  moderated: attr('Moderated'),
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  }),
  author: belongsTo('ember-flexberry-dummy-application-user', 'Author', {
    name: attr('Name', {
      hidden: true
    }),
    eMail: attr('Email')
  }, {
    displayMemberPath: 'name'
  }),
  editor1: belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup example on settings example.
Model.defineProjection('SettingLookupExampleView', 'ember-flexberry-dummy-suggestion', {
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup example on window customization.
Model.defineProjection('CustomizeLookupWindowExampleView', 'ember-flexberry-dummy-suggestion', {
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup with limit function example.
Model.defineProjection('LookupWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion', {
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup in dropdown mode example.
Model.defineProjection('DropDownLookupExampleView', 'ember-flexberry-dummy-suggestion', {
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for FlexberryObjectlistviewComponent with limit function example.
Model.defineProjection('FolvWithLimitFunctionExampleView', 'ember-flexberry-dummy-suggestion', {
  address: attr('Address'),
  text: attr('Text'),
  votes: attr('Votes'),
  moderated: attr('Moderated'),
  type: belongsTo('ember-flexberry-dummy-suggestion-type', 'Type', {
    name: attr('Name', {
      hidden: true
    })
  }, {
    displayMemberPath: 'name'
  })
});

// Projection for lookup in block form.
Model.defineProjection('LookupInBlockFormView', 'ember-flexberry-dummy-suggestion', {
  editor1: belongsTo('ember-flexberry-dummy-application-user', 'Editor', {
    name: attr('name', { hidden: true }),
    eMail: attr('eMail', { hidden: true }),
    gender: attr('gender', { hidden: true })
  }, {
    displayMemberPath: 'name'
  })
});

export default Model;
