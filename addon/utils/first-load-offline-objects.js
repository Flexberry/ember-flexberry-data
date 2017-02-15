/**
  @module ember-flexberry-data
*/

import Ember from 'ember';

/**
  Load and save offline objects provided by GetJsonForOffline odata function.
  Tables with objects to load must be empty.

  @function firstLoadOfflineObjects
  @param {Object} dexieDB Dexie DB (example: dexieService.dexie('DB name', store)).
  @param {String} odataPath Odata Url (example: 'http://localhost:35904/odata').
  @param {String} idPath Path to string id in JSON ('guid' by default).
  @return {Promise}
*/
export function firstLoadOfflineObjects(dexieDB, odataPath, idPath = 'guid') {
  return new Ember.RSVP.Promise(function(resolve, reject) {
    Ember.$.ajax({
      method: 'GET',
      url: `${odataPath}/GetJsonForOffline`
    }).done(function(msg) {
      let promises = [];
      let objs = JSON.parse(msg.value);
      for (let objType in objs) {
        let objArray = [];
        if (objs[objType] instanceof Array) {
          Array.prototype.push.apply(objArray, objs[objType]);
        } else {
          objArray.push(objs[objType]);
        }
        objArray.map(record =>
          {
            if (idPath) {
              record.id =  record.id[idPath];
            }

            for (let key in record) {
              if (record[key] && record[key].id) {
                record[key] = idPath ? record[key].id[idPath] : record[key].id;
              }

              if (record[key] instanceof Array) {
                for (let i = 0; i < record[key].length; i++) {
                  if (record[key][i].id) {
                    record[key][i] = idPath ? record[key][i].id[idPath] : record[key][i].id;
                  }
              }
            }
          }
        });
        promises.push(dexieDB.table(objType).bulkAdd(objArray));
      }

      Ember.RSVP.all(promises).then(() => resolve(), () => reject());
    });
  });
}
