import DS from 'ember-data';
import EmberFlexberryDataModel from 'ember-flexberry-data/models/model';
import { attr, belongsTo } from 'ember-flexberry-data/utils/attributes';

let Model = EmberFlexberryDataModel.extend({
  selfPole: DS.attr('string'),
  relation: DS.belongsTo('ember-flexberry-dummy-test-poly-base', { inverse: null, async: false, polymorphic: true }),
});

Model.defineProjection('TestPolyEdit', 'ember-flexberry-dummy-test-poly', {
  selfPole: attr('Self Pole'),
  relation: belongsTo('ember-flexberry-dummy-test-poly-base', 'Relation', {
    pole: attr('Pole', { hidden: true })
  }, { displayMemberPath: 'pole' })
});

Model.defineProjection('TestPolyList', 'ember-flexberry-dummy-test-poly', {
  selfPole: attr('SelfPole'),
  relation: belongsTo('ember-flexberry-dummy-test-poly-base', '', {
    pole: attr('Pole', { hidden: true })
  }, { displayMemberPath: 'pole' })
});

export default Model;
