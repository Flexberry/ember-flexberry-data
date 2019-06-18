import Ember from 'ember';

export default function batchUpdating(store, assert) {
  assert.expect(1);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

      // Without relationships.
      .then((records) => {
        let user1Id = records.people[0];
        let user2Id = records.people[1];
        return Ember.RSVP.Promise.all([
          store.findRecord('ember-flexberry-dummy-application-user', user1Id)
            .then((returned1Record) => {
              returned1Record.set('name', 'User 1');
              return returned1Record;
            }),
          store.findRecord('ember-flexberry-dummy-application-user', user2Id)
            .then((returned2Record) => {
              returned2Record.set('name', 'User 2');
              return returned2Record;
            }),
        ])
          .then((recordsForBatch) => {
            let record1 = recordsForBatch[0];
            let record2 = recordsForBatch[1];
            return store.adapterFor().batchUpdate(Ember.A([record1, record2]));
          })
          .then(() => {
            store.unloadAll();
            return store.findRecord('ember-flexberry-dummy-application-user', user1Id)
              .then((edited1Record) =>
                assert.equal(edited1Record.get('name'), 'User 1', 'Without relationships')
              );
          })
          .then(() => {
            store.unloadAll();
            return store.findRecord('ember-flexberry-dummy-application-user', user2Id)
              .then((edited2Record) =>
                assert.equal(edited2Record.get('name'), 'User 2', 'Without relationships')
              );
          })
          .then(() => records);
      })
      .catch((e) => {
        console.log(e, e.message);
        throw e;
      })
      .finally(done);
  });
}

function initTestData(store) {
  // Parent type
  return store.createRecord('ember-flexberry-dummy-suggestion-type', {
    name: 'Parent type'
  }).save()

    // Attrs for creating suggestion.
    .then((parentType) =>
      Ember.RSVP.Promise.all([
        store.createRecord('ember-flexberry-dummy-application-user', {
          name: 'Vasya',
          eMail: '1@mail.ru',
        }).save(),

        store.createRecord('ember-flexberry-dummy-application-user', {
          name: 'Kolya',
          eMail: '2@mail.ru',
        }).save(),

        store.createRecord('ember-flexberry-dummy-application-user', {
          name: 'Oleg',
          eMail: '3@mail.ru',
        }).save(),

        store.createRecord('ember-flexberry-dummy-suggestion-type', {
          name: 'Type 1',
          parent: parentType
        }).save()
      ])
    ).then((createdRecords) =>
      new Ember.RSVP.Promise((resolve) =>
        resolve({
          people: createdRecords.slice(0, 3).map(item => item.get('id'))
        })
      )
    );
}
