import { BaseStore } from '../stores/base-store';
import { LocalStore } from '../stores/local-store';
import { OnlineStore } from '../stores/online-store';
import { QueryObject } from '../query/query-object';

/**
 * Тип операции для аудита.
 */
export type SyncOperationType = 'INSERT' | 'UPDATE' | 'DELETE';

/**
 * Упрощённая запись аудита синхронизации.
 */
export interface SyncAuditEntry {
  modelName: string;
  operation: SyncOperationType;
  id: string | null;
  timestamp: Date;
  payload?: any;
  error?: unknown;
}

/**
 * Сервис синхронизации данных между онлайн и оффлайн режимами.
 * Не зависит от Ember и ориентирован на использование в Next/React.
 */
export class SyncerService {
  private onlineStore: OnlineStore | BaseStore;
  private offlineStore: LocalStore | BaseStore;

  /**
   * Журнал последних операций синхронизации (в памяти).
   * Можно использовать для отладки или отображения статуса в UI.
   */
  private auditLog: SyncAuditEntry[] = [];

  constructor(onlineStore: OnlineStore | BaseStore, offlineStore: LocalStore | BaseStore) {
    this.onlineStore = onlineStore;
    this.offlineStore = offlineStore;
  }

  /**
   * Синхронизирует данные из онлайн в оффлайн (down).
   * По умолчанию перезаписывает записи в оффлайне.
   */
  async syncToOffline(modelName: string, query?: QueryObject, options?: { clearBefore?: boolean }): Promise<void> {
    try {
      if (options?.clearBefore && 'deleteAllRecords' in this.offlineStore) {
        await (this.offlineStore as any).deleteAllRecords(modelName);
      }

      const data = await (this.onlineStore as any).findRecords(modelName, query);

      for (const record of data) {
        const id = (record as any)?.id ?? null;

        if (id && 'updateRecord' in this.offlineStore) {
          await (this.offlineStore as any).updateRecord(modelName, id, record);
          this.addAuditEntry({ modelName, operation: 'UPDATE', id, payload: record });
        } else {
          const created = await (this.offlineStore as any).createRecord(modelName, record);
          const createdId = (created as any)?.id ?? id;
          this.addAuditEntry({ modelName, operation: 'INSERT', id: createdId, payload: created });
        }
      }
    } catch (error) {
      this.addAuditEntry({
        modelName,
        operation: 'INSERT',
        id: null,
        payload: null,
        error,
      });
      throw error;
    }
  }

  /**
   * Синхронизирует данные из оффлайн в онлайн (up).
   * Простая стратегия:
   * - если есть id — пытаемся обновить запись онлайн;
   * - если id нет — создаём новую запись онлайн.
   */
  async syncToOnline(modelName: string): Promise<void> {
    try {
      const offlineData = await (this.offlineStore as any).findAllRecords(modelName);

      for (const record of offlineData) {
        const id = (record as any)?.id ?? null;

        try {
          let result;
          if (id) {
            result = await (this.onlineStore as any).updateRecord(modelName, id, record);
            this.addAuditEntry({ modelName, operation: 'UPDATE', id, payload: result });
          } else {
            result = await (this.onlineStore as any).createRecord(modelName, record);
            const createdId = (result as any)?.id ?? null;
            this.addAuditEntry({ modelName, operation: 'INSERT', id: createdId, payload: result });
          }
        } catch (e) {
          this.addAuditEntry({
            modelName,
            operation: id ? 'UPDATE' : 'INSERT',
            id,
            payload: record,
            error: e,
          });
        }
      }
    } catch (error) {
      this.addAuditEntry({
        modelName,
        operation: 'UPDATE',
        id: null,
        payload: null,
        error,
      });
      throw error;
    }
  }

  /**
   * Простейшая проверка доступности сервера.
   * Можно переопределить и использовать свой health‑endpoint.
   */
  async isOnline(healthUrl = '/api/health'): Promise<boolean> {
    if (typeof fetch === 'undefined') {
      // В среде без fetch (например, старый Node) считаем, что offline.
      return false;
    }

    try {
      const response = await fetch(healthUrl, { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Наивная проверка того, что в оффлайне есть данные, которые можно попытаться синхронизировать.
   * В реальном приложении вы можете реализовать более сложный механизм меток изменений.
   */
  async hasChanges(modelName: string): Promise<boolean> {
    if (!('findAllRecords' in this.offlineStore)) {
      return false;
    }

    const offlineData = await (this.offlineStore as any).findAllRecords(modelName);
    return Array.isArray(offlineData) && offlineData.length > 0;
  }

  /**
   * Возвращает копию журнала аудита.
   */
  getAuditLog(): SyncAuditEntry[] {
    return [...this.auditLog];
  }

  /**
   * Очищает журнал аудита.
   */
  clearAuditLog(): void {
    this.auditLog = [];
  }

  private addAuditEntry(entry: Omit<SyncAuditEntry, 'timestamp'>): void {
    this.auditLog.push({
      ...entry,
      timestamp: new Date(),
    });
  }
}
