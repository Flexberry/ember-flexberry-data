import { getOwner } from '@ember/application';
import backup from '../../utils/backup';
import isObject from '../../utils/is-object';
import generateUniqueId from '../../utils/generate-unique-id';

/*
  Extend online adapter so that we can switch to offline adapter if errors occurred.
*/
export default function decorateAdapter(adapter, modelName) {
  if (adapter.get('flexberry')) {
    return adapter;
  }

  adapter.set('flexberry', {});

  let localAdapter = getOwner(this).lookup('store:local').adapterFor(modelName);

  // findRecord()
  // findAll()
  // query()
  // findMany()
  // createRecord()
  // updateRecord()
  // deleteRecord()
  let methods = [
    'findRecord', 'findAll', 'query', 'findMany',
    'createRecord', 'updateRecord', 'deleteRecord'
  ];

  let _this = this;
  methods.forEach(function(methodName) {
    decorateAdapterMethod.call(_this, adapter, localAdapter, methodName);
  });

  return adapter;
}

function decorateAdapterMethod(adapter, localAdapter, methodName) {
  let originMethod = adapter[methodName];
  let backupMethod = createBackupMethod(localAdapter, methodName);

  adapter[methodName] = function() {
    let offlineGlobals = getOwner(this).lookup('service:offline-globals');
    return originMethod.apply(adapter, arguments)
      .catch(backup(offlineGlobals.get('isModeSwitchOnErrorsEnabled'), backupMethod, arguments));
  };

  adapter.flexberry[methodName] = originMethod;
}

function createBackupMethod(localAdapter, methodName) {
  let crudMethods = ['createRecord', 'updateRecord', 'deleteRecord'];
  let isCRUD = crudMethods.indexOf(methodName) !== -1;
  let isCreate = methodName === 'createRecord';

  return function backupMethod() {
    //TODO: replace with ...args
    let args = Array.prototype.slice.call(arguments);

    // ---------- CRUD specific
    if (isCRUD) {
      let snapshot = args[2];

      if (isCreate) {
        snapshot = addIdToSnapshot(snapshot);
      }

      // createJobInSyncer(container, methodName, snapshot);

      // decorate snapshot for serializer#serialize, this should be after
      // createJob in syncer
      snapshot.flexberry = true;
      args[2] = snapshot;
    }

    // ---------- CRUD specific END

    return localAdapter[methodName].apply(localAdapter, args)
      .then(function(payload) {
        // decorate payload for serializer#extract
        if (isObject(payload)) {
          payload.flexberry = true;
        }

        return payload;
      });
  };
}

// Add an id to record before create in local
function addIdToSnapshot(snapshot) {
  let record = snapshot.record;
  record.get('store').updateId(record, { id: generateUniqueId() });
  return record._createSnapshot();
}
/*
function createJobInSyncer(container, methodName, snapshot) {
  let syncer = getOwner(this).lookup('syncer:main');
  syncer.createJob(methodName, snapshot);
}
*/
