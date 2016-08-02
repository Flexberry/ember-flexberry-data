/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import DS from 'ember-data';

/**
  @class AuditModelMixin
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

  _snapshots: [],

  _userService: Ember.inject.service('user'),

  /*
    Overrides saving method of model to set metadata properties.
  */
  save() {
    let now = new Date();
    if (this.get('isNew')) {
      this.set('createTime', now);
      this.set('creator', this.get('_userService').getName());
    } else {
      this.set('editTime', now);
      this.set('editor', this.get('_userService').getName());
    }

    // TODO: changes in relations
    this._snapshots.push({ date: now, attrs: this.changedAttributes() });

    console.log(this._internalModel);

    return this._super(...arguments);
  }
});
