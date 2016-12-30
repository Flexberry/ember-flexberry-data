import DS from 'ember-data';
import { Projection } from 'ember-flexberry-data';

let Model = Projection.Model.extend({
  selfPole: DS.attr('string'),
  relation: DS.belongsTo('ember-flexberry-dummy-test-poly-base', { inverse: null, async: false, polymorphic: true }),

  // Model validation rules.
  validations: {
    relation: {
      presence: {
        message: 'Relation is required'
      }
    }
  }
});

Model.defineProjection('TestPolyEdit', 'ember-flexberry-dummy-test-poly', {
  selfPole: Projection.attr('Self Pole'),
  relation: Projection.belongsTo('ember-flexberry-dummy-test-poly-base', 'Relation', {
    pole: Projection.attr('Pole', { hidden: true })
  }, { displayMemberPath: 'pole' })
});

Model.defineProjection('TestPolyList', 'ember-flexberry-dummy-test-poly', {
  selfPole: Projection.attr('SelfPole'),
  relation: Projection.belongsTo('ember-flexberry-dummy-test-poly-base', '', {
    pole: Projection.attr('Pole', { hidden: true })
  }, { displayMemberPath: 'pole' })
});

export default Model;
