import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import { ConstParam, AttributeParam } from 'ember-flexberry-data/query/parameter';

export default function readingPredicatesSimplePredicatesWithMastersOperators(store, assert) {
  assert.expect(13);
  let done = assert.async();

  Ember.run(() => {
    let builderStrOp = null;
    let builderConstOp = null;

    initTestData(store)

    // Eq with master pk.
    .then(() => {
      let getRealIdBuilder = new QueryBuilder(store).from('ember-flexberry-dummy-suggestion-type').where('parent', '!=', null).orderBy('name').selectByProjection('SuggestionTypeL').top(1);
      return store.query('ember-flexberry-dummy-suggestion-type', getRealIdBuilder.build())
        .then((realParents) => {
          assert.equal(realParents.get('length'), 1);
          let realParentId = realParents.objectAt(0).get('parent.id');

          builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion-type').where('parent', '==', realParentId);
          builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion-type').where(new SimplePredicate(new AttributeParam('parent'), FilterOperator.Eq, new ConstParam(realParentId)));

          return runTest(store, [builderStrOp, builderConstOp], [
              ['Eq with master pk with operator | Data', 'Eq with master pk with operator | Length'],
              ['Eq with master pk with simple predicate | Data', 'Eq with master pk with simple predicate | Length']
            ],
            (data, messages) => {
              assert.ok(data.every(item => item.get('parent.id') === realParentId), messages[0]);
              assert.equal(data.get('length'), 1, messages[1]);
            }
          );
        });
    })

    // Eq with master pk among two AttributeParam.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion-type').where(new AttributeParam('parent'), '==', new AttributeParam('parent'));
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion-type').where(new SimplePredicate(new AttributeParam('parent'), FilterOperator.Eq, new AttributeParam('parent')));

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Eq with master pk among two AttributeParam with operator | Data', 'Eq with master pk among two AttributeParam with operator | Length'],
          ['Eq with master pk among two AttributeParam with simple predicate | Data', 'Eq with master pk among two AttributeParam with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('parent') !== null), messages[0]);
          assert.equal(data.get('length'), 6, messages[1]);
        }
      );
    })

    // Eq with two-level-master pk among two AttributeParam.
    .then(() => {
      builderStrOp = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion-type').where(new AttributeParam('parent'), '==', new AttributeParam('parent.parent')).selectByProjection('TwoLevelMaster');
      builderConstOp = new QueryBuilder(store, 'ember-flexberry-dummy-suggestion-type').where(new SimplePredicate(new AttributeParam('parent'), FilterOperator.Eq, new AttributeParam('parent.parent'))).selectByProjection('TwoLevelMaster');

      return runTest(store, [builderStrOp, builderConstOp], [
          ['Eq with two-level-master pk among two AttributeParam with operator | Data', 'Eq with two-level-master pk among two AttributeParam with operator | Length'],
          ['Eq with two-level-master pk among two AttributeParam with simple predicate | Data', 'Eq with two-level-master pk among two AttributeParam with simple predicate | Length']
        ],
        (data, messages) => {
          assert.ok(data.every(item => item.get('parent') === item.get('parent.parent')), messages[0]);
          assert.equal(data.get('length'), 1, messages[1]);
        }
      );
    })

    .catch((e) => {
      debugger;
      console.log(e, e.message);
      throw e;
    })
    .finally(done);
  });
}

function initTestData(store) {
  return Ember.RSVP.Promise.all([
    store.createRecord('ember-flexberry-dummy-suggestion-type', {
      name: 'Vasya1',
      moderated: false,
    }).save(),

    store.createRecord('ember-flexberry-dummy-suggestion-type', {
      name: 'Kolya2',
      moderated: true,
    }).save(),

    store.createRecord('ember-flexberry-dummy-suggestion-type', {
      name: 'Andrey3',
      moderated: false,
    }).save(),

    store.createRecord('ember-flexberry-dummy-suggestion-type', {
      name: 'CoolName',
      moderated: true,
    }).save()
  ])
  .then((sugAttrs) =>
    Ember.RSVP.Promise.all([
      store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'CoolName',
        moderated: true,
        parent: sugAttrs[3]
      }).save(),

      store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'X',
        moderated: false,
        parent: sugAttrs[1]
      }).save(),

      store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'Y',
        moderated: true,
        parent: sugAttrs[2]
      }).save()
    ])
  )
  .then((sugAttrs2) =>
    Ember.RSVP.Promise.all([
      store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'Z',
        moderated: false,
        parent: sugAttrs2[0]
      }).save(),

      store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'W',
        moderated: true,
        parent: sugAttrs2[1]
      }).save()
    ])
  )
  .then((sugAttrs3) =>
    Ember.RSVP.Promise.all([
      store.createRecord('ember-flexberry-dummy-suggestion-type', {
        name: 'ManyLevelMagic',
        moderated: false,
      }).save()
    ])
    .then((sugAttrs4) => {
      sugAttrs4[0].set('parent', sugAttrs4[0]);
      Ember.RSVP.Promise.all([
        sugAttrs4[0].save()
      ])
      }
    )
  );
}

function runTest(store, builders, messages, callback) {
  return store.query('ember-flexberry-dummy-suggestion-type', builders[0].build())
  .then((data1) => {
    callback(data1, messages[0]);
    return store.query('ember-flexberry-dummy-suggestion-type', builders[1].build())
    .then((data2) => callback(data2, messages[1]));
  });
}
