import FlexberryEnum from 'ember-flexberry-data/transforms/flexberry-enum';
import GenderEnum from '../enums/ember-flexberry-dummy-gender';

export default class extends FlexberryEnum {
  constructor() {
    super(GenderEnum);
  }

  sourceType = 'EmberFlexberryDummy.Gender'
};
