/**
 * Объект запроса для работы с данными
 */
export class QueryObject {
  /**
   * Имя модели
   */
  modelName: string;

  /**
   * Предикат для фильтрации
   */
  predicate: any;

  /**
   * Поля для выборки
   */
  select: string[];

  /**
   * Расширения связей
   */
  expand: any;

  /**
   * Порядок сортировки
   */
  order: any;

  /**
   * Пропустить записи
   */
  skip: number;

  /**
   * Ограничить количество записей
   */
  top: number | null;

  /**
   * Подсчитать общее количество записей
   */
  count: boolean;

  /**
   * Пользовательские параметры запроса
   */
  customQueryParams: any;

  /**
   * Конструктор объекта запроса
   * @param modelName - Имя модели
   */
  constructor(modelName: string) {
    this.modelName = modelName;
    this.select = [];
    this.expand = {};
    this.order = null;
    this.skip = 0;
    this.top = null;
    this.count = false;
    this.customQueryParams = {};
  }

  /**
   * Устанавливает предикат для фильтрации
   * @param predicate - Предикат
   * @returns Объект запроса
   */
  setPredicate(predicate: any): QueryObject {
    this.predicate = predicate;
    return this;
  }

  /**
   * Устанавливает поля для выборки
   * @param fields - Поля для выборки
   * @returns Объект запроса
   */
  setSelect(fields: string[]): QueryObject {
    this.select = fields;
    return this;
  }

  /**
   * Устанавливает расширения связей
   * @param expand - Расширения связей
   * @returns Объект запроса
   */
  setExpand(expand: any): QueryObject {
    this.expand = expand;
    return this;
  }

  /**
   * Устанавливает порядок сортировки
   * @param order - Порядок сортировки
   * @returns Объект запроса
   */
  setOrder(order: any): QueryObject {
    this.order = order;
    return this;
  }

  /**
   * Устанавливает количество пропускаемых записей
   * @param skip - Количество пропускаемых записей
   * @returns Объект запроса
   */
  setSkip(skip: number): QueryObject {
    this.skip = skip;
    return this;
  }

  /**
   * Устанавливает ограничение количества записей
   * @param top - Ограничение количества записей
   * @returns Объект запроса
   */
  setTop(top: number): QueryObject {
    this.top = top;
    return this;
  }

  /**
   * Устанавливает флаг подсчета записей
   * @param count - Флаг подсчета записей
   * @returns Объект запроса
   */
  setCount(count: boolean): QueryObject {
    this.count = count;
    return this;
  }

  /**
   * Добавляет пользовательский параметр запроса
   * @param key - Ключ параметра
   * @param value - Значение параметра
   * @returns Объект запроса
   */
  addCustomQueryParam(key: string, value: any): QueryObject {
    this.customQueryParams[key] = value;
    return this;
  }

  /**
   * Получает объект запроса в формате, подходящем для передачи в адаптеры
   * @returns Объект запроса
   */
  toQuery(): any {
    return {
      modelName: this.modelName,
      predicate: this.predicate,
      select: this.select,
      expand: this.expand,
      order: this.order,
      skip: this.skip,
      top: this.top,
      count: this.count,
      customQueryParams: this.customQueryParams
    };
  }
}
