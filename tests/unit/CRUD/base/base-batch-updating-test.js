import Ember from 'ember';
import generateUniqueId from 'ember-flexberry-data/utils/generate-unique-id';

export default function batchUpdating(store, assert) {
  assert.expect(14);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

      // Without relationships.
      .then((records) => {
        const user1Id = records.people[0];
        const user2Id = records.people[1];
        const user3Id = records.people[2];
        const suggTypeId = records.suggestionTypes[0];
        return Ember.RSVP.Promise.all([
          store.findRecord('ember-flexberry-dummy-application-user', user1Id)
            .then((returned1Record) => {
              returned1Record.set('name', 'Updated name for User 1');
              return returned1Record.save();
            }).then((returned1Record) => {
              returned1Record.set('name', 'User 1');
              return returned1Record;
            }),
          store.findRecord('ember-flexberry-dummy-application-user', user2Id)
            .then((returned2Record) => {
              returned2Record.set('name', 'User 2');
              return returned2Record;
            }),
          store.findRecord('ember-flexberry-dummy-application-user', user3Id)
            .then((returned3Record) => {
              returned3Record.deleteRecord();
              return returned3Record;
            }),
          store.createRecord('ember-flexberry-dummy-suggestion-type', {
            name: 'Sample for create and unmodified'
          }).save(),
          store.createRecord('ember-flexberry-dummy-suggestion-type', {
            id: generateUniqueId(),
            name: 'Sample for create'
          }),
          store.findRecord('ember-flexberry-dummy-suggestion-type', suggTypeId)
            .then((returnedRecord) => {
              returnedRecord.set('parent', null);
              return returnedRecord;
            })
        ])
          .then((recordsForBatch) => {
            const record1 = recordsForBatch[0];
            const record2 = recordsForBatch[1];
            const record3 = recordsForBatch[2];
            const record4 = recordsForBatch[3];
            const record5 = recordsForBatch[4];
            const record6 = recordsForBatch[5];
            return store.adapterFor('application').batchUpdate(store, Ember.A([record4, record2, record3, record1, record5, record6])).then((result) => {
              assert.equal(result.length, 6);

              assert.notOk(result[0].get('hasDirtyAttributes'));

              assert.notOk(result[1].get('hasDirtyAttributes'));
              assert.ok(result[1] === record2);

              assert.ok(result[2] === null);

              assert.notOk(result[3].get('hasDirtyAttributes'));
              assert.ok(result[3] === record1);

              assert.notOk(result[4].get('hasDirtyAttributes'));
              assert.ok(result[4] === record5);

              assert.notOk(result[5].get('hasDirtyAttributes'));
              assert.ok(result[5] === record6);
            });
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
          .then(() => {
            store.unloadAll();
            return store.findRecord('ember-flexberry-dummy-suggestion-type', suggTypeId)
              .then((suggTypeRecord) =>
                assert.ok(Ember.isNone(suggTypeRecord.get('parent')), 'Relationship change')
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
          people: createdRecords.slice(0, 3).map(item => item.get('id')),
          suggestionTypes: createdRecords.slice(3, 4).map(item => item.get('id'))
        })
      )
    );
}
