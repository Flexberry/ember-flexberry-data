import EmberObject from '@ember/object';
import RSVP from 'rsvp';
import { warn } from '@ember/debug';

export default EmberObject.extend({

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
    this.set('_queue', [RSVP.resolve()]);
  },

  /**
    Adds callback to then end of queue of Promises.

    @method attach
    @param {Function} callback Callback to add to the end of queue. Takes `resolve` and `reject` functions of new Promise as params.
    @return {Promise}
  */
  attach(callback) {
    const queueKey = this._queue.length;

    this._queue[queueKey] = new RSVP.Promise((resolve, reject) => this._queue[queueKey - 1].then(() => callback(resolve, reject)).catch((reason) => {
      if (this.get('continueOnError')) {
        warn(`Promise in queue was rejected with reason: "${reason}"`,
          false,
          { id: 'ember-flexberry-data-debug.queue.promise-was-rejected' });
        resolve();
      } else {
        reject(reason);
      }
    }));

    return this._queue[queueKey];
  }
});
