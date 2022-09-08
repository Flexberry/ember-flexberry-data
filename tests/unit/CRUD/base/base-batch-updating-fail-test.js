import Ember from 'ember';

export default function batchUpdateWithFail(store, assert) {
  assert.expect(1);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // Without relationships.
    .then((records) => {
      const userId = records.people;
      const sugTypeId = records.type;
      const suggestionId = records.suggestion;
      const commentId = records.comment;

      return Ember.RSVP.Promise.all([
        store.findRecord('ember-flexberry-dummy-application-user', userId)
          .then((returned1Record) => {
            Ember.set(returned1Record, 'name', 'Updated value');
            return returned1Record;
          }),
        store.findRecord('ember-flexberry-dummy-suggestion-type', sugTypeId)
          .then((returned2Record) => {
            Ember.set(returned2Record, 'name', 'Updated value');
            return returned2Record;
          }),
        store.findRecord('ember-flexberry-dummy-comment', commentId)
          .then((returned3Record) => {
            Ember.set(returned3Record, 'text', 'Test');
            return returned3Record;
          }),
        store.findRecord('ember-flexberry-dummy-suggestion', suggestionId)
          .then((returned4Record) => {
            return returned4Record;
          })
      ])
      .then((recordsForBatch) => {
        const recordUser = recordsForBatch[0];
        const recordType = recordsForBatch[1];
        const recordComment = recordsForBatch[2];
        const recordSuggestion = recordsForBatch[3];

        let done2 = assert.async();
        return store.batchUpdate(Ember.A([recordUser, recordSuggestion, recordComment, recordType]))
        .then(() => {
          // There should be an error on batch update.
          assert.ok(false, "There should be an error on batch update. This update should not be executed.");
        })
        .catch((e2) => {
          console.log(e2, "Batch update failed as expected. " + e2.message);
          assert.ok(true);
          recordSuggestion.destroyRecord();
          throw e2;
        })
        .finally(done2);
      })  
    })
    .catch((e) => {
      console.log(e, "Global error." + e.message);
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

      store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'Type 1',
        parent: parentType
      }).save()
    ])
  )

  // Сreating suggestion.
  .then((sugAttrs) =>
    Ember.RSVP.Promise.all([
      store.createRecord('ember-flexberry-dummy-suggestion', {
        type: sugAttrs[1],
        author: sugAttrs[0],
        editor1: sugAttrs[0]
      }).save(),

      store.createRecord('ember-flexberry-dummy-suggestion', {
        type: sugAttrs[1],
        author: sugAttrs[0],
        editor1: sugAttrs[0]
      }).save()
    ])

    // Creating comments.
    .then((sug) =>
      store.createRecord('ember-flexberry-dummy-comment', {
        id: "11111111-1111-1111-1111-111111111111",
        author: sugAttrs[0],
        text: 'No exception',
        suggestion: sug[0],
      }).save()

      // It is necessary to fill 'detail' at 'master' in offline.
      .then((commentItem) => store._isOnline() ? Ember.RSVP.resolve(commentItem) : sug.save().then(() => Ember.RSVP.resolve(commentItem)))

      // Returns.
      .then((commentItem) =>
        new Ember.RSVP.Promise(resolve =>
          resolve({
            people: Ember.get(sugAttrs[0], 'id'),
            type: Ember.get(sugAttrs[1], 'id'),
            suggestion: Ember.get(sug[0], 'id'),
            comment: Ember.get(commentItem, 'id')
          })
        )
      )
    )
  );
}
