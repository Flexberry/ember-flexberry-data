/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import DS from 'ember-data';

/**
  Mixin for Ember models.
  Adds metadata properties that can be used to resolve synchronization conflicts.
  Creation and changing date and time of record will be filled with current date and time on model saving.
  It's recommended to use this mixin when model class extends subclass of [DS.Model](http://emberjs.com/api/data/classes/DS.Model.html) or
  includes other mixins, i.e. it's not inherited directly from [DS.Model](http://emberjs.com/api/data/classes/DS.Model.html).
  Also it can be used explicitly when it is not necessary to use projections for particular model in application.
  If model class inherited directly from [DS.Model](http://emberjs.com/api/data/classes/DS.Model.html) and it's planned to use projections,
  then it's recommended to extend model class from {{#crossLink "Offline.Model"}}{{/crossLink}}.

  @class ModelMixin
  @namespace Offline
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
  @public
*/
export default Ember.Mixin.create({
  /**
    Creation date and time of model.

    @property createTime
    @type Date
  */
  createTime: DS.attr('date'),
  /**
    Name of user who created model.

    @property creator
    @type String
  */
  creator: DS.attr('string'),
  /**
    Date and time of last changes in model.

    @property editTime
    @type Date
  */
  editTime: DS.attr('date'),
  /**
    Name of user who changed model last time.

    @property editor
    @type String
  */
  editor: DS.attr('string'),
  /**
    Date and time of last sync down of model.

    @property editTime
    @type Date
  */
  syncDownTime: DS.attr('date'),
  /**
    Flag to indicate that model synchronized in readonly mode.
    Readonly mode allows to prevent any modifications of model on client side or server side.

    @property readOnly
    @type Boolean
    @readOnly
  */
  readOnly: DS.attr('boolean'),

  /**
    Global instance of Syncer that contains methods to sync model up and down.

    @property syncer
    @type Syncer
    @readOnly
  */
  syncer: null,

  /*
    Model initialization.
  */
  init() {
    this._super(...arguments);

    let syncer = Ember.getOwner(this).lookup('syncer:main');
    this.set('syncer', syncer);
  },

  /*
    Overrides saving method of model to set metadata properties.
  */
  save: function() {
    if (Ember.isNone(this.get('readOnly')) || !this.get('readOnly')) {
      if (this.get('hasDirtyAttributes') && !this.get('isDeleted')) {
        let modifiedTime = new Date();
        if (Ember.isNone(this.get('readOnly'))) {
          this.set('readOnly', false);
        }

        if (this.get('isNew')) {
          this.set('createTime', modifiedTime);
        }

        this.set('editTime', modifiedTime);

        this._super(...arguments);
      }
    } else {
      throw new Error('Attempt to save readonly model \'' + this.get('modelName') + '\'');
    }
  }
});
