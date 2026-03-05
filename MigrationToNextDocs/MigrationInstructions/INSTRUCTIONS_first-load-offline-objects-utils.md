# Модуль: first-load-offline-objects-utils

## Файлы
- addon/utils/first-load-offline-objects.js

## Зависимости (должны быть перенесены ДО этого модуля)
- batch-queries-utils
- reload-local-records-utils

## Рекомендации по переносу

### Utils → Async Function

**Ember:** `addon/utils/first-load-offline-objects.js` → **Next.js:** `src/utils/firstLoadOfflineObjects.ts`

**Пример шаблона:**
```ts
// utils/firstLoadOfflineObjects.ts
import * as $ from 'jquery'; // или fetch

export async function firstLoadOfflineObjects(
  dexieDB: any,
  odataPath: string,
  functionName: string,
  modelName: string,
  count = false,
  top = 0,
  skip = 0,
  idPath = 'guid'
): Promise<any> {
  const url = `${odataPath}/${functionName}(objToLoad='${modelName}',top=${top},skip=${skip},count=${count})`;

  try {
    const response = await fetch(url);
    const msg = await response.json();
    
    let objs = JSON.parse(msg.value);
    
    if (!isNaN(+objs)) {
      return +objs;
    }

    let objArray: any[] = [];
    if (Array.isArray(objs[modelName])) {
      objArray.push(...objs[modelName]);
    } else {
      objArray.push(objs);
    }

    objArray.forEach(record => {
      if (idPath && record.id) {
        record.id = record.id[idPath];
      }

      for (let key in record) {
        if (record[key] && record[key].id) {
          record[key] = idPath ? record[key].id[idPath] : record[key].id;
        }

        if (Array.isArray(record[key])) {
          record[key] = record[key].map((item: any) => 
            item.id ? (idPath ? item.id[idPath] : item.id) : item
          );
        }
      }
    });

    await dexieDB.table(modelName).bulkPut(objArray);
    return undefined; // resolve without value
  } catch (error) {
    return Promise.reject(modelName);
  }
}
```

## Порядок действий при переносе

1. Создать `firstLoadOfflineObjects()` функцию
2. Заменить jQuery `$.ajax` на native `fetch`
3. Обработать DEXIE DB bulkPut
4. Обработать рекурсивную обработку ID paths

## Оценка трудозатрат

≈ 4–6 часов (medium)

## Чек-лист для разработчика

- [ ] `firstLoadOfflineObjects()` реализована
- [ ] `fetch`代替 `$.ajax`
- [ ] DEXIE DB integration
- [ ] ID path processing сохранён
- [ ] Error handling сохранён
- [ ] Тесты переписаны

## Примечания

- jQuery → fetch API
- DEXIE.js → уже в `dexie-service`
