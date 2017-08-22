import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
import TestPolyBaseModel from './ember-flexberry-dummy-test-poly-base';

let Model = TestPolyBaseModel.extend({
  childAnotherPole: DS.attr('boolean')
});

Model.reopenClass({
  _parentModelName: 'ember-flexberry-dummy-test-poly-base'
});

Model.defineProjection('TestPolyAnotherChildEdit', 'ember-flexberry-dummy-test-poly-another-child', {
  pole: Projection.attr('Pole'),
  childAnotherPole: Projection.attr('ChildAnotherPole')
});

Model.defineProjection('TestPolyAnotherChildList', 'ember-flexberry-dummy-test-poly-another-child', {
  pole: Projection.attr('Pole'),
  childAnotherPole: Projection.attr('ChildAnotherPole')
});

export default Model;
