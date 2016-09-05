import { Model as LinkGroupMixin, defineProjections } from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group';
import BaseModel from './model';

let Model = BaseModel.extend(LinkGroupMixin);
defineProjections(Model);

export default Model;
