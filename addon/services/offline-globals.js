import Ember from 'ember';

/**
  @module ember-flexberry-data
*/

/**
  Service for operate with global online and offline properties and events.

  @class GlobalsService
  @namespace Offline
  @extends Ember.Service
  @public
*/
export default Ember.Service.extend(Ember.Evented, {
  /**
    Availability of the backend.
    @property isOnline
    @type Boolean
    @default false
    @readOnly
  */
  isOnline: false,

  /**
    Possibility of using offline storage.
    Gets from application config.
    @property isOfflineEnabled
    @type Boolean
    @default true
    @readOnly
  */
  isOfflineEnabled: true,

  /**
    If true then perform switch to offline mode when got online connection errors.
    Gets from application config.
    @property isModeSwitchOnErrorsEnabled
    @type Boolean
    @default false
    @readOnly
  */
  isModeSwitchOnErrorsEnabled: false,

  /**
    If true then all work with records will sync down when online.
    This let user to continue work without online connection.
    Gets from application config.
    @property isSyncDownWhenOnlineEnabled
    @type Boolean
    @default true
    @readOnly
  */
  isSyncDownWhenOnlineEnabled: true,

  /**
    Trigger for "online is available" or "online is unavailable" event.
    Event name: online/offline.

    @method setOnlineAvailable

    @param {Boolean} isOnline Availability of online to set.
  */
  setOnlineAvailable(isOnline) {
    this.set('isOnline', isOnline);
    let eventName = isOnline ? 'online' : 'offline';
    this.trigger(eventName);
  },

  /**
    Get online status.
    Always returns 'true' by default.
    Needs for overload when using on mobile devices.

    @method checkOnlineAvailable

    @return {Boolean} Returns online status on current device.
  */
  checkOnlineAvailable() {
    return true;
  },

  /*
    Service initialization.
  */
  init() {
    this._super(...arguments);
    let app = Ember.getOwner(this).application;

    if (app.offline) {
      //Reading offline settings from application seetings in `environment.js`.
      this._setOption('isOfflineEnabled', app.offline.offlineEnabled);
      this._setOption('isModeSwitchOnErrorsEnabled', app.offline.modeSwitchOnErrorsEnabled);
      this._setOption('isSyncDownWhenOnlineEnabled', app.offline.syncDownWhenOnlineEnabled);
    }

    //Detect availability of online connection at start of application.
    let isOnlineAvailable = this.checkOnlineAvailable();
    this.setOnlineAvailable(isOnlineAvailable);
  },

  /*
    Helper method for setting class properties with offline options.
  */
  _setOption: function(optionName, optionValue) {
    if (!Ember.isNone(optionValue)) {
      this.set(optionName, optionValue);
    }
  }
});
