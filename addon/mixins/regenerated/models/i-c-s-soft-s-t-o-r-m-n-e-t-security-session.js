import Mixin from '@ember/object/mixin';
import DS from 'ember-data';

export let Model = Mixin.create({
  userKey: DS.attr('string'),
  startedAt: DS.attr('date'),
  lastAccess: DS.attr('date'),
  closed: DS.attr('boolean'),
});
