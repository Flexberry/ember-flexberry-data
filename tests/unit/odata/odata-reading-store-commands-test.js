import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import executeTest from './execute-odata-CRUD-test';

executeTest('reading | store commands', (store, assert) => {
  assert.expect(4);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // findRecord.
    .then((people) => {
      store.unloadAll();
      let id = people[0].get('id');
      return store.findRecord('ember-flexberry-dummy-application-user', id);
    })
    .then((data) =>
      assert.equal(data.get('name'), 'User 1', 'findRecord')
    )

    // findAll.
    .then(() => {
      store.unloadAll();
      return store.findAll('ember-flexberry-dummy-application-user');
    })
    .then((data) =>
      assert.equal(data.get('length'), 4, 'findAll')
    )

    // query.
    .then(() => {
      store.unloadAll();
      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .selectByProjection('ApplicationUserE')
        .where('name', '==', 'User 2');
      return store.query('ember-flexberry-dummy-application-user', builder.build());
    })
    .then((data) => {
      assert.ok(data.every(item => item.get('name') === 'User 2'), 'query | Data');
      assert.equal(data.get('length'), 2, 'query | Length');
    })

    // queryRecord.
    // Not working!
    .then(() => {
      store.unloadAll();
      let builder = new QueryBuilder(store)
        .from('ember-flexberry-dummy-application-user')
        .selectByProjection('ApplicationUserE')
        .where('name', '==', 'User 2');
      return store.queryRecord('ember-flexberry-dummy-application-user', builder.build())
      .then((record) =>
        assert.equal(record.get('name'), 'User 2', 'queryRecord')
      );
    })
    .catch(e => console.log(e, e.message))
    .finally(done);
  });
});

function initTestData(store) {
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 1',
      eMail: '1@mail.ru'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 2',
      eMail: '2@mail.ru'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 2',
      eMail: '2.5@mail.ru'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'User 3',
      eMail: '3@mail.ru'
    }).save()
  ]);
}
