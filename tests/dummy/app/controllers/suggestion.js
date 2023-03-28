import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  firstComment: computed('model.comments.[]', function() {
    return this.get('model.comments.firstObject');
  }),

  firstCommentVote: computed('firstComment.userVotes.[]', function() {
    return this.get('firstComment.userVotes.firstObject');
  })
});
