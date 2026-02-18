import { BaseAdapter } from '../query/base-adapter';
import axios, { AxiosInstance } from 'axios';
import { SimplePredicate, ComplexPredicate, StringPredicate, DetailPredicate, DatePredicate, GeographyPredicate, GeometryPredicate, NotPredicate, IsOfPredicate, TruePredicate, FalsePredicate } from '../query/predicate';
import { FilterOperator } from '../query/filter-operator';
import { ConstParam, AttributeParam } from '../query/parameter';

/**
 * OData адаптер для работы с OData бэкендом
 */
export class ODataAdapter extends BaseAdapter {
  /**
   * Экземпляр axios для выполнения HTTP запросов
   */
  private axiosClient: AxiosInstance;

  /**
   * Базовый URL OData сервиса
   */
  private baseUrl: string;

  /**
   * Конструктор адаптера
   * @param baseUrl - URL бэкенда
   * @param options - Опции клиента
   */
  constructor(baseUrl: string, options?: any) {
    super();
    this.baseUrl = baseUrl;
    this.axiosClient = axios.create({
      baseURL: baseUrl,
      ...options
    });
  }

  /**
   * Получает параметры запроса OData из объекта запроса
   * @param query - Объект запроса
   * @returns Объект параметров OData
   */
  getODataQuery(query: any): any {
    let odataArgs: any = {};

    if (query.predicate) {
      odataArgs.$filter = this._buildODataFilters(query);
    }

    if (query.order) {
      odataArgs.$orderby = this._buildODataOrderBy(query);
    }

    if (query.skip !== undefined) {
      odataArgs.$skip = this._buildODataSkip(query);
    }

    if (query.top !== undefined) {
      odataArgs.$top = this._buildODataTop(query);
    }

    if (query.count) {
      odataArgs.$count = this._buildODataCount(query);
    }

    if (query.select) {
      odataArgs.$select = this._buildODataSelect(query);
    }

    if (query.expand) {
      odataArgs.$expand = this._buildODataExpand(query);
    }

    // Добавляем пользовательские параметры запроса
    if (query.customQueryParams) {
      for (let param in query.customQueryParams) {
        if (query.customQueryParams.hasOwnProperty(param)) {
          odataArgs[param] = query.customQueryParams[param];
        }
      }
    }

    return odataArgs;
  }

  /**
   * Получает полный URL для запроса OData
   * @param query - Объект запроса
   * @returns Полный URL
   */
  getODataFullUrl(query: any): string {
    let odataArgs = this.getODataQuery(query);
    let queryArgs: string[] = [];

    for (let key in odataArgs) {
      if (odataArgs.hasOwnProperty(key) && odataArgs[key] !== null && odataArgs[key] !== undefined) {
        queryArgs.push(`${key}=${odataArgs[key]}`);
      }
    }

    let queryMark = queryArgs.length > 0 ? '?' : '';
    let queryPart = queryArgs.join('&');

    return `${this.baseUrl}${queryMark}${queryPart}`;
  }

  /**
   * Выполняет GET запрос к бэкенду
   * @param url - URL запроса
   * @param options - Опции запроса
   * @returns Promise с результатом запроса
   */
  async findRecord(url: string, options?: any): Promise<any> {
    try {
      const response = await this.axiosClient.get(url, options);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при выполнении GET запроса к ${url}: ${error}`);
    }
  }

  /**
   * Выполняет POST запрос к бэкенду
   * @param url - URL запроса
   * @param data - Данные для отправки
   * @param options - Опции запроса
   * @returns Promise с результатом запроса
   */
  async createRecord(url: string, data: any, options?: any): Promise<any> {
    try {
      const response = await this.axiosClient.post(url, data, options);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при выполнении POST запроса к ${url}: ${error}`);
    }
  }

  /**
   * Выполняет PUT запрос к бэкенду
   * @param url - URL запроса
   * @param data - Данные для отправки
   * @param options - Опции запроса
   * @returns Promise с результатом запроса
   */
  async updateRecord(url: string, data: any, options?: any): Promise<any> {
    try {
      const response = await this.axiosClient.put(url, data, options);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при выполнении PUT запроса к ${url}: ${error}`);
    }
  }

  /**
   * Выполняет DELETE запрос к бэкенду
   * @param url - URL запроса
   * @param options - Опции запроса
   * @returns Promise с результатом запроса
   */
  async deleteRecord(url: string, options?: any): Promise<any> {
    try {
      const response = await this.axiosClient.delete(url, options);
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка при выполнении DELETE запроса к ${url}: ${error}`);
    }
  }

  /**
   * Строит фильтр OData
   * @param query - Объект запроса
   * @returns Строка фильтра OData
   */
  private _buildODataFilters(query: any): string | null {
    let predicate = query.predicate;

    // Loading data using `CollectionName(Id)` syntax is not supported
    // by default logic of `DS.JSONSerializer` with our store mixin (it
    // supposes arrays when uses `query` method).
    // Specified `id` should be used simply as a filter.
    if (query.id) {
      if (!predicate) {
        predicate = new SimplePredicate('id', FilterOperator.Eq, query.id);
      } else {
        predicate = predicate.and(new SimplePredicate('id', FilterOperator.Eq, query.id));
      }
    }

    if (!predicate) {
      return null;
    }

    return this._convertPredicateToODataFilterClause(predicate, query.modelName, '', 0);
  }

  /**
   * Строит порядок сортировки OData
   * @param query - Объект запроса
   * @returns Строка порядка сортировки OData
   */
  private _buildODataOrderBy(query: any): string | null {
    if (!query.order) {
      return null;
    }

    let result = '';
    for (let i = 0; i < query.order.length; i++) {
      let property = query.order.attribute(i);
      let sep = i ? ',' : '';
      let direction = property.direction ? ` ${property.direction}` : '';
      let attribute = this._getODataAttributeName(query.modelName, property.name);
      result += `${sep}${attribute}${direction}`;
    }

    return result;
  }

  /**
   * Строит пропуск записей OData
   * @param query - Объект запроса
   * @returns Значение пропуска
   */
  private _buildODataSkip(query: any): number | null {
    return query.skip;
  }

  /**
   * Строит ограничение количества записей OData
   * @param query - Объект запроса
   * @returns Значение ограничения
   */
  private _buildODataTop(query: any): number | null {
    return query.top;
  }

  /**
   * Строит флаг подсчета записей OData
   * @param query - Объект запроса
   * @returns Значение флага подсчета
   */
  private _buildODataCount(query: any): boolean | null {
    return query.count ? true : null;
  }

  /**
   * Строит выборку полей OData
   * @param query - Объект запроса
   * @returns Строка выборки
   */
  private _buildODataSelect(query: any): string {
    return query.select.map((i: string) => this._getODataAttributeName(query.modelName, i, true)).join(',');
  }

  /**
   * Строит расширение связей OData
   * @param query - Объект запроса
   * @returns Строка расширения
   */
  private _buildODataExpand(query: any): string {
    let f = (select: any[], expand: any, modelName: string): any => {
      let oDataSelect = select
        .map(i => this._getODataAttributeName(modelName, i, true))
        .join(',');

      let oDataExpand = Object.keys(expand)
        .map(i => {
          let data = expand[i];
          let { oDataSelect, oDataExpand } = f(data.select, data.expand, this._getModelName(modelName, i));

          let m = [];
          let b = false;

          if (oDataSelect) {
            m.push(`$select=${oDataSelect}`);
            b = true;
          }

          if (oDataExpand) {
            m.push(`$expand=${oDataExpand}`);
            b = true;
          }

          let p1 = b ? '(' : '';
          let p2 = b ? ')' : '';
          let attribute = this._getODataAttributeName(modelName, i, true);
          return `${attribute}${p1}${m.join(';')}${p2}`;
        })
        .join(',');

      return { oDataSelect, oDataExpand };
    };

    return f(query.select, query.expand, query.modelName).oDataExpand;
  }

  /**
   * Конвертирует предикат в строку OData фильтра
   * @param predicate - Предикат для конвертации
   * @param modelName - Имя модели
   * @param prefix - Префикс для детальных атрибутов
   * @param level - Уровень вложенности для рекурсии
   * @returns Строка фильтра OData
   */
  private _convertPredicateToODataFilterClause(predicate: any, modelName: string, prefix: string, level: number): string {
    if (predicate instanceof SimplePredicate || predicate instanceof DatePredicate) {
      return this._buildODataSimplePredicate(predicate, modelName, prefix);
    }

    if (predicate instanceof StringPredicate) {
      let attribute = this._getODataAttributeName(modelName, predicate.attributePath);
      if (prefix) {
        attribute = `${prefix}/${attribute}`;
      }

      return `contains(${attribute},'${String(predicate.containsValue).replace(/'/g, `''`)}')`;
    }

    if (predicate instanceof NotPredicate) {
      return `not(${this._convertPredicateToODataFilterClause(predicate.predicate, modelName, prefix, level)})`;
    }

    if (predicate instanceof IsOfPredicate) {
      let typeName = predicate.typeName;
      let expression = predicate.expression ? this._getODataAttributeName(modelName, predicate.expression, true) : '$it';
      let className = this._getClassName(typeName);

      return `isof(${expression},'${className}')`;
    }

    if (predicate instanceof GeographyPredicate) {
      let attribute = this._getODataAttributeName(modelName, predicate.attributePath);
      if (prefix) {
        attribute = `${prefix}/${attribute}`;
      }

      return `geo.intersects(geography1=${attribute},geography2=geography'${predicate.intersectsValue}')`;
    }

    if (predicate instanceof GeometryPredicate) {
      let attribute = this._getODataAttributeName(modelName, predicate.attributePath);
      if (prefix) {
        attribute = `${prefix}/${attribute}`;
      }

      return `geom.intersects(geometry1=${attribute},geometry2=geometry'${predicate.intersectsValue}')`;
    }

    if (predicate instanceof DetailPredicate) {
      let func = '';
      if (predicate.isAll) {
        func = 'all';
      } else if (predicate.isAny) {
        func = 'any';
      } else {
        throw new Error(`OData supports only 'any' or 'or' operations for details`);
      }

      let additionalPrefix = 'f';
      let detailPredicate = this._convertPredicateToODataFilterClause(predicate.predicate, this._getModelName(modelName, predicate.detailPath), prefix + additionalPrefix, level);
      let detailPath = this._getODataAttributeName(modelName, predicate.detailPath);

      return `${detailPath}/${func}(${additionalPrefix}:${detailPredicate})`;
    }

    if (predicate instanceof ComplexPredicate) {
      let separator = ` ${predicate.condition} `;
      let result = predicate.predicates
        .map(i => this._convertPredicateToODataFilterClause(i, modelName, prefix, level + 1)).join(separator);
      let lp = level > 0 ? '(' : '';
      let rp = level > 0 ? ')' : '';
      return lp + result + rp;
    }

    if (predicate instanceof TruePredicate) {
      return 'true';
    }

    if (predicate instanceof FalsePredicate) {
      return 'false';
    }

    throw new Error(`Unknown predicate '${predicate}'`);
  }

  /**
   * Получает представление оператора фильтрации OData
   * @param operator - Оператор фильтрации
   * @returns Представление оператора OData
   */
  private _getODataFilterOperator(operator: string): string {
    switch (operator) {
      case FilterOperator.Eq:
        return 'eq';

      case FilterOperator.Neq:
        return 'ne';

      case FilterOperator.Le:
        return 'lt';

      case FilterOperator.Leq:
        return 'le';

      case FilterOperator.Ge:
        return 'gt';

      case FilterOperator.Geq:
        return 'ge';

      default:
        throw new Error(`Unsupported filter operator '${operator}'.`);
    }
  }

  /**
   * Получает имя модели для связи
   * @param modelName - Имя модели
   * @param detailPath - Путь к детали
   * @returns Имя модели
   */
  private _getModelName(modelName: string, detailPath: string): string {
    // В реальной реализации здесь должна быть логика получения имени модели для связи
    // Для упрощения временно возвращаем исходное имя модели
    return modelName;
  }

  /**
   * Получает имя класса для OData
   * @param typeName - Тип
   * @returns Имя класса
   */
  private _getClassName(typeName: string): string {
    // В реальной реализации здесь должна быть логика получения имени класса
    // Для упрощения временно возвращаем тип как есть
    return typeName;
  }

  /**
   * Получает имя атрибута в формате OData
   * @param modelName - Имя модели
   * @param attributePath - Путь к атрибуту
   * @param noIdConversion - Флаг отключения конвертации ID
   * @returns Имя атрибута OData
   */
  private _getODataAttributeName(modelName: string, attributePath: string, noIdConversion?: boolean): string {
    // В реальной реализации здесь должна быть логика получения имени атрибута
    // Для упрощения временно возвращаем путь как есть
    return attributePath;
  }

  /**
   * Строит простой предикат OData
   * @param predicate - Предикат
   * @param modelName - Имя модели
   * @param prefix - Префикс
   * @returns Строка предиката OData
   */
  private _buildODataSimplePredicate(predicate: SimplePredicate, modelName: string, prefix: string): string {
    // predicate.attributePath - attribute or AttributeParam or ConstParam.
    // predicate.value - const or AttributeParam or ConstParam.

    let attributePath = predicate.attributePath;
    let predicateValue = predicate.value;
    let attributeObject = null;
    let valueObject = null;
    let isFirstParameterAttribute = !(attributePath instanceof ConstParam);
    let isSecondParameterAttribute = predicateValue instanceof AttributeParam;

    if (isFirstParameterAttribute) {
      attributeObject = this._processAttributeForODataSimplePredicate(predicate, modelName, prefix, attributePath);
    }

    if (isSecondParameterAttribute) {
      valueObject = this._processAttributeForODataSimplePredicate(predicate, modelName, prefix, predicateValue);
    }

    if (!isFirstParameterAttribute) {
      attributeObject = this._processConstForODataSimplePredicate(
        predicate,
        modelName,
        attributePath,
        isSecondParameterAttribute ? valueObject.attributePath : null);
    }

    if (!isSecondParameterAttribute) {
      valueObject = this._processConstForODataSimplePredicate(
        predicate,
        modelName,
        predicateValue,
        isFirstParameterAttribute ? attributeObject.attributePath : null);
    }

    let operator = this._getODataFilterOperator(predicate.operator);
    return `${attributeObject.value} ${operator} ${valueObject.value}`;
  }

  /**
   * Обрабатывает атрибут для простого предиката OData
   * @param predicate - Предикат
   * @param modelName - Имя модели
   * @param prefix - Префикс
   * @param attributePathParameter - Параметр пути атрибута
   * @returns Объект атрибута
   */
  private _processAttributeForODataSimplePredicate(predicate: any, modelName: string, prefix: string, attributePathParameter: any): any {
    let realAttributePath = attributePathParameter instanceof AttributeParam
                            ? attributePathParameter.attributePath
                            : attributePathParameter;
    let attribute = this._getODataAttributeName(modelName, realAttributePath);
    if (prefix) {
      attribute = `${prefix}/${attribute}`;
    }

    if (predicate.timeless) {
      attribute = `date(${attribute})`;
    }

    return {
      value: attribute,
      attributePath: realAttributePath
    };
  }

  /**
   * Обрабатывает константу для простого предиката OData
   * @param predicate - Предикат
   * @param modelName - Имя модели
   * @param predicateValue - Значение предиката
   * @param predicateAttribute - Атрибут предиката
   * @returns Объект значения
   */
  private _processConstForODataSimplePredicate(predicate: any, modelName: string, predicateValue: any, predicateAttribute: string | null): any {
    let value;
    let realPredicateValue = predicateValue instanceof ConstParam
                              ? predicateValue.constValue
                              : predicateValue;

    if (realPredicateValue === null) {
      value = 'null';
    } else if (predicateAttribute === null) {
      value = this._processConstForODataSimplePredicateByType(predicate, realPredicateValue, typeof realPredicateValue);
    } else {
      // В реальной реализации здесь должна быть логика получения метаданных модели
      // Для упрощения временно используем простую обработку
      value = this._processConstForODataSimplePredicateByType(predicate, realPredicateValue, 'string');
    }

    return { value: value };
  }

  /**
   * Обрабатывает константу для простого предиката OData по типу
   * @param predicate - Предикат
   * @param predicateValue - Значение предиката
   * @param valueType - Тип значения
   * @returns Обработанное значение
   */
  private _processConstForODataSimplePredicateByType(predicate: any, predicateValue: any, valueType: string): string {
    return valueType === 'string'
            ? `'${String(predicateValue).replace(/'/g, `''`)}'`
            : ((valueType === 'date' || (valueType === 'object' && predicateValue instanceof Date))
                ? this._formatDate(predicateValue)
                : predicateValue);
  }

  /**
   * Форматирует дату для OData
   * @param date - Дата
   * @returns Отформатированная дата
   */
  private _formatDate(date: Date): string {
    return date.toISOString();
  }
}
