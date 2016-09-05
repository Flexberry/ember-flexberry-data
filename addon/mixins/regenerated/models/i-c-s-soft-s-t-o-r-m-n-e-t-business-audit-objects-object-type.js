import Ember from 'ember';
import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

export let Model = Ember.Mixin.create({
  name: DS.attr('string'),
  validations: {
    name: { presence: true },
  },
});

export let defineProjections = function (model) {
  model.defineProjection('SearchView', 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type', {
    name: Projection.attr(''),
  });
};
