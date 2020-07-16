/*
Написать функцию суммирования значений
Написать функцию sum, которая может быть исполнена любое количество раз с не `undefined` аргументом.
Если она исполнена без аргументов, то возвращает значение суммы всех переданных до этого значений.

sum(1)(2)(3)....(n)() === 1 + 2 + 3 + ... + n
*/

//v1
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
console.log( "rez summ: " + summ(1)(2)(3) );
console.log( "rez summ: " + summ(5)(-1)(8) );
console.log( "rez summ: " + summ() );
console.log( "rez summ: " + summ(1)(2)() );

//v2
function summ2(a) {
    let curSumm = typeof a === "undefined" ? 0 : a;
    function f(b) {
        curSumm += typeof b === "undefined" ? 0 : b;
        return f;
    }
    f.toString = function() {
        return curSumm;
    };
    return f;
}
//test
console.log( "rez summ2: " + summ2(1)(2)(3) );
console.log( "rez summ2: " + summ2(5)(-1)(8) );
console.log( "rez summ2: " + summ2() );
console.log( "rez summ2: " + summ2(1)(2)() );
