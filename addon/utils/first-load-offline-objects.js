/**
  @module ember-flexberry-data
*/

import RSVP from 'rsvp';
import $ from 'jquery';

/**
  Load and save offline objects provided by odata function or returns objects count.
  Tables with objects to load must be empty.

  @function firstLoadOfflineObjects
  @param {Object} dexieDB Dexie DB (example: dexieService.dexie('DB name', store)).
  @param {String} odataPath Odata Url (example: 'http://localhost:35904/odata').
  @param {String} functionName Odata function name.
  @param {String} modelName Model name for objects.
  @param {Bool} count Flag indicates that function returns objects or objects count.
  @param {Integer} top Amount of objects to load.
  @param {Integer} skip Amount of objects to skip from result.
  @param {String} idPath Path to string id in JSON ('guid' by default).
  @return {Promise}
*/
export function firstLoadOfflineObjects(dexieDB, odataPath, functionName, modelName, count = false, top = 0, skip = 0, idPath = 'guid') {
  return new RSVP.Promise(function(resolve, reject) {
    $.ajax({
      method: 'GET',
      url: `${odataPath}/${functionName}(objToLoad='${modelName}',top=${top},skip=${skip},count=${count})`,
    }).done(function(msg) {
      let objs = JSON.parse(msg.value);
      if (!isNaN(+objs)) {
        return resolve(+objs);
      }

      let objArray = [];
      if (objs[modelName] instanceof Array) {
        Array.prototype.push.apply(objArray, objs[modelName]);
      } else {
        objArray.push(objs);
      }

      objArray.map(record => {
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

      dexieDB.table(modelName).bulkPut(objArray).then(() => resolve(), () => reject());
    }).fail(function() {
      return reject(modelName);
    });
  });
}
