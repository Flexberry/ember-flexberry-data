# Миграция: query-builder (дополнительные инструкции)

## remaining query-builder files

### 1. query/base-adapter.js, query/base-builder.js
- Ember: `BaseBuilder.extend({...})`
- Next.js: `export function buildQuery()` function

### 2. query/builder.js
- Ember: `Builder.extend({...})`
- Next.js: `export function buildODataQuery()` function

### 3. query/condition.js, query/predicate.js, query/filter-operator.js
- Ember: `Condition.create()`, `Predicate.create()`
- Next.js: `export function createCondition()`, `export function createPredicate()` functions

### 4. query/order-by-clause.js, query/parameter.js
- Ember: `OrderByClause.create()`, `Parameter.create()`
- Next.js: `export function createOrderByClause()`, `export function createParameter()` functions

### 5. query/indexeddb-adapter.js, query/js-adapter.js, query/odata-adapter.js
- Ember: `ODataAdapter.extend({...})`
- Next.js: `export function createODataAdapter()` function

Создать инструкции по аналогии с `INSTRUCTIONS_addon-query-*.js.md`
