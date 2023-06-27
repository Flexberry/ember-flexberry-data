import DS from 'ember-data';
import TestPolyBaseModel from './ember-flexberry-dummy-test-poly-base';
import { attr } from 'ember-flexberry-data/utils/attributes';

let Model = TestPolyBaseModel.extend({
  childPole: DS.attr('number')
});

Model.reopenClass({
  _parentModelName: 'ember-flexberry-dummy-test-poly-base'
});

Model.defineProjection('TestPolyChildEdit', 'ember-flexberry-dummy-test-poly-child', {
  pole: attr('Pole'),
  childPole: attr('ChildPole')
});

Model.defineProjection('TestPolyChildList', 'ember-flexberry-dummy-test-poly-child', {
  pole: attr('Pole'),
  childPole: attr('ChildPole')
});

export default Model;
