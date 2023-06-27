/**
  @module ember-flexberry-data
*/

import Service from '@ember/service';
import RSVP from 'rsvp';
import { getOwner } from '@ember/application';

export default Service.extend({
  /**
  */
  getCurrentUser() {
    let store = getOwner(this).lookup('service:store');
    let _this = this;
    return store.query('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
      useOnlineStore: false,
    }).then((users) => {
      if (users.get('length')) {
        return new RSVP.resolve(users.get('firstObject'));
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
    Method must be overridden if application uses some authentication.

    @method getCurrentUserName
    @return {String} Current user name. Returns 'userName' as default value if method is not overridden.
  */
  getCurrentUserName() {
    // TODO: add mechanism to return name of current user.
    return 'userName';
  }
});
