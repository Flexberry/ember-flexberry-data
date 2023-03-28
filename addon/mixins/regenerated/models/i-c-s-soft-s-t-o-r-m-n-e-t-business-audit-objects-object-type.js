import Mixin from '@ember/object/mixin';
import DS from 'ember-data';
import { attr } from '../../../utils/attributes';

export let Model = Mixin.create({
  name: DS.attr('string'),
});

export let defineProjections = function (model) {
  model.defineProjection('SearchView', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', {
    name: attr(''),
  });
};
