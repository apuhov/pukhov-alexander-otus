/*
getPath - поиск уникального селектора
Написать алгоритм и функцию `getPath()`, находяющую уникальный css-селектор для элемента в документе.
Уникальный селектор может быть использован `document.querySelector()` и возвращать исходный элемент.

Так чтобы `document.querySelectorAll()`, вызванный с этим селектором, не должен находить никаких элементов, кроме исходного.

```javascript
$0 // HTMLElement
getPath($0) // => "body div.someclass ul li:first-child"
*/

const getChildIndex = (el) => {
    let tag = el.tagName;
    let siblings = Array.from(el.parentNode.children);
    let siblingsSame = siblings.filter(sibling => sibling.tagName === tag);
    return (siblingsSame.length > 1) ? `:nth-child(${1+siblings.indexOf(el)})` : '';
}

const getPath = (el) => {
    let path = [];
    let parent;
    while (parent = el.parentNode) {
        let className = el.className ? '.' + el.className.trim().replace(/\s+/g, ".") : '';
        let part = el.id ? `#${el.id}` : `${el.tagName}${className}${getChildIndex(el)}`;
        path.unshift(part);
        el = parent;
    }
    return path.join(' > ');
}