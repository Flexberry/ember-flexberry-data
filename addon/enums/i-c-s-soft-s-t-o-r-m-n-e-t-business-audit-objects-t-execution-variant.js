import { createEnum } from 'ember-flexberry-data/utils/enum-functions';

export default createEnum({
  Unknown: 'Неизвестно',
  Unexecuted: 'Не выполнено',
  Executed: 'Выполнено',
  Failed: 'Ошибка',
});
