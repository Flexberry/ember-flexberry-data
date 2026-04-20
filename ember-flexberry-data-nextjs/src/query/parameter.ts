/**
 * Базовый класс параметра
 */
export class BaseParam {
  /**
   * Конструктор параметра
   */
  constructor() {
  }
}

/**
 * Параметр константы
 */
export class ConstParam extends BaseParam {
  /**
   * Значение константы
   */
  constValue: any;

  /**
   * Конструктор параметра
   * @param constValue - Значение константы
   */
  constructor(constValue: any) {
    super();
    this.constValue = constValue;
  }
}

/**
 * Параметр атрибута
 */
export class AttributeParam extends BaseParam {
  /**
   * Путь к атрибуту
   */
  attributePath: string;

  /**
   * Конструктор параметра
   * @param attributePath - Путь к атрибуту
   */
  constructor(attributePath: string) {
    super();
    this.attributePath = attributePath;
  }
}
