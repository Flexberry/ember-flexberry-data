import Ember from 'ember';
import DS from 'ember-data';
import { Offline } from 'ember-flexberry-data';

export default Offline.Store.extend({
  init() {
    this._super(...arguments);
    let owner = Ember.getOwner(this);
    let Store = DS.Store;
    let onlineStore = Store.create(owner.ownerInjection());
    this.set('onlineStore', onlineStore);
  }
});
