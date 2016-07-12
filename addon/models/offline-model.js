/**
  @module ember-flexberry-data
*/

import Model from './model';
import OfflineModel from '../mixins/offline-model';

/**
  Model with projections and additional metadata for offline support.

  @class Model
  @namespace Offline
  @extends <a href="http://flexberry.github.io/Documentation/develop/classes/Projection.Model.html">DS.Projection.Model</a>
  @uses Offline.ModelMixin
  @public
*/
export default Model.extend(OfflineModel, {
});
