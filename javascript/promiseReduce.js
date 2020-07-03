/*
promiseReduce - работа с асинхронными функциями
Цель: Написать функцию promiseReduce(asyncFunctions, reduce, initialValue) asyncFunctions - массив асинхронных функций, возвращающих промис reduce(memo, value) - функция, которая будет вызвана для каждого успешно завершившегося промиса. initialValue - стартовое значение для функции reduce promiseReduce последовательно вызывает переданные асинхронные функции и выполняет reduce функцию сразу при получении результата до вызова следующей асинхронной функции. Функция promiseReduce должна возвращать промис с конечным результатом.
Пример использования

```javascript
var fn1 = () => {
    console.log('fn1')
    return Promise.resolve(1)
}

var fn2 = () => new Promise(resolve => {
    console.log('fn2')
    setTimeout(() => resolve(2), 1000)
})

function promiseReduce(asyncFunctions, reduce, initialValue) {
    ...реализация
}

promiseReduce(
    [fn1, fn2],
    function (memo, value) {
        console.log('reduce')
        return memo * value
    },
    1
)
.then(console.log)
```
Вывод в консоль
```
fn1
reduce
fn2
reduce
2
```
*/

async function promiseReduce(asyncFunctions = [], reduce, initialValue = 0) {
  return asyncFunctions.reduce(
    (promise, fun) => promise.then(
      async sum => {
        try {
          return reduce(sum, await fun());
        } catch (e) {
          console.warn(`${fun.name} failed with ${e}`);
          return sum;
        }
      }
    ),
    Promise.resolve(initialValue)
  );
}

//tst

const fn1 = () => {
  console.log('fn1');
  return Promise.resolve(1);
};

const fn2 = () => new Promise(resolve => {
  console.log('fn2');
  setTimeout(() => resolve(2), 3000);
});

const fn3 = () => new Promise(() => {
  console.log('fn3');
  throw new Error('tst err');
});

const fn4 = () => new Promise(resolve => {
  console.log('fn4');
  setTimeout(() => resolve(5), 1000);
});

promiseReduce(
  [fn1, fn2, fn3, fn4],
  function(memo, value) {
    console.log('reduce');
    return memo * value;
  },
  4,
).then(console.log);