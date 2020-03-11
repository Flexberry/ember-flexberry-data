import { run } from '@ember/runloop';
import { A } from '@ember/array';
import { Promise } from 'rsvp';

export default function associationBatchUpdating(store, assert) {
  assert.expect(6);
  let done = assert.async();

  run(() => {
    initTestData(store)

      // Without relationships.
      .then((records) => {
        const suggTypeParentId = records.suggestionTypes[0];
        const suggType1Id = records.suggestionTypes[1];
        const suggType2Id = records.suggestionTypes[2];
        return Promise.all([
          store.findRecord('ember-flexberry-dummy-suggestion-type', suggTypeParentId)
            .then((returnedParentRecord) =>
              store.findRecord('ember-flexberry-dummy-suggestion-type', suggType1Id)
              .then((returned1Record) => {
                returned1Record.set('parent', returnedParentRecord);
                return returned1Record;
              })
            ),

          store.findRecord('ember-flexberry-dummy-suggestion-type', suggType2Id)
            .then((returned2Record) => {
              returned2Record.set('name', 'Updated name for Type 2');
              return returned2Record;
            }),

          store.findRecord('ember-flexberry-dummy-suggestion-type', suggTypeParentId)
            .then((returnedParentRecord) => {
              returnedParentRecord.set('name', 'Updated name for Parent');
              return returnedParentRecord;
            }),
        ])
          .then((recordsForBatch) => {
            const record1 = recordsForBatch[0];
            const record2 = recordsForBatch[1];
            const record3 = recordsForBatch[2];

            return store.batchUpdate(A([record1, record2, record3])).then((result) => {
              assert.equal(result.length, 3);

              assert.ok(result[0] === record1);
              assert.ok(result[1] === record2);
              assert.ok(result[2] === record3);

              assert.ok(result[0].get('parent') === record3);
              assert.ok(result[1].get('parent') === record3);
            });
          });
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
      Promise.all([
        parentType,

        store.createRecord('ember-flexberry-dummy-suggestion-type', {
          name: 'Type 1',
          parent: null
        }).save(),

        store.createRecord('ember-flexberry-dummy-suggestion-type', {
          name: 'Type 2',
          parent: parentType
        }).save()
      ])
    ).then((createdRecords) =>
      new Promise((resolve) =>
        resolve({
          suggestionTypes: createdRecords.slice(0, 3).map(item => item.get('id'))
        })
      )
    );
}
