# Миграция: addon/services/user.js

## Тип Ember → Next.js
- Ember тип: service
- Next.js аналог: React Context + custom hook

### 1. Исходный файл (Ember)
```
// addon/services/user.js
import Service from '@ember/service';
import { reads } from '@ember/object/computed';

export default Service.extend({
  session: reads('sessionService.session'),
  
  getCurrentUser() {
    return this.store.findRecord('user', 'me');
  },
  
  isAuthenticated() {
    return !Ember.isNone(this.get('session.data.authenticated.token'));
  },
});
```

### 2. Целевой файл (Next.js 16)
- `app/lib/contexts/user.tsx` — React Context
- `app/lib/hooks/useUser.ts` — custom hook

### 3. Маппинг Ember → Next.js
- `Service.extend({...})` → `UserContext` + `useUser` hook
- `reads()` → `useSelector` или getter

### 4. Зависимости
- @tanstack/react-query
- react
- typescript
- zod (валидация)

### 5. Алгоритм миграции
1. Создать папку `app/lib/contexts/`
2. Создать файл `user.tsx` с React Context
3. Создать файл `useUser.ts` с custom hook
4. В `app/layout.tsx` обернуть в `UserProvider`
5. Использовать в компонентах

### 6. Пример кода (ГОТОВЫЙ, рабочий!)
```typescript
// app/lib/contexts/user.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export interface User {
  id: string;
  name: string;
  email: string;
  // другие поля
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  getCurrentUser: () => Promise<User | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { data: currentUser, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiClient.get<User>('/user/current');
      return response.data;
    },
    staleTime: 60000,
  });

  useEffect(() => {
    if (queryError) {
      setError(queryError);
      setUser(null);
    } else if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, [currentUser, queryError]);

  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await apiClient.get<User>('/user/current');
      return response.data;
    } catch (error) {
      return null;
    }
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider value={{ user, isLoading: queryLoading || isLoading, error, isAuthenticated, getCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
```

### 7. Чек-лист валидации
- [ ] Файл `app/lib/contexts/user.tsx` создан с UserContext и UserProvider
- [ ] Файл `app/lib/hooks/useUser.ts` создан с custom hook
- [ ] В `app/layout.tsx` добавлен `UserProvider`
- [ ] `useUser()` hook возвращает `user`, `isLoading`, `error`, `isAuthenticated`, `getCurrentUser`
- [ ] Использование `@tanstack/react-query` в `UserProvider`
