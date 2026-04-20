# Миграция: mixins (дополнительные инструкции)

## remaining mixins

### 1. mixin/adapter.js
- Ember: `Mixin.create({...})`
- Next.js: `export function useAdapter()` hook

### 2. mixin/store.js
- Ember: `Mixin.create({...})`
- Next.js: `export function useStore()` hook

### 3. mixin/audit-model.js
- Ember: `Mixin.create({...})`
- Next.js: `export function useAuditModel()` hook

### 4. mixin/regenerated/models/*.js (6 файлов)
- Ember: `Mixin.create({...})`
- Next.js: `export function use<Model>Mixin()` hook

Создать инструкции по аналогии с `INSTRUCTIONS_addon-mixins-*.js.md`
