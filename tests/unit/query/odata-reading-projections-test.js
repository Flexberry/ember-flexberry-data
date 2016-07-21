import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';

import startApp from '../../helpers/start-app';
import config from '../../../../dummy/config/environment';

if (config.APP.testODataService) {
  const randKey = Math.floor(Math.random() * 999);
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

  test('123', assert => {
          assert.ok(true);
    let done = assert.async();

    Ember.run(() => {
      Ember.RSVP.Promise.all([
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
        .then((sugAttrsValues) => {
          store.createRecord('ember-flexberry-dummy-suggestion', {
            type: sugAttrsValues.find(item => item.get('name') === 'Type 1'),
            author: sugAttrsValues.find(item => item.get('name') === 'Andrey'),
            editor1: sugAttrsValues.find(item => item.get('name') === 'Andrey')
          }).save()
            // Creating comments.
            .then((sug) => {
              Ember.RSVP.Promise.all([
                store.createRecord('ember-flexberry-dummy-comment', {
                  author: sugAttrsValues.find(item => item.get('name') === 'Andrey'),
                  text: 'Comment',
                  suggestion: sug
                }).save()

              ])

                // Eq null for master field.
                .then(() => {
                let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
                    .where('author.phone1', '==', null);
                store.query('ember-flexberry-dummy-comment', builder.build())
                  .then((data) => {
                      assert.equal(data.get('length'), 1, 'Eq null for master field length');
                      assert.ok(data.get('firstObject').get('name') === 'Andrey', 
                      'Eq null for master field');
                  });
                })

                // Reading by master field.
                .then(() => {
                  let id = sugAttrsValues.find(item => item.get('name') === 'Andrey').get('id');
                  let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
                    .where('author.id', '==', id)
                    .selectByProjection('CommentE');

                  store.query('ember-flexberry-dummy-comment', builder.build())
                  .then((data) => {
                    assert.equal(data.get('length'), 2, 'Reading by master field length');
                    assert.ok(data.every( item => item.get('author.name') === 'Vasya'),
                      'Reading by master field data');
                  });
                }); 
            });
        });
    });         
  });
}