import Ember from 'ember';
import DS from 'ember-data';
import { Offline } from 'ember-flexberry-data';

export default Offline.Store.extend({
  init() {
    this.set('offlineSchema', {
      TestDB: {
        0.1: {
          'ember-flexberry-dummy-suggestion': 'id,address,text,date,votes,moderated,type,author,editor1,*files,*userVotes,*comments',
          'ember-flexberry-dummy-suggestion-type': 'id,name,moderated,parent,*localizedTypes',
          'ember-flexberry-dummy-application-user': 'id,name,eMail,phone1,phone2,phone3,activated,vK,facebook,twitter,birthday,gender,vip,karma',
          'ember-flexberry-dummy-vote': 'id,suggestion,voteType,applicationUser',
          'ember-flexberry-dummy-comment': 'id,suggestion,text,votes,moderated,author,*userVotes',
          'ember-flexberry-dummy-comment-vote': 'id,comment,voteType,applicationUser',
        }
      },
    });
    let owner = Ember.getOwner(this);
    let Store = DS.Store;
    let onlineStore = Store.create(owner.ownerInjection());
    this.set('onlineStore', onlineStore);
    this._super(...arguments);
  }
});
