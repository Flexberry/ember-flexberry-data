/**
  @module ember-flexberry-data
*/

import Ember from 'ember';

export default Ember.Service.extend({

  /* Current user name. */
  _currentUserName: null,

  /* Initialization of service. */
  init() {
    this._super(...arguments);

    // Set current user name on initialization.
    this.setCurrentUserName();
  },

  /**
  */
  getCurrentUser() {
    let store = Ember.getOwner(this).lookup('service:store');
    let _this = this;
    return store.query('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
      useOnlineStore: false,
    }).then((users) => {
      if (users.get('length')) {
        return new Ember.RSVP.resolve(users.get('firstObject'));
      } else {
        return store.createRecord('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
          name: _this.getCurrentUserName(),
          isUser: true,
          isGroup: false,
          isRole: false,
        }, false).save();
      }
    });
  },

  /**

    Returns current user name.

    @method getCurrentUserName
    @return {String} Current user name. Returns 'userName' as default value if `setCurrentUserName` method is not overridden.
  */
  getCurrentUserName() {
    return this._currentUserName;
  },

  /**

    Sets current user name.
    Method must be overridden if application uses some authentication.

    @method setCurrentUserName
  */
  setCurrentUserName() {
    // TODO: add mechanism to set name of current user. Name of current user should be set in `_currentUserName` property.
    this.set('_currentUserName', 'userName');
  },

});
