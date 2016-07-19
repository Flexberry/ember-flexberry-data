import Ember from 'ember';

export default function backup(isModeSwitchOnErrorsEnabled, backupFn, args) {
  return function(error) {
    if (isModeSwitchOnErrorsEnabled) {
      return backupFn.apply(null, args);
    } else {
      return Ember.RSVP.reject(error);
    }
  };
}
