import Ember from 'ember';

var RSVP = Ember.RSVP;

/*
  This method saves specified models by type in offline storage.
  Optionally it allows to reload all specified records from online storage.
  All models will be replaced in local storage.

  @method reloadLocalRecords
  @param {String|DS.Model} type
  @param {Boolean} reload
  @param {String} [projectionName]
  @return {Promise} Promise
  @private
*/
export function reloadLocalRecords(type, reload, projectionName) {
  var store = Ember.getOwner(this).lookup('service:store');
  var modelType = store.modelFor(type);
  let modelName = modelType.modelName;

  var localStore = Ember.getOwner(this).lookup('store:local');
  var localAdapter = localStore.adapterFor(modelName);

  var reloadedRecords = localAdapter.findAll(localStore, modelType)
    .then(deleteAll)
    .then(createAll);

  return reloadedRecords;

  function deleteAll(localRecords) {
    var deletedRecords = localRecords.map(function(record) {
      return localAdapter.deleteRecord(localStore, modelType, { id: record.id });
    });

    return RSVP.all(deletedRecords);
  }

  function createAll() {
    var projection = Ember.isNone(projectionName) ? null : modelType.projections[projectionName];
    if (reload) {
      let options = {
        reload: true,
        useOnlineStore: true
      };
      options = Ember.isNone(projectionName) ? options : Ember.$.extend(true, options, { projection: projectionName });
      return store.findAll(type, options).then(function(records) {
        return createLocalRecords(store, localAdapter, localStore, modelType, records, projection);
      });
    } else {
      var records = store.peekAll(type);
      return createLocalRecords(store, localAdapter, localStore, modelType, records, projection);
    }
  }
}

function createLocalRecord(store, localAdapter, localStore, modelType, record, projection) {
  if (record.get('id')) {
    var snapshot = record._createSnapshot();
    return localAdapter.updateOrCreate(localStore, modelType, snapshot).then(function() {
      return syncDownRelatedRecords(store, record, localAdapter, localStore, projection);
    });
  } else {
    var recordName = record.constructor && record.constructor.modelName;
    var warnMessage = 'Record ' + recordName + ' does not have an id, therefor we can not create it locally: ';

    var recordData = record.toJSON && record.toJSON();

    Ember.Logger.warn(warnMessage, recordData);

    return RSVP.resolve();
  }
}

function createLocalRecords(store, localAdapter, localStore, modelType, records, projection) {
  var createdRecords = records.map(function(record) {
    return createLocalRecord(store, localAdapter, localStore, modelType, record, projection);
  });
  return RSVP.all(createdRecords);
}

export function syncDownRelatedRecords(store, mainRecord, localAdapter, localStore, projection) {
  function isEmbedded(store, modelType, relationshipName) {
    var serializerAttrs = store.serializerFor(modelType.modelName).get('attrs');
    return serializerAttrs[relationshipName] &&
    ((serializerAttrs[relationshipName].deserialize && serializerAttrs[relationshipName].deserialize === 'records') ||
    (serializerAttrs[relationshipName].embedded && serializerAttrs[relationshipName].embedded === 'always'));
  }

  function isAsync(modelType, relationshipName) {
    return Ember.get(modelType, 'relationshipsByName').get(relationshipName).options.async;
  }

  function createRelatedBelongsToRecord(store, relatedRecord, localAdapter, localStore, projection) {
    let modelType = store.modelFor(relatedRecord.constructor.modelName);
    return createLocalRecord(store, localAdapter, localStore, modelType, relatedRecord, projection);
  }

  function createRelatedHasManyRecords(store, relatedRecords, localAdapter, localStore, projection) {
    let promises = Ember.A();
    for (let i = 0; i < relatedRecords.get('length'); i++) {
      let relatedRecord = relatedRecords.objectAt(i);
      let modelType = store.modelFor(relatedRecord.constructor.modelName);
      promises.pushObject(createLocalRecord(store, localAdapter, localStore, modelType, relatedRecord, projection));
    }

    return promises;
  }

  function createRelatedRecords(store, mainRecord, localAdapter, localStore, projection) {
    var promises = Ember.A();
    var modelType = store.modelFor(mainRecord.constructor.modelName);
    var attrs = Ember.isNone(projection) ? null : projection.attributes;
    var relationshipNames = Ember.get(modelType, 'relationshipNames');
    var createRelatedBelongsToRecordFunction = (relatedRecord) => {
      if (!Ember.isNone(relatedRecord)) {
        promises.pushObject(createRelatedBelongsToRecord(store, relatedRecord, localAdapter, localStore, Ember.isNone(attrs) ? null : attrs[belongToName]));
      }
    };

    for (let i = 0; i < relationshipNames.belongsTo.length; i++) {
      var belongToName = relationshipNames.belongsTo[i];

      // Save related record into local store only if relationship included into projection (if projection is set).
      if (Ember.isNone(projection) || (attrs && attrs.hasOwnProperty(belongToName))) {
        let async = isAsync(modelType, belongToName);
        if (async) {
          mainRecord.get(belongToName).then(createRelatedBelongsToRecordFunction);
        } else {
          if (isEmbedded(store, modelType, belongToName)) {
            var relatedRecord = mainRecord.get(belongToName);
            if (!Ember.isNone(relatedRecord)) {
              promises.pushObject(
                createRelatedBelongsToRecord(store, relatedRecord, localAdapter, localStore, Ember.isNone(attrs) ? null : attrs[belongToName])
              );
            }
          }
        }
      }
    }

    var createRelatedHasManyRecordsFunction = (relatedRecords) =>
      promises.pushObjects(createRelatedHasManyRecords(store, relatedRecords, localAdapter, localStore, Ember.isNone(attrs) ? null : attrs[hasManyName]));

    for (let i = 0; i < relationshipNames.hasMany.length; i++) {
      var hasManyName = relationshipNames.hasMany[i];

      // Save related records into local store only if relationship included into projection (if projection is set).
      if (Ember.isNone(projection) || (attrs && attrs.hasOwnProperty(hasManyName))) {
        let async = isAsync(modelType, hasManyName);
        if (async) {
          mainRecord.get(hasManyName).then(createRelatedHasManyRecordsFunction);
        } else {
          if (isEmbedded(store, modelType, hasManyName)) {
            var relatedRecords = mainRecord.get(hasManyName);
            promises.pushObjects(createRelatedHasManyRecords(store, relatedRecords, localAdapter, localStore, Ember.isNone(attrs) ? null : attrs[hasManyName]));
          }
        }
      }
    }

    return RSVP.all(promises);
  }

  return createRelatedRecords(store, mainRecord, localAdapter, localStore, projection);
}
