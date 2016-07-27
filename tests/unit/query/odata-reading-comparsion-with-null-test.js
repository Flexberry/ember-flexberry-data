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

  test('reading | comparsion with null', (assert) => {
    assert.expect(8);
    let done = assert.async();

    Ember.run(() => {
      initTestData(store)

        // Eq null for own field.
        .then(() => {
          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
            .where('phone1', '==', null);
          return store.query('ember-flexberry-dummy-application-user', builder.build())
            .then((data) => {
              assert.equal(data.get('length'), 1, 'Eq null for own field | Length');
              assert.ok(data.any(item => item.get('name') === 'Andrey'),
                'Eq null for own field | Data');
            });
        })

        // Neq null for own field.
        .then(() => {
          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-application-user')
            .where('phone1', '!=', null);
          return store.query('ember-flexberry-dummy-application-user', builder.build())
            .then((data) => {
              assert.equal(data.get('length'), 2, 'Neq null for own field | Length');
              assert.ok(
                data.any(item => item.get('name') === 'Vasya') &&
                data.any(item => item.get('name') === 'Kolya'),
                'Neq null for own field | Data');
            });
        })

        // Eq null for master field.
        .then(() => {
          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
            .where('author.phone1', '==', null);
          return store.query('ember-flexberry-dummy-comment', builder.build())
            .then((data) => {
              assert.equal(data.get('length'), 1, 'Eq null for master field | Length');
              assert.ok(data.get('firstObject.author.name') === 'Andrey',
                'Eq null for master field | Data');
            });
        })

        // Neq null for master field.
        .then(() => {
          let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
            .where('author.phone1', '!=', null);
          return store.query('ember-flexberry-dummy-comment', builder.build())
            .then((data) => {
              assert.equal(data.get('length'), 2, 'Neq null for master field | Length');
              assert.ok(
                data.any(item => item.get('author.name') === 'Vasya') &&
                data.any(item => item.get('author.name') === 'Kolya'),
                  'Neq null for master field | Data');
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
      phone1: '89652345434'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Kolya',
      eMail: '2@mail.ru',
      phone1: '89212345434'
    }).save(),

    store.createRecord('ember-flexberry-dummy-application-user', {
      name: 'Andrey',
      eMail: '3@mail.ru',
      phone1: null
    }).save(),

    store.createRecord('ember-flexberry-dummy-suggestion-type', {
      name: 'Type 1',
    }).save()
  ])

    // Сreating suggestion.
    .then((sugAttrsValues) => 
      store.createRecord('ember-flexberry-dummy-suggestion', {
        type: sugAttrsValues.find(item => item.get('name') === 'Type 1'),
        author: sugAttrsValues.find(item => item.get('name') === 'Vasya'),
        editor1: sugAttrsValues.find(item => item.get('name') === 'Kolya')
      }).save()

        // Creating comments.
        .then((sug) => 
          Ember.RSVP.Promise.all([
            store.createRecord('ember-flexberry-dummy-comment', {
              author: sugAttrsValues.find(item => item.get('name') === 'Vasya'),
              text: 'Comment 1',
              suggestion: sug,
            }).save(),

            store.createRecord('ember-flexberry-dummy-comment', {
              author: sugAttrsValues.find(item => item.get('name') === 'Kolya'),
              text: 'Comment 2',
              suggestion: sug
            }).save(),

            store.createRecord('ember-flexberry-dummy-comment', {
              author: sugAttrsValues.find(item => item.get('name') === 'Andrey'),
              text: 'Comment 3',
              suggestion: sug
            }).save()
          ])
        )
    );
}
