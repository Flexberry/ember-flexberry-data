import { describe, it, expect, beforeEach, vi } from 'vitest';

interface User {
  name: string;
  id: string;
  isUser: boolean;
  isGroup: boolean;
  isRole: boolean;
}

class UserService {
  private _currentUser: User | null = null;
  private _currentUserPromise: Promise<User> | null = null;

  getCurrentUser(): Promise<User | null> {
    if (!this._currentUserPromise) {
      this._currentUserPromise = this.fetchCurrentUser();
    }
    return this._currentUserPromise;
  }

  getCurrentUserName(): Promise<string> {
    if (this._currentUser) {
      return Promise.resolve(this._currentUser.name);
    }
    return new Promise((resolve) => {
      this.getCurrentUser().then((user) => {
        resolve(user?.name ?? 'userName');
      });
    });
  }

  async fetchCurrentUser(): Promise<User | null> {
    if (this._currentUser) {
      return this._currentUser;
    }
    return null;
  }

  async login(credentials: { username: string; password: string }): Promise<User | null> {
    this._currentUser = {
      id: '1',
      name: credentials.username,
      isUser: true,
      isGroup: false,
      isRole: false
    };
    this._currentUserPromise = Promise.resolve(this._currentUser);
    return this._currentUser;
  }

  async logout(): Promise<void> {
    this._currentUser = null;
    this._currentUserPromise = null;
  }

  isLoggedIn(): boolean {
    return !!this._currentUser;
  }

  setCurrentUser(user: User | null): void {
    this._currentUser = user;
    this._currentUserPromise = user ? Promise.resolve(user) : null;
  }
}

describe('userService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should initialize without current user', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getCurrentUser()).resolves.toBeNull();
  });

  it('should get current user name with default value', async () => {
    const name = await service.getCurrentUserName();
    expect(name).toBe('userName');
  });

  it('should return username from current user', async () => {
    const user = { id: '1', name: 'Test User', isUser: true, isGroup: false, isRole: false };
    service.setCurrentUser(user);

    const name = await service.getCurrentUserName();
    expect(name).toBe('Test User');
  });

  it('should login user with credentials', async () => {
    const credentials = { username: 'testuser', password: 'password123' };
    const user = await service.login(credentials);

    expect(user).toBeDefined();
    expect(user?.name).toBe('testuser');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should logout user', async () => {
    const credentials = { username: 'testuser', password: 'password123' };
    await service.login(credentials);
    expect(service.isLoggedIn()).toBe(true);

    await service.logout();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should cache current user promise', async () => {
    vi.spyOn(service, 'fetchCurrentUser').mockImplementation(() => {
      return new Promise<User | null>((resolve) => {
        setTimeout(() => resolve(null), 10);
      });
    });

    const promise1 = service.getCurrentUser();
    const promise2 = service.getCurrentUser();

    expect(promise1).toBe(promise2);
    expect(service.fetchCurrentUser).toHaveBeenCalledTimes(1);
  });

  it('should handle concurrent getCurrentUser calls', async () => {
    const promise1 = service.getCurrentUser();
    const promise2 = service.getCurrentUser();

    const [user1, user2] = await Promise.all([promise1, promise2]);
    expect(user1).toBe(user2);
  });

  it('should return null for current user when not logged in', async () => {
    const user = await service.getCurrentUser();
    expect(user).toBeNull();
  });

  it('should set current user directly', () => {
    const user = { id: '1', name: 'Direct User', isUser: true, isGroup: false, isRole: false };
    service.setCurrentUser(user);

    expect(service.isLoggedIn()).toBe(true);
    expect(service._currentUser).toBe(user);
  });

  it('should clear current user on logout', async () => {
    const user = { id: '1', name: 'Test User', isUser: true, isGroup: false, isRole: false };
    service.setCurrentUser(user);
    expect(service.isLoggedIn()).toBe(true);

    await service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service._currentUser).toBeNull();
  });
});
