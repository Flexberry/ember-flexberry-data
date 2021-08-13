import BaseModel from './model';
import OfflineModelMixin from '../mixins/offline-model';

import {
  defineProjections,
  Model as LinkGroupMixin
} from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group';

let Model = BaseModel.extend(OfflineModelMixin, LinkGroupMixin, {
});

defineProjections(Model);

export default Model;
