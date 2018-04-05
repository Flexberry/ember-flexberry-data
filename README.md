# Ember Flexberry Data
[![Build Status Master](https://img.shields.io/travis/Flexberry/ember-flexberry-data/master.svg?label=master%20build%20)](https://travis-ci.org/Flexberry/ember-flexberry-data)
[![Build Status Develop](https://img.shields.io/travis/Flexberry/ember-flexberry-data/develop.svg?label=develop%20build)](https://travis-ci.org/Flexberry/ember-flexberry-data/branches)
[![NPM Version](https://badge.fury.io/js/ember-flexberry-data.svg)](https://badge.fury.io/js/ember-flexberry-data)

[![ember](https://embadge.io/v1/badge.svg?label=ember&range=~2.4.3)](https://github.com/emberjs/ember.js/releases)
[![ember-data](https://embadge.io/v1/badge.svg?label=ember-data&range=~2.4.2)](https://github.com/emberjs/data/releases)
[![ember-cli](https://embadge.io/v1/badge.svg?label=ember-cli&range=2.4.3)](https://github.com/ember-cli/ember-cli/releases)

Ember [Flexberry](http://flexberry.ru/) Data addon - Support of database projections, JavaScript Query Language, Offline data storage (`IndexedDB` via `dexie`) and working with several kinds of backends: `OData V4`, `JSON API`, etc.

## Installation

* Latest release: `ember install ember-flexberry-data`
* Specific version: `ember install ember-flexberry-data@x.x.x`
* Latest commit from a branch: `ember install flexberry/ember-flexberry-data#<BRANCH_NAME>`
* Specific commit: `ember install flexberry/ember-flexberry-data#<COMMIT_SHA>`

## Documentation

* Auto-generated under master branch: http://flexberry.github.io/master/modules/ember-flexberry-data.html
* Auto-generated under develop branch: http://flexberry.github.io/develop/modules/ember-flexberry-data.html

## Collaborating / Development

Information on how to contribute to the project you can find [here](https://github.com/Flexberry/Home/blob/master/CONTRIBUTING.md).

#### Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Running

* `ember serve`
* Visit your app at [http://localhost:4201](http://localhost:4201).

## Running Tests

* `yarn test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

If `TEST_ODATA_SERVICE_URL` variable is declared in environment of process then integration tests for OData service are also run (needs corresponding backend).

## Building

* `ember build` (development)
* `ember build --environment production` (production)

#### Releasing

* Merge develop branch with master branch
  * `git checkout master`
  * `git merge --no-ff develop`
  * `git push`
* `ember release` (for more information visit [ember-cli-release](https://github.com/lytics/ember-cli-release))
  * To increment patch version run without specifying options.
  * To increment minor version run with `--minor` option.
  * To increment major version run with `--major` option.
* `npm publish ./` (for more information visit [How to publish packages to NPM](https://gist.github.com/coolaj86/1318304))
* Merge master branch that contains additional commit for changing addon version with develop branch
  * `git checkout develop`
  * `git merge --no-ff master`
  * `git push`

#### Documenting

* Document your code using [YUIDoc Syntax Reference](http://yui.github.io/yuidoc/syntax/index.html). For examples, you can look at the documented code in the ember.js repository.
* After pushing into master or develop branch, documentation will be automatically generated and updated in [Flexberry/Documentation repository](https://github.com/Flexberry/flexberry.github.io), which is available via http://flexberry.github.io.
* For testing and generating documentation by hands use [YUIDoc](http://yui.github.io/yuidoc/).

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* [ember screencasts](https://www.emberscreencasts.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
