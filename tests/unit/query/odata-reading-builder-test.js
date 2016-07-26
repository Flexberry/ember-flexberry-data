import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';

import startApp from '../../helpers/start-app';
import config from '../../../../dummy/config/environment';

if (config.APP.testODataService) {
  const randKey = Math.floor(Math.random() * 9999);
  const baseUrl = 'http://rtc-web:8081/odatatmp/ember' + randKey;
  const app = startApp();
  const store = app.__container__.lookup('service:store');

  const adapter = ODataAdapter.create();
  Ember.set(adapter, 'host', baseUrl);

  store.reopen({
    adapterFor() {
      return adapter;
    }
  });

  module('OData');

  test('reading | builder functions', (assert) => {
    assert.expect(9);
    let done = assert.async();

    Ember.run(() => {
      initTestData(store)

        // from.
        .then(() => {
          let builder = new QueryBuilder(store)
            .from('ember-flexberry-dummy-application-user')
            .where('name', '==', 'Vasya');
          return runTest(store, builder, (data) => {
            assert.ok(data.every(item => item.get('name') === 'Vasya') &&
              data.get('length') === 2, 'from');
          });
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
          return runTest(store, builder, (data) => {
            assert.equal(data.get('length'), 2, 'top');
          });
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

          return runTest(store, builder, (data) => {
            let isDataCorrect = true;
            for (let i = 0; i < data.get('length') && isDataCorrect; i++) {
              let curRecord = data.objectAt(i);
              let recordAttrs =  Object.keys(curRecord.get('data'));
              isDataCorrect = recordAttrs.join() === "name,karma";
            }
            
            assert.ok(isDataCorrect, 'select');
          });
        })

        // selectByProjection
        .then(() => {
          let builder = new QueryBuilder(store)
            .from('ember-flexberry-dummy-application-user')
            .selectByProjection('ApplicationUserL');

          store.unloadAll('ember-flexberry-dummy-application-user');

          return runTest(store, builder, (data) => {
            let isDataCorrect = true;
            for (let i = 0; i < data.get('length') && isDataCorrect; i++) {
              let curRecord = data.objectAt(i);
              let recordAttrs =  Object.keys(curRecord.get('data'));
              isDataCorrect = recordAttrs.join() === "name,eMail,activated,birthday,karma";
            }
            
            assert.ok(isDataCorrect, 'selectByProjection');
          });

        })
        .catch(e => console.log(e, e.message))
        .finally(done);
    });
  });
}

function initTestData(store) {
  return Ember.RSVP.Promise.all([
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
      birthday: new Date('05.09.1996'),
      karma: 4
    }).save()
  ]);
}

function runTest(store, builder, callback) {
  return store.query('ember-flexberry-dummy-application-user', builder.build())
    .then((data) => callback(data));
}
