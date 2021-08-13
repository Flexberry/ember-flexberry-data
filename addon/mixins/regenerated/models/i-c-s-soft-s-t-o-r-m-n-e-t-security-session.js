import Mixin from '@ember/object/mixin';
import DS from 'ember-data';

export let Model = Mixin.create({
  userKey: DS.attr('guid'),
  startedAt: DS.attr('date', { defaultValue() { return new Date(); } }),
  lastAccess: DS.attr('date', { defaultValue() { return new Date(); } }),
  closed: DS.attr('boolean', { defaultValue: false })
});
