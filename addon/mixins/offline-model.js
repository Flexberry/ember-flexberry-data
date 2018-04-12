/**
  @module ember-flexberry-data
*/

import Mixin from '@ember/object/mixin';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import DS from 'ember-data';
import AuditModelMixin from './audit-model';

/**
  Mixin for Ember models.
  Adds metadata properties that can be used to resolve synchronization conflicts.
  Creation and changing date and time of record will be filled with current date and time on model saving.
  It's recommended to use this mixin when model class extends subclass of [DS.Model](http://emberjs.com/api/data/classes/DS.Model.html) or
  includes other mixins, i.e. it's not inherited directly from [DS.Model](http://emberjs.com/api/data/classes/DS.Model.html).
  Also it can be used explicitly when it is not necessary to use projections for particular model in application.
  If model class inherited directly from [DS.Model](http://emberjs.com/api/data/classes/DS.Model.html) and it's planned to use projections,
  then it's recommended to extend model class from {{#crossLink "Offline.Model"}}{{/crossLink}}.

  @class ModelMixin
  @namespace Offline
  @extends <a href="http://emberjs.com/api/classes/Ember.Mixin.html">Ember.Mixin</a>
  @public
*/
export default Mixin.create({
  /**
    Date and time of last sync down of model.

    @property syncDownTime
    @type Date
  */
  syncDownTime: DS.attr('date'),

  /**
    Flag to indicate that model synchronized in readonly mode.
    Readonly mode allows to prevent any modifications of model on client side or server side.

    @property readOnly
    @type Boolean
    @readOnly
  */
  readOnly: DS.attr('boolean'),

  /**
    Global instance of Syncer that contains methods to sync model up and down.

    @property syncer
    @type Syncer
    @readOnly
  */
  syncer: service('syncer'),

  /**
    Save the record and persist any changes to the record to an external source via the adapter.
    [More info](http://emberjs.com/api/data/classes/DS.Model.html#method_save).

    @method save
    @param {Object} [options]
    @return {Promise}
  */
  save() {
    let _this = this;
    let __super = _this._super;
    return new RSVP.Promise((resolve, reject) => {
      if (_this.get('readOnly')) {
        reject(new Error('Attempt to save readonly model instance.'));
      } else if (!_this.get('offlineGlobals.isOnline') && (_this.get('hasDirtyAttributes') || _this.hasChangedBelongsTo())) {
        _this.get('syncer').createJob(_this).then((auditEntity) => {
          __super.call(_this, ...arguments).then((record) => {
            if (!auditEntity.get('objectPrimaryKey')) {
              auditEntity.set('objectPrimaryKey', record.get('id'));
              auditEntity.save().then(() => {
                resolve(record);
              });
            } else {
              resolve(record);
            }
          }).catch((reason) => {
            auditEntity.destroyRecord().then(() => {
              reject(reason);
            });
          });
        }).catch((reason) => {
          reject(reason);
        });
      } else {
        resolve(__super.call(_this, ...arguments));
      }
    });
  },
}, AuditModelMixin);
