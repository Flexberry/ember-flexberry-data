import Ember from 'ember';
import { module, test } from 'qunit';

import QueryBuilder from 'ember-flexberry-data/query/builder';
import ODataAdapter from 'ember-flexberry-data/adapters/odata';
import { DetailPredicate, StringPredicate, SimplePredicate } from 'ember-flexberry-data/query/predicate';



import startApp from '../../helpers/start-app';
import config from '../../../../dummy/config/environment';

if (config.APP.testODataService) {
  const randKey = Math.floor(Math.random() * 999);
  const baseUrl = 'http://localhost:6500/odatatmp/ember' + randKey;
  //'http://rtc-web:8081/odatatmp/ember' + randKey;
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

  test ('reading | by master PK', assert => {
    let done = assert.async();

    Ember.run( () => {

      // Attrs for creating suggestion.
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
          name: 'Andrey',
          eMail: '3@mail.ru',
        }).save(),

        store.createRecord('ember-flexberry-dummy-application-user', {
          name: 'Oleg',
          eMail: '4@mail.ru',
        }).save(),

        store.createRecord('ember-flexberry-dummy-suggestion-type', {
          name: 'Type 1',
        }).save()
      ])

      // Сreating suggestion.
      .then( (sugAttrsValues) => {
        store.createRecord('ember-flexberry-dummy-suggestion', {
          type: sugAttrsValues.find( item => item.get('name') === 'Type 1'),
          author: sugAttrsValues.find( item => item.get('name') === 'Vasya'),
          editor1: sugAttrsValues.find( item => item.get('name') === 'Kolya')
        }).save()

        // Creating comments.
        .then( (sug) => {
          Ember.RSVP.Promise.all([
            store.createRecord('ember-flexberry-dummy-comment', {
              author: sugAttrsValues.find( item => item.get('name') === 'Vasya'),
              text: 'Comment 1',
              suggestion: sug,
            }).save(),

            store.createRecord('ember-flexberry-dummy-comment', {
              author: sugAttrsValues.find( item => item.get('name') === 'Vasya'),
              text: 'Comment 2',
              suggestion: sug
            }).save(),

            store.createRecord('ember-flexberry-dummy-comment', {
              author: sugAttrsValues.find( item => item.get('name') === 'Kolya'),
              text: 'Comment 3',
              suggestion: sug
            }).save(),

            store.createRecord('ember-flexberry-dummy-comment', {
              author: sugAttrsValues.find( item => item.get('name') === 'Kolya'),
              text: 'Comment 4',
              suggestion: sug
            }).save()

          ])
                      
          // Creating votes.
          .then( (comments) => {
            Ember.RSVP.Promise.all([
              store.createRecord('ember-flexberry-dummy-comment-vote', {
                applicationUser: sugAttrsValues.find( item => item.get('name') === 'Oleg'),
                comment: comments.find( item => item.get('text') === 'Comment 1')
              }).save(),
              store.createRecord('ember-flexberry-dummy-comment-vote', {
                applicationUser: sugAttrsValues.find( item => item.get('name') === 'Andrey'),
                comment: comments.find( item => item.get('text') === 'Comment 1')
              }).save(),
              store.createRecord('ember-flexberry-dummy-comment-vote', {
                applicationUser: sugAttrsValues.find( item => item.get('name') === 'Andrey'),
                comment: comments.find( item => item.get('text') === 'Comment 1')
              }).save(),
              store.createRecord('ember-flexberry-dummy-comment-vote', {
                applicationUser: sugAttrsValues.find( item => item.get('name') === 'Oleg'),
                comment: comments.find( item => item.get('text') === 'Comment 2')
              }).save(),
              store.createRecord('ember-flexberry-dummy-comment-vote', {
                applicationUser: sugAttrsValues.find( item => item.get('name') === 'Kolya'),
                comment: comments.find( item => item.get('text') === 'Comment 2')
              }).save(),
              store.createRecord('ember-flexberry-dummy-comment-vote', {
                applicationUser: sugAttrsValues.find( item => item.get('name') === 'Oleg'),
                comment: comments.find( item => item.get('text') === 'Comment 3')
              }).save()

            ])
            // Tests.

            // Reading by master field.
            .then( () => {
              assert.equal(sugAttrsValues.length, 5, 'Init data');
              let id = sugAttrsValues.find( item => item.get('name') === 'Vasya').get('id');
              let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
                .where('author.id', '==', id);
                //selectByProjection('CommentD');

              store.query('ember-flexberry-dummy-application-user', builder.build())
              .then( (data) => {
              	assert.ok(
                  data.get('length') === 2,
                  //data.every( item => item.get('author.name') === 'Vasya'),
                  'Reading by master field'
                );
              });
            }) 


            // Reading with master restrictions.
            .then( () => {
              let commentId = comments.find( 
                  item => item.get('text') === 'Comment 3' && 
                  item.get('author.name') === 'Kolya' 
                ).get('id');

              let sp1 = new StringPredicate('author.name').contains('Kolya'); 
              let sp2 = new StringPredicate('text').contains('Comment 3'); 
              let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
                .where(sp1.and(sp2));

              store.query('ember-flexberry-dummy-application-user', builder.build())
              .then( (data) => {
                assert.ok(
                  data.get('firstObject').get('id') === commentId, 
                  'Restrictions on master fields'
                );              
              });
            }) 

            // Reading with detail restrictions.
            .then( () => {
              let dp = new DetailPredicate('userVotes')
                .all(new StringPredicate('applicationUser.name').contains('Oleg'));
              let builder = new QueryBuilder(store, 'ember-flexberry-dummy-comment')
                .where(dp);

              store.query('ember-flexberry-dummy-comment', builder.build())
              //Error: "Field 'applicationUser' not found at model 'ember-flexberry-dummy-comment' "
              .then( (data) => {
                assert.ok(
                  data.get('length') === 3, 
                  //data.every( item => item.get('author.name') === 'Vasya')
                  'Restrictions on details fields'
                );
              });
            }) 
            .catch(e => console.log(e, e.message))
            .finally(done);
          });
        });
      });
    });
  });
}       
