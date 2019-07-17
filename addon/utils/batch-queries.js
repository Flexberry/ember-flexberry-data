/**
  @module ember-flexberry-data
*/

/**
  Returns the type and boundary from the `Content-Type` header.

  @method getBoundary
  @param {String} contentTypeHeader The content of `Content-Type` header.
  @return {Object} Object with `contentType` and `boundary` properties.
*/
export function getResponseMeta(contentTypeHeader) {
  let [contentType, boundary] = contentTypeHeader.split(';');
  return { contentType, boundary: boundary.split('=')[1] };
}

/**
  Returns an array of batch responses from the body of the HTTP response.

  @method getBatchResponses
  @param {String} response The body of the HTTP response.
  @param {String} boundary The boundary.
  @return {String[]} An array of batch responses.
*/
export function getBatchResponses(response, boundary) {
  let startBoundary = `--${boundary}`;
  let endBoundary = `--${boundary}--`;

  let lastResponse;
  let responses = [];
  response.split('\n').map(l => l.trim()).forEach((line) => {
    if (line === startBoundary || line === endBoundary) {
      if (lastResponse) {
        responses.push(lastResponse.join('\n'));
      }

      lastResponse = [];
    } else {
      lastResponse.push(line);
    }
  });

  return responses;
}

/**
  Parses a batch response depending on its type.

  @method parseBatchResponse
  @param {String} response The batch response.
  @return {Object} The object with the response description.
*/
export function parseBatchResponse(response) {
  let contentTypeHeader = getResponseHeader('Content-Type', response);
  let { contentType, boundary } = getResponseMeta(contentTypeHeader);
  switch (contentType) {
    case 'multipart/mixed': {
      let bodyStart = response.indexOf(`--${boundary}`);
      let changesets = getBatchResponses(response.substring(bodyStart), boundary).map(parseСhangeset);

      return { contentType, changesets };
    }
    default:
      throw new Error(`Unsupported type of response: ${contentType}.`);
  }
}

/**
  @private
  @method parseСhangeset
  @param {String} changeset String data of a changeset.
  @return {Object} Object with `contentID`, `meta` and `body` properties.
*/
function parseСhangeset(changeset) {
  let [rawHeaders, rawMeta, rawBody] = changeset.split('\n\n');

  let contentID = getResponseHeader('Content-ID', rawHeaders);
  let meta = parseСhangesetMeta(rawMeta);

  let body;
  switch (meta.contentType) {
    case null:
      body = null;
      break;

    case 'application/json':
      body = JSON.parse(rawBody);
      break;

    default:
      throw new Error(`Unsupported content type: ${meta.contentType}.`);
  }

  return { contentID, meta, body };
}

/**
  @private
  @method parseСhangesetMeta
  @param {String} rawMeta String metadata of a changeset.
  @return {Object} Object with `status`, `statusText` and `contentType` properties.
*/
function parseСhangesetMeta(rawMeta) {
  let statusStart = rawMeta.indexOf(' ') + 1;
  let statusTextStart = rawMeta.indexOf(' ', statusStart) + 1;
  let end = rawMeta.indexOf('\n', statusTextStart);

  let status = parseInt(rawMeta.substring(statusStart, statusTextStart));
  let statusText = rawMeta.substring(statusTextStart, end === -1 ? rawMeta.length : end);

  let contentType = null;
  if (status !== 204) {
    contentType = getResponseHeader('Content-Type', rawMeta).split(';')[0];
  }

  return { status, statusText, contentType };
}

/**
  @private
  @method getResponseHeader
  @param {String} header The header name.
  @param {String} response The response from which will be extracted header.
  @return {String} The content of the header.
*/
function getResponseHeader(header, response) {
  let fullHeader = `${header}: `;
  let start = response.indexOf(fullHeader) + fullHeader.length;
  let end = response.indexOf('\n', start);

  return response.substring(start, end === -1 ? response.length : end);
}
