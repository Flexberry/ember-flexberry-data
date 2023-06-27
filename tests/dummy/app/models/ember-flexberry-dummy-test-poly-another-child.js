import DS from 'ember-data';
import TestPolyBaseModel from './ember-flexberry-dummy-test-poly-base';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = TestPolyBaseModel.extend({
  childAnotherPole: DS.attr('boolean')
});

Model.reopenClass({
  _parentModelName: 'ember-flexberry-dummy-test-poly-base'
});

Model.defineProjection('TestPolyAnotherChildEdit', 'ember-flexberry-dummy-test-poly-another-child', {
  pole: attr('Pole'),
  childAnotherPole: attr('ChildAnotherPole')
});

Model.defineProjection('TestPolyAnotherChildList', 'ember-flexberry-dummy-test-poly-another-child', {
  pole: attr('Pole'),
  childAnotherPole: attr('ChildAnotherPole')
});

export default Model;
