import Ember from 'ember';
import DS from 'ember-data';

export let Model = Ember.Mixin.create({
  userKey: DS.attr('string'),
  startedAt: DS.attr('date'),
  lastAccess: DS.attr('date'),
  closed: DS.attr('boolean'),
  validations: {
  },
});
