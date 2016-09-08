import Ember from 'ember';
import DS from 'ember-data';
import { Projection, Offline } from 'ember-flexberry-data';

export default Offline.Store.extend({
  init() {
    this._super(...arguments);
    let owner = Ember.getOwner(this);
    let Store = DS.Store;
    Store.reopen(Projection.StoreMixin);
    let onlineStore = Store.create(owner.ownerInjection());
    this.set('onlineStore', onlineStore);
  }
});
