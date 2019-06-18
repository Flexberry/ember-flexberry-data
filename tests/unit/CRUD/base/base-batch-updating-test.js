import Ember from 'ember';
import { Adapter } from 'ember-flexberry-data';
import startApp from '../../../helpers/start-app';

export default function batchUpdating(store, assert) {
  assert.expect(1);
  let done = assert.async();
  const app = startApp();
  const adapter = Adapter.Odata.create(app.__container__.ownerInjection());

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
            return adapter.batchUpdate(Ember.A([record1, record2]));
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
    )

    // Сreating suggestion.
    .then((sugAttrs) =>
      store.createRecord('ember-flexberry-dummy-suggestion', {
        type: sugAttrs[3],
        author: sugAttrs[0],
        editor1: sugAttrs[1]
      }).save()

        // Creating comment.
        .then((sug) =>
          Ember.RSVP.Promise.all([
            store.createRecord('ember-flexberry-dummy-comment', {
              author: sugAttrs[0],
              text: 'Comment 1',
              suggestion: sug,
            }).save(),

            store.createRecord('ember-flexberry-dummy-comment', {
              author: sugAttrs[0],
              text: 'Comment 2',
              suggestion: sug,
            }).save()
          ])

            // Creating votes.
            .then((comments) =>
              Ember.RSVP.Promise.all([
                store.createRecord('ember-flexberry-dummy-comment-vote', {
                  applicationUser: sugAttrs[1],
                  comment: comments[0]
                }).save(),

                store.createRecord('ember-flexberry-dummy-comment-vote', {
                  applicationUser: sugAttrs[2],
                  comment: comments[1]
                }).save(),
              ])

                .then((votes) =>
                  new Ember.RSVP.Promise((resolve) =>
                    resolve({
                      people: sugAttrs.slice(0, 3).map(item => item.get('id')),
                      comments: comments.map(item => item.get('id')),
                      votes: votes.map(item => item.get('id')),
                      sug: sug.get('id')
                    })
                  )
                )
            )
        )
    );
}
