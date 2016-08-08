import Ember from 'ember';
import QueryBuilder from 'ember-flexberry-data/query/builder';
import executeTest from './execute-odata-CRUD-test';
import { SimplePredicate } from 'ember-flexberry-data/query/predicate';
import FilterOperator from 'ember-flexberry-data/query/filter-operator';

function initTestData(store) {
    return Ember.RSVP.Promise.all([
        store.createRecord('decimal-number', {
            decimalNumber: 555.5
        }).save(),

        // store.createRecord('decimal-number', {
        //     decimalNumber: '555.5'
        // }).save(),

        store.createRecord('decimal-number', {
            decimalNumber: 444.4
        }).save(),

        // store.createRecord('decimal-number', {
        //     decimalNumber: '444.4'
        // }).save()
    ]);
}

executeTest('reading | decimal', (store, assert) => {
    //assert.expect(8);
    let done = assert.async();

    Ember.run(() => {
        initTestData(store)

            .then(() => {
                let builder = new QueryBuilder(store, 'decimal-number')
                    .where('decimalNumber', FilterOperator.Eq, 555.5);
                return store.query('decimal-number', builder.build())
                    .then((data) => {
                        assert.equal(data.get('length'), 1);
                        assert.equal(data.any(item => item.get('decimal-number'), 555.5));
                    });
            })

            .then(() => {
                let builder = new QueryBuilder(store, 'decimal-number')
                    .where('decimalNumber', FilterOperator.Neq, 555.5);
                return store.query('decimal-number', builder.build())
                    .then((data) => {
                        assert.equal(data.get('length'), 1);
                        assert.equal(data.any(item => item.get('decimal-number'), 444.4));
                    });
            })

            .then(() => {
                let builder = new QueryBuilder(store, 'decimal-number')
                    .where('decimalNumber', FilterOperator.Ge, 444.4);
                return store.query('decimal-number', builder.build())
                    .then((data) => {
                        assert.equal(data.get('length'), 1);
                        assert.equal(data.any(item => item.get('decimal-number'), 555.5));
                    });
            })

            .then(() => {
                let builder = new QueryBuilder(store, 'decimal-number')
                    .where('decimalNumber', FilterOperator.Geq, 444.4);
                return store.query('decimal-number', builder.build())
                    .then((data) => {
                        assert.equal(data.get('length'), 2);
                        //assert.equal(data.any(item => item.get('decimal-number'), 555.5));
                    });
            })

            .then(() => {
                let builder = new QueryBuilder(store, 'decimal-number')
                    .where('decimalNumber', FilterOperator.Le, 555.5);
                return store.query('decimal-number', builder.build())
                    .then((data) => {
                        assert.equal(data.get('length'), 1);
                        assert.equal(data.any(item => item.get('decimal-number'), 444.4));
                    });
            })

            .then(() => {
                let builder = new QueryBuilder(store, 'decimal-number')
                    .where('decimalNumber', FilterOperator.Leq, 555.5);
                return store.query('decimal-number', builder.build())
                    .then((data) => {
                        assert.equal(data.get('length'), 2);
                        //assert.equal(data.any(item => item.get('decimal-number'), 444.4));
                    });
            })

            .catch(e => console.log(e, e.message))
            .finally(done);
    });
});