'use strict';

module.exports = {
  extends: ['recommended', 'stylistic'],
  rules: {
    'no-bare-strings': true
  },
  pending: [
    {
      "moduleId": "tests/dummy/app/templates/application",
      "only": [
        "eol-last",
        "no-bare-strings"
      ]
    },
    {
      "moduleId": "tests/dummy/app/templates/suggestion",
      "only": [
        "no-bare-strings"
      ]
    }
  ]
};
