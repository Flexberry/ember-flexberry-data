import { A } from '@ember/array';
import { set } from '@ember/object';

import { all } from 'rsvp';

import QueryBuilder from 'ember-flexberry-data/query/builder';

function clearOnlineData(store) {
  const modelsToClear = [
    'ember-flexberry-dummy-application-user',
    'ember-flexberry-dummy-comment',
    'ember-flexberry-dummy-comment-vote',
    'ember-flexberry-dummy-localization',
    'ember-flexberry-dummy-localized-suggestion-type',
    'ember-flexberry-dummy-suggestion',
    'ember-flexberry-dummy-suggestion-file',
    'ember-flexberry-dummy-suggestion-type',
    'ember-flexberry-dummy-test-poly',
    'ember-flexberry-dummy-test-poly-another-child',
    'ember-flexberry-dummy-test-poly-child',
    'ember-flexberry-dummy-vote',
  ];
  const maxItemsCount = 61 + 42;

  return _clearData(store, modelsToClear, maxItemsCount);
}

function _clearData(store, modelsToClear, maxItemsCount = 0)
{
  const limit = maxItemsCount + 1;

  let data = {};
  let promises = [];

  modelsToClear.forEach(item => {
    let builder = new QueryBuilder(store, item).top(limit);
    promises.push(
      store.query(item, builder.build()).then((d) => set(data, item, d))
    );
  });

  return all(promises).then(() => {
    let itemsCount = Object.values(data).reduce((sum, current) => sum + current.get('length'), 0);

    if (itemsCount > maxItemsCount) {
      throw new Error('The store seems not to be a test store.');
    }

    let a = [];
    Object.values(data).forEach(item => {
      item.forEach(record => {
        record.deleteRecord();
        a.push(record);
      });
    });

    return store.batchUpdate(A(a));
  });
}

export { clearOnlineData };
