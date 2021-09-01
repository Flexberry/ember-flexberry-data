import Inflector from 'ember-inflector';

export function initialize() {
  const customRules = {
    plurals: [
      [/$/, 's'],
    ],
    singular: [
      [/s$/i, ''],
    ],
  };

  Inflector.odataInflector = new Inflector(customRules);
}

export default {
  name: 'odata-inflector',
  initialize
};
