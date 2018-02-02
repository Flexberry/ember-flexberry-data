import Ember from 'ember';

export default Ember.Controller.extend({
  hello: 'sup',
  owner: null,

  init() {
    let owner = Ember.getOwner(this);
    this.set('owner', owner);
    let a = owner.lookup('adapter:odata');
    console.log(owner);
    console.log(a);

    // successCallback, failCallback, alwaysCallback
    console.log(a.callFunction(
      'http://localhost:8600/Odata',
      'ValidateCfaptcha',
      { clientResponse: 'dfsdf',
        meme: 'mems',
        count: 4 }
    ));
    console.log(a.callAction(
      'http://localhost:8600/Odata',
      'ValidateUsernafme',
      { username: 'dfsdf',
        ping: 'pong',
        count: 5 }
    ));
  }
});
