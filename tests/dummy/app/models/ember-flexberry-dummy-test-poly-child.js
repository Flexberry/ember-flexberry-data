import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';
import TestPolyBaseModel from './ember-flexberry-dummy-test-poly-base';

let Model = TestPolyBaseModel.extend({
  childPole: DS.attr('number')
});

Model.reopenClass({
  _parentModelName: 'ember-flexberry-dummy-test-poly-base'
});

Model.defineProjection('TestPolyChildEdit', 'ember-flexberry-dummy-test-poly-child', {
  pole: Projection.attr('Pole'),
  childPole: Projection.attr('ChildPole')
});

Model.defineProjection('TestPolyChildList', 'ember-flexberry-dummy-test-poly-child', {
  pole: Projection.attr('Pole'),
  childPole: Projection.attr('ChildPole')
});

export default Model;
