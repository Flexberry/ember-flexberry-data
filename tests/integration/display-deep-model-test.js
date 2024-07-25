import { later } from '@ember/runloop';
import { module, test, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit, find } from '@ember/test-helpers';
import Dexie from 'dexie';

let storeDisplayDeepModel;
const dbNameDisplayDeepModel = 'TestDbDDM';

module('Display deep model', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function(assert) {
    let done = assert.async();

    storeDisplayDeepModel = this.owner.lookup('service:store');
    storeDisplayDeepModel.offlineStore.dbName = dbNameDisplayDeepModel;
    let offlineSchema = {};
    offlineSchema[dbNameDisplayDeepModel] = {
      1: storeDisplayDeepModel.offlineSchema.TestDB['0.1']
    };
    storeDisplayDeepModel.offlineSchema = offlineSchema;
    let offlineGlobals = this.owner.lookup('service:offline-globals');
    offlineGlobals.setOnlineAvailable(false);

    let dexieService = this.owner.lookup('service:dexie');
    let db = dexieService.dexie(dbNameDisplayDeepModel, storeDisplayDeepModel);
    Dexie.delete(dbNameDisplayDeepModel).then(() => {
      db.open().then((db) => {
        let promises = [];
        promises.push(db.table('ember-flexberry-dummy-suggestion').put({
          id: 'fea5b275-cb9b-4584-ba04-26122bc8cbd3',
          address: 'Street, 20',
          text: 'Loooong text',
          date: new Date(2016, 5, 13),
          votes: 1,
          moderated: false,
          type: 'de627522-47c3-428f-99be-fdac2e8f5618',
          author: '555a6d25-ac76-417c-bcc5-25bc260fc3ae',
          editor1: null,
          files: [],
          userVotes: ['8be0d89b-8cab-4b0b-b029-356c59809163'],
          comments: ['7e5d3b63-eb5e-446e-84da-26865f87c1c5']
        }));
        promises.push(db.table('ember-flexberry-dummy-suggestion-type').bulkPut([
          {
            id: 'de627522-47c3-428f-99be-fdac2e8f5618',
            name: '123',
            moderated: false,
            parent: 'afe58e47-b3aa-474d-b475-427ff5394c44',
            localizedTypes: []
          },
          {
            id: 'afe58e47-b3aa-474d-b475-427ff5394c44',
            name: 'Type #8',
            moderated: false,
            parent: null,
            localizedTypes: []
          }
        ]));
        promises.push(db.table('ember-flexberry-dummy-application-user').put({
          id: '555a6d25-ac76-417c-bcc5-25bc260fc3ae',
          name: 'Васиииилий',
          eMail: 'pupkin1@mail.ru',
          phone1: '+790356568933',
          phone2: '',
          phone3: '+790356568935',
          activated: true,
          vK: '',
          facebook: '',
          twitter: '',
          birthday: new Date(1997, 5, 11),
          gender: 'Male',
          vip: true,
          karma: 11.4
        }));
        promises.push(db.table('ember-flexberry-dummy-vote').put({
          id: '8be0d89b-8cab-4b0b-b029-356c59809163',
          suggestion: 'fea5b275-cb9b-4584-ba04-26122bc8cbd3',
          voteType: 'Like',
          applicationUser: '555a6d25-ac76-417c-bcc5-25bc260fc3ae'
        }));
        promises.push(db.table('ember-flexberry-dummy-comment').put({
          id: '7e5d3b63-eb5e-446e-84da-26865f87c1c5',
          suggestion: 'fea5b275-cb9b-4584-ba04-26122bc8cbd3',
          text: 'Not ok',
          votes: 566,
          moderated: false,
          author: '555a6d25-ac76-417c-bcc5-25bc260fc3ae',
          userVotes: ['721e65db-9e04-47a3-8f29-3b5c39fff8dd']
        }));
        promises.push(db.table('ember-flexberry-dummy-comment-vote').put({
          id: '721e65db-9e04-47a3-8f29-3b5c39fff8dd',
          comment: '7e5d3b63-eb5e-446e-84da-26865f87c1c5',
          voteType: 'Dislike',
          applicationUser: '555a6d25-ac76-417c-bcc5-25bc260fc3ae'
        }));
        return new Dexie.Promise.all(promises).then(() => {
          db.close();
          return Dexie.Promise.resolve();
        });
      }).finally(done);
    }).catch(done);
  });

  skip('find suggestion', async function (assert) {
    assert.expect(8);

    await visit('/suggestion/fea5b275-cb9b-4584-ba04-26122bc8cbd3');

    let done = assert.async();
    later(function() {
      assert.equal(find('div.address').textContent, 'Street, 20');
      assert.equal(find('div.votes').textContent, '1');
      assert.equal(find('div.author').textContent, 'Васиииилий');
      assert.equal(find('div.type').textContent, '123');
      assert.equal(find('div.parent-type').textContent, 'Type #8');
      assert.equal(find('div.comment').textContent, 'Not ok');
      assert.equal(find('div.comment-author').textContent, 'Васиииилий');
      assert.equal(find('div.comment-vote-type').textContent, 'Dislike');

      done();
    }, 300);
  });
});
