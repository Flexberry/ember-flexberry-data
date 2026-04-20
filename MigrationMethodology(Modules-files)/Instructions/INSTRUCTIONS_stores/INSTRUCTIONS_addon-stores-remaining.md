# Миграция: stores (дополнительные инструкции)

## remaining stores files

### 1. stores/base-store.js
- Ember: `Store.extend({...})`
- Next.js: `export function createBaseStore()` function

### 2. stores/local-store.js
- Ember: `Store.extend({...})`
- Next.js: `export function createLocalStore()` function

### 3. stores/online-store.js
- Ember: `Store.extend({...})`
- Next.js: `export function createOnlineStore()` function

### 4. stores/base-store/decorate-adapter.js
- Ember: `decorateAdapter(adapter)`
- Next.js: `export function decorateAdapter(adapter)` function

### 5. stores/base-store/decorate-api-call.js
- Ember: `decorateApiCall(apiCall)`
- Next.js: `export function decorateApiCall(apiCall)` function

Создать инструкции по аналогии с `INSTRUCTIONS_addon-stores-*.js.md`
