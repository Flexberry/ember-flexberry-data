/**
 * Базовый класс предиката
 */
export class BasePredicate {
  /**
   * Конструктор предиката
   */
  constructor() {
  }
}

/**
 * Простой предикат
 */
export class SimplePredicate extends BasePredicate {
  /**
   * Атрибут
   */
  attributePath: string;

  /**
   * Оператор
   */
  operator: string;

  /**
   * Значение
   */
  value: any;

  /**
   * Конструктор предиката
   * @param attributePath - Путь к атрибуту
   * @param operator - Оператор
   * @param value - Значение
   */
  constructor(attributePath: string, operator: string, value: any) {
    super();
    this.attributePath = attributePath;
    this.operator = operator;
    this.value = value;
  }
}

/**
 * Предикат даты
 */
export class DatePredicate extends SimplePredicate {
  /**
   * Флаг без времени
   */
  timeless: boolean;

  /**
   * Конструктор предиката
   * @param attributePath - Путь к атрибуту
   * @param operator - Оператор
   * @param value - Значение
   * @param timeless - Флаг без времени
   */
  constructor(attributePath: string, operator: string, value: any, timeless?: boolean) {
    super(attributePath, operator, value);
    this.timeless = timeless || false;
  }
}

/**
 * Строковый предикат
 */
export class StringPredicate extends BasePredicate {
  /**
   * Путь к атрибуту
   */
  attributePath: string;

  /**
   * Значение для поиска
   */
  containsValue: string;

  /**
   * Конструктор предиката
   * @param attributePath - Путь к атрибуту
   * @param containsValue - Значение для поиска
   */
  constructor(attributePath: string, containsValue?: string) {
    super();
    this.attributePath = attributePath;
    this.containsValue = containsValue || '';
  }

  /**
   * Метод для поиска подстроки
   * @param value - Значение для поиска
   * @returns Строковый предикат
   */
  contains(value: string): StringPredicate {
    this.containsValue = value;
    return this;
  }
}

/**
 * Предикат деталей
 */
export class DetailPredicate extends BasePredicate {
  /**
   * Путь к детали
   */
  detailPath: string;

  /**
   * Предикат
   */
  predicate: BasePredicate;

  /**
   * Флаг "все"
   */
  isAll: boolean;

  /**
   * Флаг "любой"
   */
  isAny: boolean;

  /**
   * Конструктор предиката
   * @param detailPath - Путь к детали
   * @param predicate - Предикат
   * @param isAll - Флаг "все"
   * @param isAny - Флаг "любой"
   */
  constructor(detailPath: string, predicate?: BasePredicate, isAll?: boolean, isAny?: boolean) {
    super();
    this.detailPath = detailPath;
    this.predicate = predicate || new SimplePredicate('', '', '');
    this.isAll = isAll || false;
    this.isAny = isAny || false;
  }

  /**
   * Метод для "все"
   * @param predicate - Предикат
   * @returns Предикат деталей
   */
  all(predicate: BasePredicate): DetailPredicate {
    this.isAll = true;
    this.isAny = false;
    this.predicate = predicate;
    return this;
  }

  /**
   * Метод для "любой"
   * @param predicate - Предикат
   * @returns Предикат деталей
   */
  any(predicate: BasePredicate): DetailPredicate {
    this.isAll = false;
    this.isAny = true;
    this.predicate = predicate;
    return this;
  }
}

/**
 * Комплексный предикат
 */
export class ComplexPredicate extends BasePredicate {
  /**
   * Условие
   */
  condition: string;

  /**
   * Предикаты
   */
  predicates: BasePredicate[];

  /**
   * Конструктор предиката
   * @param condition - Условие
   * @param predicates - Предикаты
   */
  constructor(condition: string, ...predicates: BasePredicate[]) {
    super();
    this.condition = condition;
    this.predicates = predicates;
  }

  /**
   * Логическое "И"
   * @param predicate - Предикат
   * @returns Комплексный предикат
   */
  and(predicate: BasePredicate): ComplexPredicate {
    this.predicates.push(predicate);
    return this;
  }

  /**
   * Логическое "ИЛИ"
   * @param predicate - Предикат
   * @returns Комплексный предикат
   */
  or(predicate: BasePredicate): ComplexPredicate {
    this.predicates.push(predicate);
    return this;
  }
}

/**
 * Географический предикат
 */
export class GeographyPredicate extends BasePredicate {
  /**
   * Путь к атрибуту
   */
  attributePath: string;

  /**
   * Значение для пересечения
   */
  intersectsValue: string;

  /**
   * Конструктор предиката
   * @param attributePath - Путь к атрибуту
   * @param intersectsValue - Значение для пересечения
   */
  constructor(attributePath: string, intersectsValue?: string) {
    super();
    this.attributePath = attributePath;
    this.intersectsValue = intersectsValue || '';
  }

  /**
   * Метод для пересечения
   * @param value - Значение для пересечения
   * @returns Географический предикат
   */
  intersects(value: string): GeographyPredicate {
    this.intersectsValue = value;
    return this;
  }
}

/**
 * Геометрический предикат
 */
export class GeometryPredicate extends BasePredicate {
  /**
   * Путь к атрибуту
   */
  attributePath: string;

  /**
   * Значение для пересечения
   */
  intersectsValue: string;

  /**
   * Конструктор предиката
   * @param attributePath - Путь к атрибуту
   * @param intersectsValue - Значение для пересечения
   */
  constructor(attributePath: string, intersectsValue?: string) {
    super();
    this.attributePath = attributePath;
    this.intersectsValue = intersectsValue || '';
  }

  /**
   * Метод для пересечения
   * @param value - Значение для пересечения
   * @returns Геометрический предикат
   */
  intersects(value: string): GeometryPredicate {
    this.intersectsValue = value;
    return this;
  }
}

/**
 * Предикат "НЕ"
 */
export class NotPredicate extends BasePredicate {
  /**
   * Предикат
   */
  predicate: BasePredicate;

  /**
   * Конструктор предиката
   * @param predicate - Предикат
   */
  constructor(predicate: BasePredicate) {
    super();
    this.predicate = predicate;
  }
}

/**
 * Предикат "isof"
 */
export class IsOfPredicate extends BasePredicate {
  /**
   * Тип
   */
  typeName: string;

  /**
   * Выражение
   */
  expression: string;

  /**
   * Конструктор предиката
   * @param typeName - Тип
   * @param expression - Выражение
   */
  constructor(typeName: string, expression?: string) {
    super();
    this.typeName = typeName;
    this.expression = expression || '';
  }
}

/**
 * Предикат "истина"
 */
export class TruePredicate extends BasePredicate {
  /**
   * Конструктор предиката
   */
  constructor() {
    super();
  }
}

/**
 * Предикат "ложь"
 */
export class FalsePredicate extends BasePredicate {
  /**
   * Конструктор предиката
   */
  constructor() {
    super();
  }
}
