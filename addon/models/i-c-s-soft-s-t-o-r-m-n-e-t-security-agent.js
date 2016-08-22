import { Model as AgentMixin, defineProjections } from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-agent';
import BaseModel from './model';

let Model = BaseModel.extend(AgentMixin);
defineProjections(Model);

export default Model;
