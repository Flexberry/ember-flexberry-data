import { createEnum } from 'ember-flexberry-data/utils/enum-functions';

export default createEnum({
  INSERT: 'Создание',
  UPDATE: 'Изменение',
  DELETE: 'Удаление',
  SELECT: 'Чтение',
  EXECUTE: 'Выполнение',
});
