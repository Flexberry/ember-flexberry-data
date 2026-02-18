/**
 * Очередь для выполнения задач
 */

/**
 * Класс очереди задач
 */
export class Queue {
  private tasks: Array<() => Promise<any>> = [];

  /**
   * Добавляет задачу в очередь
   * @param task Функция задачи
   */
  push(task: () => Promise<any>): void {
    this.tasks.push(task);
  }

  /**
   * Выполняет все задачи в очереди
   * @returns Промис с результатом выполнения
   */
  async run(): Promise<any[]> {
    const results: any[] = [];
    for (const task of this.tasks) {
      results.push(await task());
    }
    return results;
  }
}
