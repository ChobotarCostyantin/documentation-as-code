# API Contract — API-first підхід

**Версія:** 1.0  
**Тип:** Internal API  
**Споживач:** SPA / Frontend  
**Протокол:** HTTPS / REST  
**Автентифікація:** Cookie-based session  
**Базовий URL:** `/api/v1`

---

## Призначення API
API надає строгий контракт для взаємодії між центральним вузлом бізнес-логіки (backend на NestJS) та презентаційним шаром (frontend-застосунок на Next.js).

API використовується виключно веб-клієнтом і наразі не призначене для інтеграції сторонніми сервісами (third-party) або мобільними застосунками. Його головне завдання — забезпечити:
- Керування профілями та безпечну JWT-авторизацію.
- Операції пошуку, фільтрації та перегляду каталогу програмного забезпечення.
- Взаємодію з контентом (створення відгуків, додавання ПЗ до власного стеку).

---

## Роль API у системі

API є внутрішнім контрактом між бекендом та SPA-клієнтом. Він надає доступ до керування категоріями, критеріями (факторами та метриками), програмним забезпеченням, порівняннями та рецензіями. Автентифікація реалізована через cookie-сесію. Ролі користувачів: `user`, `author`, `admin`.

> 🔒 — ендпоінт потребує автентифікації

---

## Специфікація та інтерактивна документація

|                           | Посилання                                                                                                                                      |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| OpenAPI специфікація      | [`openapi.yaml`](./openapi.yaml)                                                                                                               |
| Swagger UI (інтерактивна) | [Swagger UI](https://editor.swagger.io/?url=https://raw.githubusercontent.com/ChobotarCostyantin/documentation-as-code/main/docs/openapi.yaml) |

---

## 1. Health

| Метод | Ендпоінт         | Опис                                               | Коди відповіді |
|-------|------------------|----------------------------------------------------|----------------|
| `GET` | `/api/v1/health` | Перевірка стану сервісу та залежностей (БД, Redis) | 200, 503       |

**Структура відповіді 200:**
```json
{
  "status": "ok",
  "info": { "database": { "status": "up" } },
  "error": {},
  "details": { "database": { "status": "up" } }
}
```

**Структура відповіді 503:**
```json
{
  "status": "error",
  "error": { "redis": { "status": "down", "message": "Could not connect" } }
}
```

---

## 2. Categories

| Метод       | Ендпоінт                           | Опис                                                | Коди відповіді |
|-------------|------------------------------------|-----------------------------------------------------|----------------|
| `GET`       | `/api/v1/categories`               | Отримати всі категорії (пагінація)                  | 200            |
| `POST` 🔒   | `/api/v1/categories`               | Створити нову категорію                             | 201, 401       |
| `GET`       | `/api/v1/categories/{id}`          | Категорія за ID разом з факторами та метриками      | 200, 404       |
| `GET`       | `/api/v1/categories/slug/{slug}`   | Категорія за slug разом з факторами та метриками    | 200, 404       |
| `PUT` 🔒    | `/api/v1/categories/{id}`          | Оновити назву або slug категорії                    | 200, 401, 404  |
| `DELETE` 🔒 | `/api/v1/categories/{id}`          | Видалити категорію                                  | 200, 401, 404  |
| `PUT` 🔒    | `/api/v1/categories/{id}/criteria` | Замінити повний список факторів та метрик категорії | 200, 401       |

**Тіло запиту POST `/api/v1/categories`:**
```json
{
  "name": "IDEs",
  "slug": "ides"
}
```

**Тіло запиту PUT `/api/v1/categories/{id}/criteria`:**
```json
{
  "factorIds": [1, 2, 3],
  "metricIds": [4, 5]
}
```

---

## 3. Criteria — Factors & Metrics

### Factors

| Метод       | Ендпоінт                                 | Опис                                       | Коди відповіді |
|-------------|------------------------------------------|--------------------------------------------|----------------|
| `GET`       | `/api/v1/criteria/factors`               | Всі фактори (пагінація: `page`, `perPage`) | 200            |
| `POST` 🔒   | `/api/v1/criteria/factors`               | Створити новий фактор                      | 201, 401       |
| `GET`       | `/api/v1/criteria/factors/by-categories` | Фактори за кількома категоріями            | 200            |
| `PUT` 🔒    | `/api/v1/criteria/factors/{id}`          | Оновити фактор                             | 200, 401, 404  |
| `DELETE` 🔒 | `/api/v1/criteria/factors/{id}`          | Видалити фактор                            | 200, 401, 404  |

**Query-параметри GET `/api/v1/criteria/factors/by-categories`:**
```
?categoryIds=1,2,3
```

**Тіло запиту POST `/api/v1/criteria/factors`:**
```json
{
  "name": "Open Source",
  "slug": "open-source"
}
```

### Metrics

| Метод       | Ендпоінт                                 | Опис                                       | Коди відповіді |
|-------------|------------------------------------------|--------------------------------------------|----------------|
| `GET`       | `/api/v1/criteria/metrics`               | Всі метрики (пагінація: `page`, `perPage`) | 200            |
| `POST` 🔒   | `/api/v1/criteria/metrics`               | Створити нову метрику                      | 201, 401       |
| `GET`       | `/api/v1/criteria/metrics/by-categories` | Метрики за кількома категоріями            | 200            |
| `PUT` 🔒    | `/api/v1/criteria/metrics/{id}`          | Оновити метрику                            | 200, 401, 404  |
| `DELETE` 🔒 | `/api/v1/criteria/metrics/{id}`          | Видалити метрику                           | 200, 401, 404  |

**Тіло запиту POST `/api/v1/criteria/metrics`:**
```json
{
  "name": "Startup Time (ms)",
  "slug": "startup-time-ms",
  "higherIsBetter": false
}
```

---

## 4. Software

| Метод       | Ендпоінт                          | Опис                                            | Коди відповіді |
|-------------|-----------------------------------|-------------------------------------------------|----------------|
| `GET`       | `/api/v1/software`                | Список ПЗ (фільтр, пагінація, сортування)       | 200            |
| `POST` 🔒   | `/api/v1/software`                | Додати нове ПЗ                                  | 201, 401       |
| `GET`       | `/api/v1/software/{slug}`         | Деталі ПЗ за slug (категорії, фактори, метрики) | 200, 404       |
| `PUT` 🔒    | `/api/v1/software/{slug}`         | Оновити дані ПЗ                                 | 200, 401, 404  |
| `DELETE` 🔒 | `/api/v1/software/{slug}`         | Видалити ПЗ                                     | 200, 401, 404  |
| `PUT` 🔒    | `/api/v1/software/{slug}/factors` | Встановити фактори ПЗ (pros/cons)               | 200, 401       |
| `PUT` 🔒    | `/api/v1/software/{slug}/metrics` | Встановити значення метрик ПЗ                   | 200, 401       |
| `GET`       | `/api/v1/software/{slug}/is-used` | Чи використовується ПЗ у порівняннях            | 200            |

**Тіло запиту POST `/api/v1/software`:**
```json
{
  "slug": "jetbrains-rider",
  "name": "JetBrains Rider",
  "developer": "JetBrains",
  "shortDescription": "Fast & powerful cross-platform .NET IDE",
  "websiteUrl": "https://jetbrains.com/rider",
  "gitRepoUrl": "https://github.com/JetBrains/rider",
  "logoUrl": "https://example.com/logo.png",
  "screenshots": [
    { "url": "https://example.com/img1.png", "alt": "Main dashboard view" }
  ],
  "categoryIds": [1, 2, 3]
}
```

**Тіло запиту PUT `/api/v1/software/{slug}/factors`:**
```json
{
  "factors": [
    { "factorId": 1, "isPositive": true },
    { "factorId": 2, "isPositive": false }
  ]
}
```

**Тіло запиту PUT `/api/v1/software/{slug}/metrics`:**
```json
{
  "metrics": [
    { "metricId": 4, "value": 1200 },
    { "metricId": 5, "value": 98.5 }
  ]
}
```

---

## 5. Comparisons

| Метод | Ендпоінт                                 | Опис                                         | Коди відповіді |
|-------|------------------------------------------|----------------------------------------------|----------------|
| `GET` | `/api/v1/comparisons`                    | Список порівнянь (пагінація)                 | 200            |
| `GET` | `/api/v1/comparisons/{slugA}/vs/{slugB}` | Порівняння двох ПЗ за метриками та факторами | 200, 404       |

**Структура відповіді GET `/api/v1/comparisons/{slugA}/vs/{slugB}`:**
```json
{
  "data": {
    "softwareA": { "id": 1, "slug": "rider", "name": "JetBrains Rider" },
    "softwareB": { "id": 2, "slug": "vscode", "name": "VS Code" },
    "metricsComparison": [
      { "metricId": 4, "metricName": "Startup Time (ms)", "higherIsBetter": false,
        "valueA": 1200, "valueB": 800, "winner": "softwareB" }
    ],
    "factorsComparison": [
      { "factorId": 1, "factorName": "Open Source",
        "softwareAIsPositive": false, "softwareBIsPositive": true }
    ]
  }
}
```

---

## 6. Reviews

### Software Reviews

| Метод       | Ендпоінт                        | Опис                  | Коди відповіді |
|-------------|---------------------------------|-----------------------|----------------|
| `POST` 🔒   | `/api/v1/software-reviews`      | Додати рецензію на ПЗ | 201, 401       |
| `PUT` 🔒    | `/api/v1/software-reviews/{id}` | Оновити рецензію      | 200, 401, 403  |
| `DELETE` 🔒 | `/api/v1/software-reviews/{id}` | Видалити рецензію     | 200, 401, 403  |

**Тіло запиту POST `/api/v1/software-reviews`:**
```json
{
  "softwareSlug": "jetbrains-rider",
  "content": "Excellent IDE with great refactoring tools."
}
```

### Comparison Reviews

| Метод       | Ендпоінт                          | Опис                                         | Коди відповіді |
|-------------|-----------------------------------|----------------------------------------------|----------------|
| `POST` 🔒   | `/api/v1/comparison-reviews`      | Додати рецензію на порівняння двох продуктів | 201, 401       |
| `PUT` 🔒    | `/api/v1/comparison-reviews/{id}` | Оновити рецензію на порівняння               | 200, 401, 403  |
| `DELETE` 🔒 | `/api/v1/comparison-reviews/{id}` | Видалити рецензію на порівняння              | 200, 401, 403  |

**Тіло запиту POST `/api/v1/comparison-reviews`:**
```json
{
  "softwareSlugA": "jetbrains-rider",
  "softwareSlugB": "vscode",
  "content": "Rider wins on refactoring, VS Code on extensibility."
}
```

---

## 7. Authentication

| Метод     | Ендпоінт                | Опис                              | Коди відповіді |
|-----------|-------------------------|-----------------------------------|----------------|
| `POST`    | `/api/v1/auth/register` | Реєстрація нового користувача     | 201, 400       |
| `POST`    | `/api/v1/auth/login`    | Вхід, встановлення cookie-сесії   | 200, 401       |
| `POST` 🔒 | `/api/v1/auth/logout`   | Вихід, знищення сесії             | 200, 401       |
| `GET` 🔒  | `/api/v1/auth/me`       | Поточний авторизований користувач | 200, 401       |

**Тіло запиту POST `/api/v1/auth/register`:**
```json
{
  "email": "user@test.com",
  "password": "password123"
}
```

**Структура відповіді (user object):**
```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@test.com",
      "role": "user",
      "fullName": null,
      "bio": null,
      "avatarUrl": null,
      "websiteUrl": null
    }
  }
}
```

---

## 8. Users

| Метод      | Ендпоінт                     | Опис                                      | Коди відповіді |
|------------|------------------------------|-------------------------------------------|----------------|
| `GET` 🔒   | `/api/v1/users`              | Список користувачів (тільки `admin`)      | 200, 403       |
| `GET` 🔒   | `/api/v1/users/{id}`         | Профіль користувача за ID                 | 200, 404       |
| `PATCH` 🔒 | `/api/v1/users/{id}/profile` | Оновити профіль користувача               | 200, 401, 403  |
| `PATCH` 🔒 | `/api/v1/users/{id}/role`    | Змінити роль користувача (тільки `admin`) | 200, 401, 403  |

**Тіло запиту PATCH `/api/v1/users/{id}/profile`:**
```json
{
  "fullName": "John Doe",
  "bio": "Software engineer",
  "avatarUrl": "https://example.com/avatar.png",
  "websiteUrl": "https://johndoe.dev"
}
```

**Тіло запиту PATCH `/api/v1/users/{id}/role`:**
```json
{
  "role": "author"
}
```

> Допустимі ролі: `user`, `author`, `admin`

---

## Коди помилок

| Код   | Назва               | Опис                             |
|-------|---------------------|----------------------------------|
| `200` | OK                  | Успішна відповідь                |
| `201` | Created             | Ресурс успішно створено          |
| `400` | Bad Request         | Некоректні дані запиту           |
| `401` | Unauthorized        | Потрібна автентифікація          |
| `403` | Forbidden           | Недостатньо прав доступу         |
| `404` | Not Found           | Ресурс не знайдено               |
| `503` | Service Unavailable | Сервіс або залежність недоступні |
