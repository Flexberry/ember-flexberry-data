/**
 * Простая система управления зависимостями (DI Container)
 */
export class Container {
  private services: Map<string, any> = new Map();
  private singletons: Map<string, any> = new Map();

  /**
   * Регистрирует сервис
   * @param name - Имя сервиса
   * @param service - Класс сервиса
   * @param singleton - Использовать как синглтон
   */
  register(name: string, service: any, singleton: boolean = false): void {
    this.services.set(name, { service, singleton });
  }

  /**
   * Получает сервис
   * @param name - Имя сервиса
   * @returns Экземпляр сервиса
   */
  get(name: string): any {
    const serviceInfo = this.services.get(name);
    if (!serviceInfo) {
      throw new Error(`Сервис "${name}" не зарегистрирован`);
    }

    if (serviceInfo.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, new serviceInfo.service());
      }
      return this.singletons.get(name);
    }

    return new serviceInfo.service();
  }

  /**
   * Удаляет сервис из кэша (для тестирования)
   * @param name - Имя сервиса
   */
  unregister(name: string): void {
    this.singletons.delete(name);
  }
}

// Глобальный контейнер
export const container = new Container();
