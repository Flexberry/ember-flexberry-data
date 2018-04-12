/**
  @module ember-flexberry-data
*/

import { isNone } from '@ember/utils';
import Model from './model';
import OfflineModelMixin from '../mixins/offline-model';
import { attr } from '../utils/attributes';

/**
  Model with projections and additional metadata for offline support.
  All metadata properties will be added to all projections (also for relationships).

  @class Model
  @extends <a href="http://flexberry.github.io/Documentation/develop/classes/Projection.Model.html">DS.Projection.Model</a>
  @uses Offline.ModelMixin
  @public
*/
let OfflineModel = Model.extend(OfflineModelMixin, {
});

let modelDefineProjection = OfflineModel.defineProjection;

OfflineModel.reopenClass({
  defineProjection(projectionName, modelName, attributes) {
    function addSycPropertiesToProjection(proj, attrs) {
      attrs.createTime = attr('Creation Time', { hidden: true });
      attrs.creator = attr('Creator', { hidden: true });
      attrs.editTime = attr('Edit Time', { hidden: true });
      attrs.editor = attr('Editor', { hidden: true });
      attrs.syncDownTime = attr('SyncDown Time', { hidden: true });
      attrs.readOnly = attr('Read Only', { hidden: true });
      proj.attributes = attrs;

      /* Add meta properties to all relationships in projection so they can
		    be serialized and deserialized in embedded records.*/
      for (let key in attrs) {
        if (attrs.hasOwnProperty(key) && !isNone(attrs[key].kind) &&
          (attrs[key].kind === 'belongsTo' || attrs[key].kind === 'hasMany')) {
          addSycPropertiesToProjection(attrs[key], attrs[key].attributes);
        }
      }
    }

    if (modelDefineProjection) {
      let proj = modelDefineProjection.call(this, projectionName, modelName, attributes);
      let attrs = proj.attributes;
      addSycPropertiesToProjection(proj, attrs);
      this.projections.set(projectionName, proj);
    }
  }
});

export default OfflineModel;
