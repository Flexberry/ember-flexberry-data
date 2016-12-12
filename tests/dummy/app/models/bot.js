import DS from 'ember-data';
import Creator from './creator';

let Model = Creator.extend({
  IsClever: DS.attr('boolean')
});

Model.reopenClass({
  _parentModelName: 'creator'
});


export default Model;
