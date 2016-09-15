import { Model as AgentMixin, defineProjections } from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent';
import BaseModel from './model';
import OfflineModelMixin from '../mixins/offline-model';

let Model = BaseModel.extend(OfflineModelMixin, AgentMixin);
defineProjections(Model);

export default Model;
