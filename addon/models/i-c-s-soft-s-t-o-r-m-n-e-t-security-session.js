import { Model as SessionMixin } from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-session';
import BaseModel from './model';
import OfflineModelMixin from '../mixins/offline-model';

let Model = BaseModel.extend(OfflineModelMixin, SessionMixin);

export default Model;
