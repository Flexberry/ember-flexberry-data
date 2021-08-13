import BaseModel from './model';
import OfflineModelMixin from '../mixins/offline-model';

import {
  Model as SessionMixin
} from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session';

let Model = BaseModel.extend(OfflineModelMixin, SessionMixin, {
});

export default Model;
