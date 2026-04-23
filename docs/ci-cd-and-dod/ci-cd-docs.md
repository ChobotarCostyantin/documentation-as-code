# Documentation CI/CD Pipeline

## Артефакти документації

| Артефакт                    | Інструмент                    | Вихідні файли       |
|-----------------------------|-------------------------------|---------------------|
| Загальний сайт документації | MkDocs Material               | `docs/` → `site/`   |
| API-документація            | Swagger UI (з `openapi.yaml`) | `docs/openapi.yaml` |
| UI-документація             | Storybook                     | `storybook-static/` |

---

## Тригери генерації

| Тригер                           | Дія                                             |
|----------------------------------|-------------------------------------------------|
| `push` у будь-яку `feat/*` гілку | Валідація (lint + schema check), без публікації |
| `merge` у `main`                 | Повна збірка + публікація на GitHub Pages       |

---

## Структура pipeline

```yaml
# .github/workflows/docs.yml

name: Documentation CI/CD

on:
  push:
    branches:
      - main
      - 'feat/**'

jobs:
  validate:
    name: Validate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate OpenAPI specification
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npx @redocly/cli lint docs/openapi.yaml

      - name: Lint Markdown docs
        run: npx markdownlint-cli "docs/**/*.md"

  build-and-publish:
    name: Build & Publish
    runs-on: ubuntu-latest
    needs: validate
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install MkDocs
        run: pip install mkdocs-material

      - name: Build documentation site
        run: mkdocs build --strict

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook -- --output-dir site/storybook

      - name: Copy Swagger UI
        run: |
          mkdir -p site/api
          cp docs/openapi.yaml site/api/openapi.yaml
          npx swagger-ui-dist-replace site/api

      - name: Publish to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

---

## Послідовність кроків

```
push → main
    │
    ▼
1. Validate OpenAPI spec       (redocly lint)
2. Lint Markdown               (markdownlint)
    │
    ▼
3. Build MkDocs site           → site/
4. Build Storybook             → site/storybook/
5. Copy Swagger UI + openapi   → site/api/
    │
    ▼
6. Publish to GitHub Pages     → betterstack.github.io/docs/
```

---

## Місце публікації

**GitHub Pages**, гілка `gh-pages`.

| Розділ               | URL                                                           |
|----------------------|---------------------------------------------------------------|
| Головна документація | `https://ChobotarCostyantin.github.io/betterstack/`           |
| API (Swagger UI)     | `https://ChobotarCostyantin.github.io/betterstack/api/`       |
| UI (Storybook)       | `https://ChobotarCostyantin.github.io/betterstack/storybook/` |

---

## Версійність документації

Версія документації відповідає версії продукту і керується через Git Tags.

| Подія                    | Дія                                                   |
|--------------------------|-------------------------------------------------------|
| Новий реліз (`v1.1.0`)   | Створити Git Tag → pipeline публікує нову версію      |
| Breaking change в API    | Збільшити major версію документації (`v1.x` → `v2.0`) |
| Виправлення / доповнення | Збільшити minor версію (`v1.0` → `v1.1`)              |

Правила:
- Версія документації вказується у `mkdocs.yml` → `site_description` та у блоці `info` файлу `openapi.yaml`.
- Breaking changes в API вимагають одночасного оновлення `openapi.yaml` і нового major тегу.
- Стара версія документації зберігається під тегом і доступна через GitHub Releases.
