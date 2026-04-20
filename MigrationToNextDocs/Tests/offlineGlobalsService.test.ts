import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

class OfflineGlobalsService {
  private _isOnline: boolean = false;
  private _isOfflineEnabled: boolean = true;
  private _isModeSwitchOnErrorsEnabled: boolean = false;
  private _isSyncDownWhenOnlineEnabled: boolean = true;
  private _allowSyncDownRelatedRecordsWithoutProjection: boolean = false;
  private onlineStateCallbacks: ((isOnline: boolean) => void)[] = [];

  constructor() {
    this._isOnline = navigator.onLine;
    this.setupNetworkListener();
  }

  setupNetworkListener(): void {
    window.addEventListener('online', () => this.setOnlineAvailable(true));
    window.addEventListener('offline', () => this.setOnlineAvailable(false));
  }

  checkOnlineAvailable(): boolean {
    return navigator.onLine;
  }

  setOnlineAvailable(isOnline: boolean): void {
    this._isOnline = isOnline;
    const eventName = isOnline ? 'online' : 'offline';
    this.onlineStateCallbacks.forEach(callback => callback(isOnline));
  }

  watchOnlineState(callback: (isOnline: boolean) => void): void {
    this.onlineStateCallbacks.push(callback);
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  get isOfflineEnabled(): boolean {
    return this._isOfflineEnabled;
  }

  get isModeSwitchOnErrorsEnabled(): boolean {
    return this._isModeSwitchOnErrorsEnabled;
  }

  get isSyncDownWhenOnlineEnabled(): boolean {
    return this._isSyncDownWhenOnlineEnabled;
  }

  get allowSyncDownRelatedRecordsWithoutProjection(): boolean {
    return this._allowSyncDownRelatedRecordsWithoutProjection;
  }

  getOfflineSchema(): Record<string, string> {
    return {
      'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity':
        'id,objectPrimaryKey,operationTime,operationType,executionResult,source,serializedField,' +
        'createTime,creator,editTime,editor,user,objectType,*auditFields',
      'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-field':
        'id,field,caption,oldValue,newValue,mainChange,auditEntity',
      'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-object-type':
        'id,name',
      'i-c-s-soft-s-t-o-r-m-n-e-t-security-agent':
        'id,name,login,pwd,isUser,isGroup,isRole,connString,enabled,email,full,read,insert,update,' +
        'delete,execute,createTime,creator,editTime,editor',
      'i-c-s-soft-s-t-o-r-m-n-e-t-security-link-group':
        'id,createTime,creator,editTime,editor,group,user',
      'i-c-s-soft-s-t-o-r-m-n-e-t-security-session':
        'id,userKey,startedAt,lastAccess,closed',
    };
  }
}

describe('offlineGlobalsService', () => {
  let service: OfflineGlobalsService;

  beforeEach(() => {
    vi.resetAllMocks();
    service = new OfflineGlobalsService();
  });

  it('should initialize with isOnline = true when navigator.onLine is true', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const newService = new OfflineGlobalsService();
    expect(newService.isOnline).toBe(true);
  });

  it('should initialize with isOnline = false when navigator.onLine is false', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const newService = new OfflineGlobalsService();
    expect(newService.isOnline).toBe(false);
  });

  it('should check online availability', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    expect(service.checkOnlineAvailable()).toBe(true);
  });

  it('should watch online state changes', () => {
    let callbackCalled = false;
    let lastOnlineValue = false;

    service.watchOnlineState((isOnline) => {
      callbackCalled = true;
      lastOnlineValue = isOnline;
    });

    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    service.setOnlineAvailable(true);

    expect(callbackCalled).toBe(true);
    expect(lastOnlineValue).toBe(true);
  });

  it('should trigger online event callback', () => {
    let callbackCalled = false;

    service.watchOnlineState((isOnline) => {
      callbackCalled = isOnline;
    });

    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    service.setOnlineAvailable(true);

    expect(callbackCalled).toBe(true);
  });

  it('should trigger offline event callback', () => {
    let callbackCalled = false;

    service.watchOnlineState((isOnline) => {
      callbackCalled = isOnline;
    });

    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    service.setOnlineAvailable(false);

    expect(callbackCalled).toBe(false);
  });

  it('should return offline schema', () => {
    const schema = service.getOfflineSchema();

    expect(schema).toBeDefined();
    expect(schema).toHaveProperty('i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity');
    expect(schema).toHaveProperty('i-c-s-soft-s-t-o-r-m-n-e-t-security-agent');
    expect(schema).toHaveProperty('i-c-s-soft-s-t-o-r-m-n-e-t-security-session');
  });

  it('should have default config values', () => {
    expect(service.isOfflineEnabled).toBe(true);
    expect(service.isModeSwitchOnErrorsEnabled).toBe(false);
    expect(service.isSyncDownWhenOnlineEnabled).toBe(true);
    expect(service.allowSyncDownRelatedRecordsWithoutProjection).toBe(false);
  });

  it('should handle multiple online state callbacks', () => {
    let callback1Called = false;
    let callback2Called = false;

    service.watchOnlineState(() => { callback1Called = true; });
    service.watchOnlineState(() => { callback2Called = true; });

    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    service.setOnlineAvailable(true);

    expect(callback1Called).toBe(true);
    expect(callback2Called).toBe(true);
  });

  it('should update online state when online event fires', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    service = new OfflineGlobalsService();
    expect(service.isOnline).toBe(false);

    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    window.dispatchEvent(new Event('online'));

    expect(service.isOnline).toBe(true);
  });

  it('should update online state when offline event fires', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    service = new OfflineGlobalsService();
    expect(service.isOnline).toBe(true);

    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    window.dispatchEvent(new Event('offline'));

    expect(service.isOnline).toBe(false);
  });
});
