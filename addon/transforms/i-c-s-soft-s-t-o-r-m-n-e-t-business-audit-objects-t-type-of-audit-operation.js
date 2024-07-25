import FlexberryEnum from 'ember-flexberry-data/transforms/flexberry-enum';
import tTypeOfAuditOperationEnum from '../enums/i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-t-type-of-audit-operation';

export default class extends FlexberryEnum {
  constructor() {
    super(tTypeOfAuditOperationEnum);
  }
};
