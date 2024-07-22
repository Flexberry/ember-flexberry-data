import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default class YourController extends Controller {
  @computed('model.comments.[]')
  get firstComment() {
    return this.get('model.comments.firstObject');
  }

  @computed('firstComment.userVotes.[]')
  get firstCommentVote() {
    return this.get('firstComment.userVotes.firstObject');
  }
};
