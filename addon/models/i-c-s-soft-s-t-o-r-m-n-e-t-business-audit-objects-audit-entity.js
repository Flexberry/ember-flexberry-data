import { Model as AuditEntityMixin, defineProjections } from '../mixins/regenerated/models/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity';
import BaseModel from './model';

let Model = BaseModel.extend(AuditEntityMixin);
defineProjections(Model);

export default Model;
