# Модуль: offline-globals-service

## Файлы
- addon/services/offline-globals.js
- app/services/offline-globals.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовый сервис)

## Рекомендации по переносу

### Service → TypeScript Class or Hook

**Ember:** `Service.extend({})` → **Next.js:** `src/services/offlineGlobalsService.ts`

**Пример шаблона:**
```ts
// services/offlineGlobalsService.ts
import { Evented } from '@ember/object'; // или просто класс с events

export class OfflineGlobalsService extends Evented {
  isOnline: boolean = true;
  allowSyncDownRelatedRecordsWithoutProjection: boolean = false;

  constructor() {
    super();
    this.setupNetworkListener();
  }

  // Setup online/offline event listeners
  setupNetworkListener(): void {
    window.addEventListener('online', () => this.set('isOnline', true));
    window.addEventListener('offline', () => this.set('isOnline', false));
  }

  // Check if online
  checkOnline(): boolean {
    return navigator.onLine;
  }

  // Get/set online state
  get isOnline(): boolean {
    return this._isOnline;
  }

  set isOnline(value: boolean) {
    this._isOnline = value;
    this.trigger('onlineStateChange', value);
  }

  // Watch online state
  watchOnlineState(callback: (isOnline: boolean) => void): void {
    this.on('onlineStateChange', callback);
  }
}

// React Hook
import { useState, useEffect } from 'react';

export function useOfflineGlobals() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}
```

## Порядок действий при переносе

1. Создать `OfflineGlobalsService` класс
2. Реализовать `isOnline` state
3. Network event listeners
4. React hook для удобства

## Оценка трудозатрат

≈ 2-4 часа (low)

## Чек-лист для разработчика

- [ ] `OfflineGlobalsService` класс создан
- [ ] `isOnline` state
- [ ] Network event listeners
- [ ] React hook создан
- [ ] Тесты переписаны

## Примечания

- Ember service → TypeScript class
- Network API для online/offline
- React hook для удобства
