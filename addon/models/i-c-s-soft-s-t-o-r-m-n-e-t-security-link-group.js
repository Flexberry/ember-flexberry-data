import { Model as LinkGroupMixin, defineProjections } from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group';
import BaseModel from './model';
import OfflineModelMixin from '../mixins/offline-model';

let Model = BaseModel.extend(OfflineModelMixin, LinkGroupMixin);
defineProjections(Model);

export default Model;
