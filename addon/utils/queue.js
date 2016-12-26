import Ember from 'ember';

export default Ember.Object.extend({

  /* The queue of promises */
  _queue: null,

  /**
    If set to `true` then error occurring should not stop performing operations in queue.

    @property continueOnError
    @type Boolean
    @default true
  */
  continueOnError: true,

  /* Init instance of queue */
  init() {
    this.set('_queue', [Ember.RSVP.resolve()]);
  },

  /**
    Adds callback to then end of queue of Promises.

    @method attach
    @param {Function} callback Callback to add to the end of queue. Takes `resolve` and `reject` functions of new Promise as params.
    @return {Promise}
  */
  attach(callback) {
    const queueKey = this._queue.length;

    this._queue[queueKey] = new Ember.RSVP.Promise((resolve, reject) => this._queue[queueKey - 1].then(() => callback(resolve, reject)).catch((reason) => {
      if (this.get('continueOnError')) {
        Ember.warn(`Promise in queue was rejected with reason: "${reason}"`);
        resolve();
      } else {
        reject(reason);
      }
    }));

    return this._queue[queueKey];
  }
});
