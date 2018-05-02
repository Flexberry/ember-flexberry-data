/**
  @module ember-flexberry-data
*/

/* eslint-disable no-useless-escape */
const STRING_DASHERIZE_REGEXP = (/[ _]/g);

const STRING_CAMELIZE_REGEXP_1 = (/(\-|\_|\.|\s)+(.)?/g);
const STRING_CAMELIZE_REGEXP_2 = (/(^|\/)([A-ZА-ЯЁ])/g);

const STRING_CLASSIFY_REGEXP_1 = (/^(\-|_)+(.)?/);
const STRING_CLASSIFY_REGEXP_2 = (/(.)(\-|\_|\.|\s)+(.)?/g);
const STRING_CLASSIFY_REGEXP_3 = (/(^|\/|\.)([a-zа-яё])/g);

const STRING_UNDERSCORE_REGEXP_1 = (/([a-zа-яё\d])([A-ZА-ЯЁ]+)/g);
const STRING_UNDERSCORE_REGEXP_2 = (/\-|\s+/g);

const STRING_CAPITALIZE_REGEXP = (/(^|\/)([a-zа-яё])/g);

const STRING_DECAMELIZE_REGEXP = (/([a-zа-яё\d])([A-ZА-ЯЁ])/g);
/* eslint-enable no-useless-escape */

/**
  Converts a camelized string into all lower case separated by underscores.
  ```javascript
  'innerHTML'.decamelize();           // 'inner_html'
  'action_name'.decamelize();        // 'action_name'
  'css-class-name'.decamelize();     // 'css-class-name'
  'my favorite items'.decamelize();  // 'my favorite items'
  ```
  @method decamelize
  @param {String} str The string to decamelize.
  @return {String} the decamelized string.
*/
function decamelize(str) {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

/**
  Replaces underscores, spaces, or camelCase with dashes.
  ```javascript
  'innerHTML'.dasherize();          // 'inner-html'
  'action_name'.dasherize();        // 'action-name'
  'css-class-name'.dasherize();     // 'css-class-name'
  'my favorite items'.dasherize();  // 'my-favorite-items'
  'privateDocs/ownerInvoice'.dasherize(); // 'private-docs/owner-invoice'
  ```
  @method dasherize
  @param {String} str The string to dasherize.
  @return {String} the dasherized string.
*/
function dasherize(str) {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}

/**
  Returns the lowerCamelCase form of a string.
  ```javascript
  'innerHTML'.camelize();          // 'innerHTML'
  'action_name'.camelize();        // 'actionName'
  'css-class-name'.camelize();     // 'cssClassName'
  'my favorite items'.camelize();  // 'myFavoriteItems'
  'My Favorite Items'.camelize();  // 'myFavoriteItems'
  'private-docs/owner-invoice'.camelize(); // 'privateDocs/ownerInvoice'
  ```
  @method camelize
  @param {String} str The string to camelize.
  @return {String} the camelized string.
*/
function camelize(str) {
  /* eslint-disable no-unused-vars */
  return str.replace(STRING_CAMELIZE_REGEXP_1, (match, separator, chr) => chr ? chr.toUpperCase() : '')
    .replace(STRING_CAMELIZE_REGEXP_2, (match, separator, chr) => match.toLowerCase());
  /* eslint-enable no-unused-vars */
}

/**
  Returns the UpperCamelCase form of a string.
  ```javascript
  'innerHTML'.classify();          // 'InnerHTML'
  'action_name'.classify();        // 'ActionName'
  'css-class-name'.classify();     // 'CssClassName'
  'my favorite items'.classify();  // 'MyFavoriteItems'
  'private-docs/owner-invoice'.classify(); // 'PrivateDocs/OwnerInvoice'
  ```
  @method classify
  @param {String} str the string to classify
  @return {String} the classified string
*/
function classify(str) {
  let replace1 = (match, separator, chr) => chr ? (`_${chr.toUpperCase()}`) : '';
  let replace2 = (match, initialChar, separator, chr) => initialChar + (chr ? chr.toUpperCase() : '');
  let parts = str.split('/');
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i]
      .replace(STRING_CLASSIFY_REGEXP_1, replace1)
      .replace(STRING_CLASSIFY_REGEXP_2, replace2);
  }

  /* eslint-disable no-unused-vars */
  return parts.join('/').replace(STRING_CLASSIFY_REGEXP_3, (match, separator, chr) => match.toUpperCase());
  /* eslint-enable no-unused-vars */
}

/**
  More general than decamelize. Returns the lower\_case\_and\_underscored
  form of a string.
  ```javascript
  'innerHTML'.underscore();          // 'inner_html'
  'action_name'.underscore();        // 'action_name'
  'css-class-name'.underscore();     // 'css_class_name'
  'my favorite items'.underscore();  // 'my_favorite_items'
  'privateDocs/ownerInvoice'.underscore(); // 'private_docs/owner_invoice'
  ```
  @method underscore
  @param {String} str The string to underscore.
  @return {String} the underscored string.
*/
function underscore(str) {
  return str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase();
}

/**
  Returns the Capitalized form of a string
  ```javascript
  'innerHTML'.capitalize()         // 'InnerHTML'
  'action_name'.capitalize()       // 'Action_name'
  'css-class-name'.capitalize()    // 'Css-class-name'
  'my favorite items'.capitalize() // 'My favorite items'
  'privateDocs/ownerInvoice'.capitalize(); // 'PrivateDocs/ownerInvoice'
  ```
  @method capitalize
  @param {String} str The string to capitalize.
  @return {String} The capitalized string.
*/
function capitalize(str) {
  /* eslint-disable no-unused-vars */
  return str.replace(STRING_CAPITALIZE_REGEXP, (match, separator, chr) => match.toUpperCase());
  /* eslint-enable no-unused-vars */
}

export {
  decamelize,
  dasherize,
  camelize,
  classify,
  underscore,
  capitalize
};
