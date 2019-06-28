import { module, test } from 'qunit';

import { getResponseMeta, getBatchResponses, parseBatchResponse } from 'ember-flexberry-data/utils/batch-queries';

module('Unit | Utility | batch-queries');

test('it works', function(assert) {
  let responseText = `--batchresponse_1
Content-Type: multipart/mixed;boundary=changesetresponse_1

--changesetresponse_1
Content-Type: application/http
Content-Transfer-Encoding: binary
Content-ID: 1

HTTP/1.1 201 Created
Content-Type: application/json

{"property": "value"}
--changesetresponse_1
Content-Type: application/http
Content-Transfer-Encoding: binary
Content-ID: 2

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "property1": 1,
  "property2": "value"
}
--changesetresponse_1
Content-Type: application/http
Content-Transfer-Encoding: binary
Content-ID: 3

HTTP/1.1 204 No Content


--changesetresponse_1--
--batchresponse_1--`;

  let responseObject = {
    contentType: 'multipart/mixed',
    changesets: [
      {
        contentID: '1',
        meta: { status: 201, statusText: 'Created', contentType: 'application/json' },
        body: { property: 'value' },
      },
      {
        contentID: '2',
        meta: { status: 200, statusText: 'OK', contentType: 'application/json' },
        body: { property1: 1, property2: 'value' },
      },
      {
        contentID: '3',
        meta: { status: 204, statusText: 'No Content', contentType: null },
        body: null,
      },
    ],
  };

  let meta = getResponseMeta('multipart/mixed;boundary=batchresponse_1');
  let batchResponse = parseBatchResponse(getBatchResponses(responseText, meta.boundary)[0]);

  assert.deepEqual(batchResponse, responseObject);
});
