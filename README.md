# greenwood2018
Структура:
```
app/
  |--css/
    |--additional-style.css (Стилевой файл от сторонних разработчиков)
  |--scss/
     |--global/
     |--blocks/
     |--vendors/ (Стили сторонних библиотек)
     |--variables.scss
     |--functions.scss
     |--mixins.scss
     |--styles.scss
  |--images/
     |--svg-icons/
     |--svg-symbols/ (для объединения в один файл images/symbols.svg)
  |--js/
     |--plugins/
     |--modules/
     |--jQuery (Подключать отдельно)
     |--script.js
  |--fonts/
  |--blocks (инклюды)

build/
  |--style.css
  |--fonts/
  |--images/
     |--symbols.svg
  |--js
other/
   |--psd
```

## Установка
1. Перейти в родительскую папку проектов
2. Запустить консоль Git Bash
3. Ввести команду `git clone https://github.com/corvus-007/gw2018`
4. Перейти в каталог проекта `cd gw2018`
5. Установить модули из package.json — `npm install`

## Запуск проекта
`npm start`
## Сборка проекта
`npm run build`
## Удаление папки build
`gulp clean`


Из папки js/plugins/ объединяются js-файлы и помещаются в js/plugins.js
Из папки js/modules/ объединяются js-файлы и помещаются в js/modules.js
Из папки images/svg-symbols/ объединяются svg-файлы и помещаются в images/symbols.svg
