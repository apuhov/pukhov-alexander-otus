/*
Написать функцию суммирования значений
Написать функцию sum, которая может быть исполнена любое количество раз с не `undefined` аргументом.
Если она исполнена без аргументов, то возвращает значение суммы всех переданных до этого значений.

sum(1)(2)(3)....(n)() === 1 + 2 + 3 + ... + n
*/

function summ(a) {
    let curSumm = a;
    function f(b) {
        curSumm += b;
        return f;
    }
    f.toString = function() {
        return curSumm;
    };
    return f;
}

//test
console.log( summ(1)(2)(3) );
console.log( summ(5)(-1)(8) );