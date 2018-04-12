/**
  @module ember-flexberry-data
*/

import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import { getOwner } from '@ember/application';
import { computed } from '@ember/object';
import DS from 'ember-data';

export default Mixin.create({
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
  currentUserName: computed(function() {
    let userService = getOwner(this).lookup('service:user');
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
    let superFunc = this._super;
    let _this = this;

    let currentUserPromise = new RSVP.Promise((resolve, reject) => {
      let userName = this.get('currentUserName');
      if (userName instanceof RSVP.Promise) {
        userName.then(name => {
          resolve(name);
        }).catch((reason) => {
          reject(reason);
        });
      }

      resolve(userName);
    });

    return currentUserPromise.then(currentUser => {
      if (_this.get('isNew')) {
        _this.set('createTime', currentDate);
        _this.set('creator', currentUser);
      }

      if (_this.get('hasDirtyAttributes') && !_this.get('isDeleted')) {
        _this.set('editTime', currentDate);
        _this.set('editor', currentUser);
      }

      let result = superFunc.apply(_this, ...arguments);
      if (!(result instanceof RSVP.Promise)) {
        result = RSVP.resolve();
      }

      return result;
    });
  },
});
