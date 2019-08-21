/**
  @module ember-flexberry-data
*/

/**
  Returns the type and boundary from the `Content-Type` header.

  @method getResponseMeta
  @param {String} contentTypeHeader The content of `Content-Type` header.
  @return {Object} Object with `contentType` and `boundary` properties.
*/
export function getResponseMeta(contentTypeHeader) {
  const [contentType, boundary] = contentTypeHeader.split(';');
  return { contentType, boundary: boundary ? boundary.split('=')[1] : null };
}

/**
  Returns an array of batch responses from the body of the HTTP response.

  @method getBatchResponses
  @param {String} response The body of the HTTP response.
  @param {String} boundary The boundary.
  @return {String[]} An array of batch responses.
*/
export function getBatchResponses(response, boundary) {
  const startBoundary = `--${boundary}`;
  const endBoundary = `--${boundary}--`;
  const responses = [];

  let lastResponse;
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

  The returned object always contains the `contentType` property.
  Depending on the type of response it may contain the following additional properties:
  - `response` - for responses with `application/http` content type.
  - `changesets` - for responses with `multipart/mixed` content type.

  @method parseBatchResponse
  @param {String} response The batch response.
  @return {Object} The object with the response description.
*/
export function parseBatchResponse(response) {
  const contentTypeHeader = getResponseHeader('Content-Type', response);
  const { contentType, boundary } = getResponseMeta(contentTypeHeader);
  switch (contentType) {
    case 'multipart/mixed':
      const bodyStart = response.indexOf(`--${boundary}`);
      const changesets = getBatchResponses(response.substring(bodyStart), boundary).map(parseСhangeset);

      return { contentType, changesets };

    case 'application/http':
      return { contentType, response: parseResponse(response) };

    default:
      throw new Error(`Unsupported type of response: ${contentType}.`);
  }
}

/**
  @private
  @method parseСhangeset
  @param {String} changeset The string with the changeset content.
  @return {Object} Object with `contentID`, `meta` and `body` properties.
*/
function parseСhangeset(changeset) {
  const contentID = getResponseHeader('Content-ID', changeset);
  const { meta, body } = parseResponse(changeset);

  return { contentID, meta, body };
}

/**
  @private
  @method parseResponse
  @param {String} response The string with the response content.
  @return {Object} Object with `meta` and `body` properties.
*/
function parseResponse(response) {
  const startMeta = response.indexOf('\n\n') + 1;
  const startBody = response.indexOf('\n\n', startMeta) + 1;

  const meta = parseResponseMeta(response.substring(startMeta, startBody));

  let body;
  switch (meta.contentType) {
    case null:
      body = null;
      break;

    case 'application/json':
      body = JSON.parse(response.substring(startBody));
      break;

    default:
      throw new Error(`Unsupported content type: ${meta.contentType}.`);
  }

  return { meta, body };
}

/**
  @private
  @method parseResponseMeta
  @param {String} rawMeta The string with the response metadata.
  @return {Object} Object with `status`, `statusText` and `contentType` properties.
*/
function parseResponseMeta(rawMeta) {
  const statusStart = rawMeta.indexOf(' ') + 1;
  const statusTextStart = rawMeta.indexOf(' ', statusStart) + 1;
  const end = rawMeta.indexOf('\n', statusTextStart);

  const status = parseInt(rawMeta.substring(statusStart, statusTextStart));
  const statusText = rawMeta.substring(statusTextStart, end === -1 ? rawMeta.length : end);

  const contentType = status !== 204 ? getResponseHeader('Content-Type', rawMeta).split(';')[0] : null;

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
  const fullHeader = `${header}: `;
  const start = response.indexOf(fullHeader) + fullHeader.length;
  const end = response.indexOf('\n', start);

  return response.substring(start, end === -1 ? response.length : end);
}
