/**
  @module ember-flexberry-data
*/

import Ember from 'ember';

export default Ember.Service.extend({
  /**
  */
  getCurrentUser() {
    let store = Ember.getOwner(this).lookup('service:store');
    return store.query('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
      useOnlineStore: false,
    }).then((users) => {
      if (users.get('length')) {
        return new Ember.RSVP.resolve(users.get('firstObject'));
      } else {
        return store.createRecord('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent', {
          name: 'user',
          isUser: true,
          isGroup: false,
          isRole: false,
        }, false).save();
      }
    });
  },
});
