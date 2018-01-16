/**
  @module ember-flexberry-data
*/

import Ember from 'ember';
import DS from 'ember-data';

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
    Name of current user.

    @property currentUserName
    @readOnly
  */
  currentUserName: Ember.computed(function() {
    let userService = Ember.getOwner(this).lookup('service:user');
    return userService.getCurrentUserName();
  }).readOnly(),

  /**
    Save the record and persist any changes to the record to an external source via the adapter.
    [More info](http://emberjs.com/api/data/classes/DS.Model.html#method_save).

    @method save
    @param {Object} [options]
    @return {Promise}
  */
  save() {
    let currentDate = new Date();
    let currentUser = this.get('currentUserName');
    if (this.get('isNew')) {
      this.set('createTime', currentDate);
      this.set('creator', currentUser);
    }

    if (this.get('hasDirtyAttributes') && !this.get('isDeleted')) {
      this.set('editTime', currentDate);
      this.set('editor', currentUser);
    }

    return this._super(...arguments);
  },
});
