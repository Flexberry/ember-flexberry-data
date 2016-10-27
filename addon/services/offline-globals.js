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
    If true then record will be synced down completely, i.e. including with all related records with arbitrary nesting.
    Otherwise only requested record will be synced down without related records.
    If set to true then it may cause errors in case of loops are present in model structure.
    Gets from application config.
    @property allowSyncDownRelatedRecordsWithoutProjection
    @type Boolean
    @default false
    @readOnly
  */
  allowSyncDownRelatedRecordsWithoutProjection: false,

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
      this._setOption('isOfflineEnabled', app.offline.offlineEnabled ? true : false);
      this._setOption('isModeSwitchOnErrorsEnabled', app.offline.modeSwitchOnErrorsEnabled ? true : false);
      this._setOption('isSyncDownWhenOnlineEnabled', app.offline.syncDownWhenOnlineEnabled ? true : false);
      this._setOption('allowSyncDownRelatedRecordsWithoutProjection', app.offline.allowSyncDownRelatedRecordsWithoutProjection ? true : false);
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
