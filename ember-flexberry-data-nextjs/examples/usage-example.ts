/**
 * Пример использования OData адаптера в NextJS приложении
 */

import { ODataAdapter } from '../src/adapters/odata';
import { SimplePredicate, ComplexPredicate, StringPredicate, DatePredicate, DetailPredicate } from '../src/query/predicate';
import { FilterOperator } from '../src/query/filter-operator';

// Создание экземпляра OData адаптера
const odataAdapter = new ODataAdapter('http://localhost:8080/odata');

// Пример 1: Простой поиск по имени
async function findUsersByName(name: string) {
  const predicate = new SimplePredicate('name', FilterOperator.Eq, name);

  const query = {
    predicate: predicate,
    modelName: 'User',
    select: ['id', 'name', 'email'],
    top: 10
  };

  const fullUrl = odataAdapter.getODataFullUrl(query);
  console.log('Запрос:', fullUrl);

  try {
    const result = await odataAdapter.findRecord(fullUrl);
    return result;
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
    throw error;
  }
}

// Пример 2: Сложный фильтр с логическими операторами
async function findAdultUsers(minAge: number, maxAge: number) {
  const predicate1 = new SimplePredicate('age', FilterOperator.Geq, minAge);
  const predicate2 = new SimplePredicate('age', FilterOperator.Leq, maxAge);
  const complexPredicate = new ComplexPredicate('and', predicate1, predicate2);

  const query = {
    predicate: complexPredicate,
    modelName: 'User',
    select: ['id', 'name', 'age'],
    orderBy: 'age asc',
    top: 20
  };

  const fullUrl = odataAdapter.getODataFullUrl(query);
  console.log('Запрос:', fullUrl);

  const result = await odataAdapter.findRecord(fullUrl);
  return result;
}

// Пример 3: Поиск подстроки в тексте
async function findUsersByPartialName(partialName: string) {
  const predicate = new StringPredicate('name').contains(partialName);

  const query = {
    predicate: predicate,
    modelName: 'User',
    select: ['id', 'name']
  };

  const fullUrl = odataAdapter.getODataFullUrl(query);
  console.log('Запрос:', fullUrl);

  const result = await odataAdapter.findRecord(fullUrl);
  return result;
}

// Пример 4: Поиск по дате
async function findUsersByCreatedDate(startDate: Date, endDate: Date) {
  const predicate1 = new DatePredicate('createdDate', FilterOperator.Ge, startDate);
  const predicate2 = new DatePredicate('createdDate', FilterOperator.Le, endDate);
  const complexPredicate = new ComplexPredicate('and', predicate1, predicate2);

  const query = {
    predicate: complexPredicate,
    modelName: 'User',
    select: ['id', 'name', 'createdDate'],
    orderBy: 'createdDate desc'
  };

  const fullUrl = odataAdapter.getODataFullUrl(query);
  console.log('Запрос:', fullUrl);

  const result = await odataAdapter.findRecord(fullUrl);
  return result;
}

// Пример 5: Работа с деталями (связанными сущностями)
async function findUserWithDetails(userId: string) {
  // Создаем предикат для поиска пользователя по ID
  const predicate = new SimplePredicate('id', FilterOperator.Eq, userId);

  const query = {
    predicate: predicate,
    modelName: 'User',
    select: ['id', 'name', 'email'],
    expand: {
      'orders': {
        select: ['id', 'amount', 'date'],
        expand: {
          'orderItems': {
            select: ['id', 'productName', 'quantity']
          }
        }
      }
    }
  };

  const fullUrl = odataAdapter.getODataFullUrl(query);
  console.log('Запрос:', fullUrl);

  const result = await odataAdapter.findRecord(fullUrl);
  return result;
}

// Пример 6: Создание новой записи
async function createUser(userData: any) {
  const fullUrl = 'http://localhost:8080/odata/Users';

  try {
    const result = await odataAdapter.createRecord(fullUrl, userData);
    return result;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
}

// Пример 7: Обновление записи
async function updateUser(userId: string, userData: any) {
  const fullUrl = `http://localhost:8080/odata/Users(${userId})`;

  try {
    const result = await odataAdapter.updateRecord(fullUrl, userData);
    return result;
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    throw error;
  }
}

// Пример 8: Удаление записи
async function deleteUser(userId: string) {
  const fullUrl = `http://localhost:8080/odata/Users(${userId})`;

  try {
    const result = await odataAdapter.deleteRecord(fullUrl);
    return result;
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    throw error;
  }
}

// Использование примеров
async function main() {
  try {
    // Поиск пользователей по имени
    const users = await findUsersByName('John');
    console.log('Пользователи:', users);

    // Поиск взрослых пользователей
    const adultUsers = await findAdultUsers(18, 65);
    console.log('Взрослые пользователи:', adultUsers);

    // Поиск по подстроке
    const partialUsers = await findUsersByPartialName('Jo');
    console.log('Пользователи с подстрокой "Jo":', partialUsers);

    // Поиск по дате
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const recentUsers = await findUsersByCreatedDate(yesterday, today);
    console.log('Пользователи за последние сутки:', recentUsers);

    // Создание нового пользователя
    const newUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 25
    };

    const createdUser = await createUser(newUser);
    console.log('Созданный пользователь:', createdUser);

  } catch (error) {
    console.error('Ошибка в главной функции:', error);
  }
}

// Запуск примера
// main();
