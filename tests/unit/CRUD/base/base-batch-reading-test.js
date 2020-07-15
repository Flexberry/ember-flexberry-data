import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';

export default function batchReadingFunctions(store, assert) {
  Ember.run(() => {
    assert.expect(10);
    const done = assert.async();

    let createdRecords;
    let userId;
    initTestData(store)

    // byId.
    .then((records) => {
      createdRecords = records;
      userId = records[0].get('id');
      const builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .byId(userId);
      return runTest(store, builder, (data) => {
        assert.equal(data.get('length'), 1, 'byId | Length');
        assert.equal(data.get('firstObject.id'), userId, 'byId | Data');
      });
    })

    // find record.
    .then(() => {
      const modelName = 'ember-flexberry-dummy-application-user';
      const modelProjection = 'ApplicationUserL';
      return store.batchFindRecord(modelName, userId, modelProjection).then((record) => {
        assert.equal(record.get('id'), userId, 'find record | Data');
      });
    })

    // where.
    .then(() => {
      const builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .where('name', '==', 'VasyaBatch');
      return runTest(store, builder, (data) =>
        assert.ok(data.every(item => item.get('name') === 'VasyaBatch') && data.get('length') === 2, 'where')
      );
    })

    // orderBy.
    .then(() => {
      const builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .orderBy('karma');
      return runTest(store, builder, (data) => {
        let isDataCorrect = true;
        for (let i = 0; i < data.get('length') - 1 && isDataCorrect; i++) {
          if (data.objectAt(i).get('karma') > data.objectAt(i + 1).get('karma')) { isDataCorrect = false; }
        }

        assert.ok(isDataCorrect, 'orderBy | Data');
        assert.equal(data.get('length'), 3, 'orderBy | Length');
      });
    })

    // top.
    .then(() => {
      const builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .orderBy('karma')
        .top(2);
      return runTest(store, builder, (data) =>
        assert.equal(data.get('length'), 2, 'top')
      );
    })

    // skip.
    .then(() => {
      const builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .orderBy('karma')
        .skip(1);
      return runTest(store, builder, (data) => {
        assert.equal(data.get('firstObject.karma'), 4, 'skip | Data');
        assert.equal(data.get('length'), 2, 'skip | Length');
      });
    })

    // count.
    .then(() => {
      const builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .where('name', '==', 'VasyaBatch')
        .count();
      return runTest(store, builder, (data) => assert.equal(data.meta.count, 2, 'count'));
    })
    .catch((e) => {
      console.log(e, e.message);
      throw e;
    })
    .finally(() => {
      if (createdRecords) {
        Ember.RSVP.Promise.all(createdRecords.map(record => record.destroyRecord())).finally(done);
      } else {
        return done;
      }
    });
  });
}

function initTestData(store) {
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'VasyaBatch',
      eMail: '1@mail.ru',
      karma: 5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'VasyaBatch',
      eMail: '2@mail.ru',
      karma: 3
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'OlegBatch',
      eMail: '3@mail.ru',
      activated: true,
      karma: 4
    }).save()
  ]);
}

function runTest(store, builder, callback) {
  return store.batchQuery('ember-flexberry-dummy-application-user', builder.build())
  .then((data) => callback(data));
}
