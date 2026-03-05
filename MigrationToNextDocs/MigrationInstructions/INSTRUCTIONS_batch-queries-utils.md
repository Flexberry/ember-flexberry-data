# Модуль: batch-queries-utils

## Файлы
- addon/utils/batch-queries.js
- app/utils/batch-queries.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (基礎 utilities)

## Рекомендации по переносу

### Utils → Pure Functions

**Ember:** `addon/utils/batch-queries.js` → **Next.js:** `src/utils/batchQueries.ts`

**Пример шаблона:**
```ts
// utils/batchQueries.ts
export function getResponseMeta(contentTypeHeader: string): { contentType: string; boundary: string | null } {
  const [contentType, boundary] = contentTypeHeader.split(';');
  return { contentType, boundary: boundary ? boundary.split('=')[1] : null };
}

export function getBatchResponses(response: string, boundary: string): string[] {
  const startBoundary = `--${boundary}`;
  const endBoundary = `--${boundary}--`;
  const responses: string[] = [];

  let lastResponse: string[] | null = null;
  response.split('\n').map(l => l.trim()).forEach((line) => {
    if (line === startBoundary || line === endBoundary) {
      if (lastResponse) {
        responses.push(lastResponse.join('\n'));
      }
      lastResponse = [];
    } else {
      lastResponse?.push(line);
    }
  });

  return responses;
}

export function parseBatchResponse(response: string): any {
  const contentTypeHeader = getResponseHeader('Content-Type', response);
  const { contentType, boundary } = getResponseMeta(contentTypeHeader);
  
  switch (contentType) {
    case 'multipart/mixed': {
      const bodyStart = response.indexOf(`--${boundary}`);
      const changesets = getBatchResponses(response.substring(bodyStart), boundary).map(parseСhangeset);
      return { contentType, changesets };
    }
    case 'application/http':
      return { contentType, response: parseResponse(response) };
    default:
      throw new Error(`Unsupported type of response: ${contentType}.`);
  }
}

function parseСhangeset(changeset: string): any {
  const contentID = getResponseHeader('Content-ID', changeset);
  const { meta, body } = parseResponse(changeset);
  return { contentID, meta, body };
}

function parseResponse(response: string): any {
  const startMeta = response.indexOf('\n\n') + 1;
  const startBody = response.indexOf('\n\n', startMeta) + 1;

  const meta = parseResponseMeta(response.substring(startMeta, startBody));

  let body: any;
  switch (meta.contentType) {
    case null:
      body = null;
      break;
    case 'application/json':
      const parsedString = response.substring(startBody);
      body = JSON.parse(parsedString);

      if (parsedString.replace('\n', '').startsWith('{"error"') &&
          body?.error?.code && body?.error?.message) {
        throw new Error(`Request failed, error ${body.error.code}: ${body.error.message}`);
      }
      break;
    default:
      throw new Error(`Unsupported content type: ${meta.contentType}.`);
  }

  return { meta, body };
}

function parseResponseMeta(rawMeta: string): { status: number; statusText: string; contentType: string | null } {
  const statusStart = rawMeta.indexOf(' ') + 1;
  const statusTextStart = rawMeta.indexOf(' ', statusStart) + 1;
  const end = rawMeta.indexOf('\n', statusTextStart);

  const status = parseInt(rawMeta.substring(statusStart, statusTextStart));
  const statusText = rawMeta.substring(statusTextStart, end === -1 ? rawMeta.length : end);
  const contentType = status !== 204 ? getResponseHeader('Content-Type', rawMeta).split(';')[0] : null;

  return { status, statusText, contentType };
}

function getResponseHeader(header: string, response: string): string {
  const fullHeader = `${header}: `;
  const start = response.indexOf(fullHeader) + fullHeader.length;
  const end = response.indexOf('\n', start);

  return response.substring(start, end === -1 ? response.length : end);
}
```

## Порядок действий при переносе

1. Создать `batchQueries.ts`
2. Реализовать все парсинг функции
3. Обработать ошибки OData batch response

## Оценка трудозатрат

≈ 4–6 часов (medium)

## Чек-лист для разработчика

- [ ] `parseBatchResponse()` реализована
- [ ] `parseСhangeset()` реализована
- [ ] `parseResponse()` реализована
- [ ] Error handling для OData errors
- [ ] Тесты переписаны

## Примечания

- сложная логика парсинга batch-запросов
-保持 TypeScript 类型安全
