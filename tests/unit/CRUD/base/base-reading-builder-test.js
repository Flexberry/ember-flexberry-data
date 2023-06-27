import { run } from '@ember/runloop';
import RSVP from 'rsvp';
import QueryBuilder from 'ember-flexberry-data/query/builder';

export default function readingBuilderFunctions(store, assert) {
  assert.expect(10);
  let done = assert.async();

  run(() => {
    initTestData(store)

    // byId.
    .then((records) => {
      let userId = records.people[0];
      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .byId(userId);
      return runTest(store, builder, (record) => {
        assert.equal(record.get('firstObject.id'), userId, 'byId');
      });
    })

    // from.
    .then(() => {
      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .where('name', '==', 'Vasya');
      return runTest(store, builder, (data) =>
        assert.ok(data.every(item => item.get('name') === 'Vasya') && data.get('length') === 2, 'from')
      );
    })

    // orderBy.
    .then(() => {
      let builder = new QueryBuilder(store)
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
      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .orderBy('karma')
        .top(2);
      return runTest(store, builder, (data) =>
        assert.equal(data.get('length'), 2, 'top')
      );
    })

    // skip.
    .then(() => {
      let builder = new QueryBuilder(store)
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
      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .where('name', '==', 'Vasya')
        .count();
      return runTest(store, builder, (data) => assert.equal(data.meta.count, 2, 'count'));
    })

    // select
    .then(() => {
      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .select('id, name, karma');

      store.unloadAll('ember-flexberry-dummy-application-user');

      return runTest(store, builder, (data) =>
        assert.ok(data.every(item => Object.keys(item.get('data')).join() === 'name,karma'), 'select')
      );
    })

    // selectByProjection
    .then(() => {
      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .selectByProjection('ApplicationUserL');

      store.unloadAll('ember-flexberry-dummy-application-user');

      return runTest(store, builder, (data) =>
        assert.ok(data.every(item => Object.keys(item.get('data')).join() === 'name,eMail,activated,birthday,gender,karma'), 'selectByProjection')
      );

    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e, e.message);
      throw e;
    })
    .finally(done);
  });
}

function initTestData(store) {
  return RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '1@mail.ru',
      karma: 5
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Vasya',
      eMail: '2@mail.ru',
      karma: 3
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Oleg',
      eMail: '3@mail.ru',
      activated: true,
      karma: 4
    }).save()
  ])

  .then((people) =>
    new RSVP.Promise((resolve) =>
      resolve({
        people: people.map(item => item.get('id'))
      })
    )
  );
}

function runTest(store, builder, callback) {
  return store.query('ember-flexberry-dummy-application-user', builder.build())
  .then((data) => callback(data));
}
