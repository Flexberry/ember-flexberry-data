import FlexberryEnum from 'ember-flexberry-data/transforms/flexberry-enum';
import GenderEnum from '../enums/ember-flexberry-dummy-gender';

export default class extends FlexberryEnum {
  get enum() {
    return GenderEnum;
  }

  get sourceType() {
    return 'EmberFlexberryDummy.Gender';
  }
};
