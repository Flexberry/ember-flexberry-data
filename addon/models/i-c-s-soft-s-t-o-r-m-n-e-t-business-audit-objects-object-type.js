import { Model as ObjectTypeMixin, defineProjections } from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type';
import BaseModel from './model';

let Model = BaseModel.extend(ObjectTypeMixin);
defineProjections(Model);

export default Model;
