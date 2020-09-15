# Custom Elements Tree
### Задание
С помощью Custom Elements создать приложение для показа дерева с помощью компонентов **my-tree** и **my-leaf**. Компоненты должны получать данные о структуре поддерева от родительского элемента. Используйте Shadow DOM при отрисовке компонент. Можно также использовать для реализации Lit-Element, Lit-HTML или Polymer.

Пример структуры данных:
`{
"id": 1,
"items": [{
"id": 2,
"items": [{ "id": 3 }]
}]
}`

### Реализация
Выбран инструмент **Lit-Element**. Дерево строится в виде _unordered list_ (теги `ol`, `li`).
В качестве основы для проекта используется [Webpack Frontend Starterkit](https://github.com/wbkd/webpack-starter)
