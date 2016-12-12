import DS from 'ember-data';
import Creator from './creator';

let Model = Creator.extend({
  EyesColor: DS.attr('string')
});

Model.reopenClass({
  _parentModelName: 'creator'
});


export default Model;
