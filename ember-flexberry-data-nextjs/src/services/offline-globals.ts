/**
 * Сервис глобальных настроек для оффлайн-режима
 */
export class OfflineGlobalsService {
  /**
   * Настройки оффлайн-режима
   */
  private offlineSettings: any = {};

  /**
   * Устанавливает настройки оффлайн-режима
   * @param settings - Настройки
   */
  setSettings(settings: any): void {
    this.offlineSettings = { ...this.offlineSettings, ...settings };
  }

  /**
   * Получает настройки оффлайн-режима
   * @returns Настройки
   */
  getSettings(): any {
    return this.offlineSettings;
  }

  /**
   * Получает конкретную настройку
   * @param key - Ключ настройки
   * @returns Значение настройки
   */
  getSetting(key: string): any {
    return this.offlineSettings[key];
  }

  /**
   * Устанавливает конкретную настройку
   * @param key - Ключ настройки
   * @param value - Значение настройки
   */
  setSetting(key: string, value: any): void {
    this.offlineSettings[key] = value;
  }
}
