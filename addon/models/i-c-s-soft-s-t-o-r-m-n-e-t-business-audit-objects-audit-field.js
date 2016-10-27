import { Model as AuditFieldMixin, defineProjections } from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field';
import BaseModel from './model';

let Model = BaseModel.extend(AuditFieldMixin);
defineProjections(Model);

export default Model;
