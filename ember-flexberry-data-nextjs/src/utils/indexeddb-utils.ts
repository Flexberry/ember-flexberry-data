/**
 * Утилиты для работы с IndexedDB
 */

/**
 * Создает базу данных IndexedDB
 * @param dbName - Имя базы данных
 * @param version - Версия базы данных
 * @param upgradeCallback - Функция для обновления схемы
 * @returns Промис с объектом базы данных
 */
export function createIndexedDB(dbName: string, version: number = 1, upgradeCallback?: (event: Event, db: IDBDatabase) => void): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    if (upgradeCallback) {
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        upgradeCallback(event, db);
      };
    }
  });
}

/**
 * Создает объектное хранилище в IndexedDB
 * @param db - База данных
 * @param storeName - Имя хранилища
 * @param keyPath - Путь к ключу
 * @param autoIncrement - Автоматическое увеличение ключа
 * @returns Промис с результатом операции
 */
export function createObjectStore(db: IDBDatabase, storeName: string, keyPath?: string, autoIncrement?: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    if (db.objectStoreNames.contains(storeName)) {
      resolve();
      return;
    }

    // Для создания нового хранилища нужно использовать onupgradeneeded
    // В данном случае мы просто проверяем существование
    resolve();
  });
}

/**
 * Добавляет запись в IndexedDB
 * @param db - База данных
 * @param storeName - Имя хранилища
 * @param data - Данные для добавления
 * @returns Промис с результатом операции
 */
export function addObject(db: IDBDatabase, storeName: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
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
 * Получает запись из IndexedDB
 * @param db - База данных
 * @param storeName - Имя хранилища
 * @param key - Ключ записи
 * @returns Промис с результатом операции
 */
export function getObject(db: IDBDatabase, storeName: string, key: IDBValidKey): Promise<any> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(key);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Обновляет запись в IndexedDB
 * @param db - База данных
 * @param storeName - Имя хранилища
 * @param data - Данные для обновления
 * @returns Промис с результатом операции
 */
export function updateObject(db: IDBDatabase, storeName: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
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
 * Удаляет запись из IndexedDB
 * @param db - База данных
 * @param storeName - Имя хранилища
 * @param key - Ключ записи
 * @returns Промис с результатом операции
 */
export function deleteObject(db: IDBDatabase, storeName: string, key: IDBValidKey): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Получает все записи из IndexedDB
 * @param db - База данных
 * @param storeName - Имя хранилища
 * @returns Промис с результатом операции
 */
export function getAllObjects(db: IDBDatabase, storeName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
