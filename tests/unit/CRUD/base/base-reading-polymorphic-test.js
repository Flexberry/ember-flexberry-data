import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';

export default function readingDataTypes(store, assert) {
  assert.expect(7);
  let done = assert.async();

  Ember.run(() => {
    initTestData(store)

    // String.
    .then(() => {
      store.unloadAll();
      let builder = new QueryBuilder(store, 'ember-flexberry-dummy-test-poly').selectByProjection('TestPolyEdit').orderBy('selfPole');

      return store.query('ember-flexberry-dummy-test-poly', builder.build())
      .then((data) => {
        assert.equal(data.get('length'), 2, 'Reading model with polymorphic relationship | Length');
        let testPoly1 = data.objectAt(0);
        let testPoly2 = data.objectAt(1);
        let relationPole1 = testPoly1.get('relation.pole');
        let relationPole2 = testPoly2.get('relation.pole');
        let modelName1 = testPoly1.get('relation').constructor.modelName;
        let modelName2 = testPoly2.get('relation').constructor.modelName;
        assert.equal(testPoly1.get('selfPole'), 'Self pole 1', `Reading model with polymorphic relationship | Own field of record 1`);
        assert.equal(relationPole1, 'Base pole another child', `Reading model with polymorphic relationship | Polymorphic relation of record 1`);
        assert.equal(testPoly2.get('selfPole'), 'Self pole 2', `Reading model with polymorphic relationship | Own field of record 2`);
        assert.equal(relationPole2, 'Base pole child', `Reading model with polymorphic relationship | Polymorphic relation of record 2`);
        assert.equal(modelName1, 'ember-flexberry-dummy-test-poly-another-child', `Reading model with polymorphic relationship | Model name of record 1`);
        assert.equal(modelName2, 'ember-flexberry-dummy-test-poly-child', `Reading model with polymorphic relationship | Model name of record 2`);
      });
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
  return Ember.RSVP.Promise.all([
    new Ember.RSVP.Promise((resolve, reject) =>
      store.createRecord('ember-flexberry-dummy-test-poly-another-child', {
        pole: 'Base pole another child',
        childAnotherPole: true,
      }).save()

      .then((polyBase) =>
        store.createRecord('ember-flexberry-dummy-test-poly', {
          selfPole: 'Self pole 1',
          relation: polyBase,
        }).save().then(resolve, reject), reject)
    ),

    new Ember.RSVP.Promise((resolve, reject) =>
      store.createRecord('ember-flexberry-dummy-test-poly-child', {
        pole: 'Base pole child',
        childPole: 10,
      }).save()

      .then((polyChild) =>
        store.createRecord('ember-flexberry-dummy-test-poly', {
          selfPole: 'Self pole 2',
          relation: polyChild,
        }).save().then(resolve, reject), reject)
    ),
  ]);
}
