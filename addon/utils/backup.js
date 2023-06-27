import RSVP from 'rsvp';

export default function backup(isModeSwitchOnErrorsEnabled, backupFn, args) {
  return function(error) {
    if (isModeSwitchOnErrorsEnabled) {
      return backupFn.apply(null, args);
    } else {
      return RSVP.reject(error);
    }
  };
}
