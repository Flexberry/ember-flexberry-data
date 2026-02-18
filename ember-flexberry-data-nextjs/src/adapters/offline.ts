import { BaseAdapter } from '../query/base-adapter';

// Интерфейсы для работы с IndexedDB
interface IndexedDBTransaction {
  objectStore(name: string): IDBObjectStore;
}

interface IndexedDBObjectStore {
  add(value: any, key?: IDBValidKey): IDBRequest;
  put(value: any, key?: IDBValidKey): IDBRequest;
  get(key: IDBValidKey): IDBRequest;
  getAll(query?: IDBKeyRange | IDBValidKey, count?: number): IDBRequest;
  delete(key: IDBValidKey): IDBRequest;
  clear(): IDBRequest;
  index(name: string): IDBIndex;
  openCursor(range?: IDBKeyRange | IDBValidKey, direction?: IDBCursorDirection): IDBRequest;
}

/**
 * Offline адаптер для работы с локальным хранилищем
 */
export class OfflineAdapter extends BaseAdapter {
  /**
   * Имя базы данных
   */
  private dbName: string;

  /**
   * Версия базы данных
   */
  private dbVersion: number;

  /**
   * Конструктор адаптера
   * @param dbName - Имя базы данных
   * @param dbVersion - Версия базы данных
   */
  constructor(dbName: string, dbVersion: number = 1) {
    super();
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }

  /**
   * Инициализирует соединение с IndexedDB
   * @returns Promise с объектом базы данных
   */
  private async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Создание объектных хранилищ при необходимости
        // Это может быть расширено в будущем для более сложных сценариев
      };
    });
  }

  /**
   * Выполняет GET запрос к локальному хранилищу
   * @param url - URL запроса (в данном случае имя таблицы)
   * @returns Promise с результатом запроса
   */
  async findRecord(url: string): Promise<any> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([url], 'readonly');
      const objectStore = transaction.objectStore(url);
      const request = objectStore.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Находит запись по ID
   * @param url - Имя таблицы
   * @param id - ID записи
   * @returns Promise с результатом запроса
   */
  async findRecordById(url: string, id: string): Promise<any> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([url], 'readonly');
      const objectStore = transaction.objectStore(url);
      const request = objectStore.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Выполняет POST запрос к локальному хранилищу
   * @param url - URL запроса (в данном случае имя таблицы)
   * @param data - Данные для отправки
   * @returns Promise с результатом запроса
   */
  async createRecord(url: string, data: any): Promise<any> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([url], 'readwrite');
      const objectStore = transaction.objectStore(url);
      const request = objectStore.add(data);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Выполняет PUT запрос к локальному хранилищу
   * @param url - URL запроса (в данном случае имя таблицы)
   * @param data - Данные для отправки
   * @returns Promise с результатом запроса
   */
  async updateRecord(url: string, data: any): Promise<any> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([url], 'readwrite');
      const objectStore = transaction.objectStore(url);
      const request = objectStore.put(data);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Выполняет DELETE запрос к локальному хранилищу
   * @param url - URL запроса (в данном случае имя таблицы)
   * @returns Promise с результатом запроса
   */
  async deleteRecord(url: string): Promise<any> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([url], 'readwrite');
      const objectStore = transaction.objectStore(url);
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Удаляет запись по ID
   * @param url - Имя таблицы
   * @param id - ID записи
   * @returns Promise с результатом запроса
   */
  async deleteRecordById(url: string, id: string): Promise<any> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([url], 'readwrite');
      const objectStore = transaction.objectStore(url);
      const request = objectStore.delete(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}
