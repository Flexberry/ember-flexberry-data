import Ember from 'ember';

export default Ember.Controller.extend({
  firstComment: Ember.computed('model.comments.[]', function() {
    return this.get('model.comments.firstObject');
  }),

  firstCommentVote: Ember.computed('firstComment.userVotes.[]', function() {
    return this.get('firstComment.userVotes.firstObject');
  })
});
