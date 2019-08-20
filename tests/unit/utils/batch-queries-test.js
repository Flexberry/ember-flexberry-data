import { module, test } from 'qunit';

import { getResponseMeta, getBatchResponses, parseBatchResponse } from 'ember-flexberry-data/utils/batch-queries';

module('Unit | Utility | batch-queries');

test('it works', function(assert) {
  const responseText = `--batchresponse_1
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
--batchresponse_1
Content-Type: application/http
Content-Transfer-Encoding: binary

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
OData-Version: 4.0

{
  "property1":1,
  "property2":"value"
}
--batchresponse_1--`;

  const responses = [
    {
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
    },
    {
      contentType: 'application/http',
      response: {
        meta: { status: 200, statusText: 'OK', contentType: 'application/json' },
        body: { property1: 1, property2: 'value' },
      },
    }
  ];

  const { boundary } = getResponseMeta('multipart/mixed;boundary=batchresponse_1');
  const batchResponses = getBatchResponses(responseText, boundary).map(parseBatchResponse);

  assert.deepEqual(batchResponses, responses);
});
