import Ember from 'ember';

export default Ember.Object.extend({

  /* The queue of promises */
  _queue: [Ember.RSVP.resolve()],

  /**
    If set to `true` then error occurring should not stop performing operations in queue.

    @property continueOnError
    @type Boolean
    @default true
  */
  continueOnError: true,

  attach(callback) {
    const queueKey = this._queue.length;

    this._queue[queueKey] = new Ember.RSVP.Promise((resolve, reject) => {
      this._queue[queueKey - 1].then(() => {
        callback(resolve, reject);
      }).catch((reason) => {
        Ember.Logger.error(reason);
        if (this.continueOnError) {
          resolve();
        } else {
          reject();
        }
      });
    });

    return this._queue[queueKey];
  }
});
