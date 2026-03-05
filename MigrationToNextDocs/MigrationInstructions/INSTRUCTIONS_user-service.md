# Модуль: user-service

## Файлы
- addon/services/user.js
- app/services/user.js

## Зависимости (должны быть перенесены ДО этого модуля)
- none (базовый сервис)

## Рекомендации по переносу

### Service → TypeScript Class or Hook

**Ember:** `Service.extend({})` → **Next.js:** `src/services/userService.ts`

**Пример шаблона:**
```ts
// services/userService.ts
export class UserService {
  currentUser: any = null;
  currentUserPromise: Promise<any> | null = null;

  // Get current user name
  getCurrentUserName(): Promise<string> | string {
    if (this.currentUser) {
      return Promise.resolve(this.currentUser.name);
    }
    return new Promise((resolve, reject) => {
      this.getCurrentUser().then(user => {
        resolve(user?.name ?? '');
      }).catch(reject);
    });
  }

  // Get current user
  getCurrentUser(): Promise<any> {
    if (!this.currentUserPromise) {
      this.currentUserPromise = this.fetchCurrentUser();
    }
    return this.currentUserPromise;
  }

  // Fetch current user
  async fetchCurrentUser(): Promise<any> {
    // ... fetch user from API
  }

  // Login
  async login(credentials: { username: string; password: string }): Promise<any> {
    // ... login logic
  }

  // Logout
  async logout(): Promise<void> {
    this.currentUser = null;
    this.currentUserPromise = null;
    // ... logout logic
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}

// React Hook
import { useState, useEffect } from 'react';

export function useUser() {
  const [userService] = useState(() => new UserService());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    userService.getCurrentUser().then(setUser);
  }, []);

  return { user, ...userService };
}
```

## Порядок действий при переносе

1. Создать `UserService` класс
2. Реализовать `getCurrentUser()`, `getCurrentUserName()`
3. Login/logout methods
4. React hook

## Оценка трудозатрат

≈ 2-4 часа (low)

## Чек-лист для разработчика

- [ ] `UserService` класс создан
- [ ] `getCurrentUser()`, `getCurrentUserName()`
- [ ] Login/logout methods
- [ ] React hook создан
- [ ] Тесты переписаны

## Примечания

- Ember service → TypeScript class
- React hook для удобства
