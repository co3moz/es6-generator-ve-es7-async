###### Translate EN, [@co3moz](https://github.com/co3moz)'s [es6-generator-ve-es7-async](https://github.com/co3moz/es6-generator-ve-es7-async) repo. 

# ES6 generator and ES7 async functions (EN)
We will look and feel the generator functions in ES6 and the async functions in ES7 in this repository.

# ES6 - Generators 

## What is these generators?

Generators are some functions as named. Unlike a normal function, generator function is continue from where it stopped in runtime. That's why, when the function run a process, returned step by step instead of returned at once.

When defining the generator function, we'll use an additional `*` (asterisk) character in the normal function.

```ts
function* generator() {

}
```

If we call this generator function, the code will not work which defined in the generator function's body.

```ts
function* generator() {
  console.log("merhaba");
}

generator();
```

Instead of this, the generator function returns another some special object. If you call this returning objects `.next()` method, you can see "merhaba" in your console.

```ts
function* generator() {
  console.log("merhaba");
}

var g = generator();
g.next(); // writed "merhaba" and returned {value: undefined, done: true}
```

As you see, method returned another object. In this case, `value` assigned undefined and `done` assigned true.  `done` statement indicates that all the functions of the generators are finished. `value` statement  assigned the returned value.

Until now, we can't see anything other than normal function but just started to shit happening.

## Yield

We've seen generators return the `done` value so anyway we can stop the generators using something. `yield` is the property that doing this.

`yield` is exit the function just like return, but yield makes it possible re-enter the function instead of return statement.  Not only that; it also allows set a value from exit position in function.

```ts
function* generator() {
  console.log("merhaba");
  yield;
}

var g = generator();
g.next(); // "merhaba" yazıldı ve {value: undefined, done: false} döndürüldü
```

As you see, this time  `done` assigned false. If we call the `.next ()` method one more time;

```js
function* generator() {
  console.log("merhaba");
  yield;
}

var g = generator();
g.next(); // writed  "merhaba" and returned {value: undefined, done: false}
g.next(); // returned {value: undefined, done: true} 
```

`done` value will be `true`. When called `.next()` method, codes are executed step by step until the `yield` expression is reached. When the `yield` expression comes,  if there is a operation on the right side like return statement it runned. The value returned is written to the `value` property of the` .next () `method returned by the method.

If we want return a value, we've to write right side of `yield` statement.

```ts
function* generator() {
  console.log("merhaba");
  yield 8;
  yield 9;
  return 10;
}

var g = generator();
g.next(); // {value: 8, done: false}
g.next(); // {value: 9, done: false}
g.next(); // {value: 10, done: true}
```

From this idea, we can generate `fibonacci numbers`.

```ts
function* fibonacci() {
  let a = 1, b = 1;
  for(;;) {
    yield a + b;
    let t = b;
    b = a + b;
    a = t;
  }
}

var g = fibonacci();
g.next(); // {value: 2, done: false}
g.next(); // {value: 3, done: false}
g.next(); // {value: 5, done: false}
g.next(); // {value: 8, done: false}
```

There is no end to this generator. Mean,  `done` never assigned true.

## generators under for-of

It is possible to use our generators in `for-of` syntax. But as in the previous example, avoid being infinite. In each iteration `.next ()` will be called and returned value will be assigned in a variable. After finished processes in for body,`.next ()` will be called again. When `done` statement equal `true`, loop is breaking.

```ts
function* fibonacci(limit) {
  let a = 1, b = 1;
  while(limit--) {
    console.log("next :" + (a + b));
    yield a + b;
    let t = b;
    b = a + b;
    a = t;
  }
  console.log("hell jah!");
}

for(sayi of fibonacci(10)) {
  console.log(sayi);
}
```

This is console log for our code;

```ts
next :2
2
next :3
3
next :5
5
next :8
8
next :13
13
next :21
21
next :34
34
next :55
55
next :89
89
next :144
144
hell jah!
```

Let's give one more example. We use the for-of syntax reading the values of an array.

```ts
let array = [1, 2, 3];
for (let i of array) {
  console.log(i); // 1 .. 2 .. 3
}
```

But, we can't navigate between the keys and values of the objects unfortunately.

```ts
let object = {a: 1, b: 2};
for (let i of object) { // Uncaught TypeError: undefined is not a function
  console.log(i); 
}
```

We can solve this case with generator functions,

```ts
function* entries(obj) {
   for (let key of Object.keys(obj)) {
     yield [key, obj[key]];
   }
}

let obje = {a: 1, b: 2};
for (let [key, value] of entries(obje)) {
  console.log(key, value);  // a, 1 .. b, 2
}
```

## next, throw and return
`.next()` method have a single parameter. It is possible send a number to `yield` with this number we will give.

```ts
function* count() {
  var start = yield;
  console.log(start);
}

var s = count();
s.next(); // 'next' from yield area.
s.next(3); // 3
```

`.throw ()` method throws `throw` where the code is in like next method.

```ts
function* count() {
  try {
    yield Math.random();
  } catch(e) {
    console.error(e); // Not greater than 0.5
  }
}

var s = count();
if(s.next().value > 0.5) {
  s.throw(new Error("Not greater than 0.5"));
}
```

`.return ()` method terminates the generator function and return first parameter as value.

```ts
function* count() {
  console.log(1);
  yield 1;
  console.log(2);
  yield 2;
  console.log(3);
  yield 3;
}

var s = count();
s.next(); // {value: 1, done: false}
s.return(4); // {value: 4, done: true}
s.next(); // {value: undefined, done: true}
```

## Yield and asynchronous things

I think that the most beautiful thing of `yield` apart from all these things is providing the support for asynchronous work. Let's thinking theoretical right now.  `yield` stop (pause actually) a genetor. It doesn't just stop also gives us data. If we have a `promise` in `yield` and when finised this `promise` we suplly another next call, have we get rid of callbacks?

```ts
function* asyn() {
  yield new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, 1000);
  });
  console.log("merhaba");
}

var s = asyn();
var promise = s.next().value; // {value: Promise, done: false}
promise.then(function() {
  s.next();
});
```

With this code, after wait 1 second, writted 'merhaba'. So let's design such a function that you do it for us.

```ts
function run(g) {
  var i = g.next(); // get next value
  if (!i.done) { //  if not done
    if (i.value && i.value.constructor == Promise) { // if returned value is promise
      i.value.then(function (data) { // wait finish promise
        run(g); //re-call yourself
      }).catch(function (e) { // if we have any error
        g.throw(e); // throw
      });
    } else { // it is not promis, just next.
      run(g);
    }
  }
}
```

Of course this code is extremely simple that's why it have some memory problems. All you have to use this, `run (generator ())` call.  Let's transform delay process -that we have already defined- with  function.

```ts
function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, time);
  });
}
```

```ts
function* hello() {
  yield delay(1000);
  console.log("merhaba");
  
  yield delay(1000);
  console.log("dünya");
}
run(hello());
```

We printed the 'merhaba dünya' at 1 second intervals.

This run method is for deficient some cases. In this cases, you can use some libraries like [co](https://www.npmjs.com/package/co). I wrote a more advanced [run method] (run.md) to get more information on how these libraries are written. 

It may be a little bit difficult to understand this function but these library and similar libraries can do this cases,

* Followed done statement with return promise.
```ts
run(generator()).then(function() {

});
```

* When promise error, throwing exception on these line.
* You can call another generator function in code. for example;

```ts
function* taskA() {
  console.log("taskA");
  yield taskB();
  console.log("taskA done");
}

function* taskB() {
  console.log("taskB");
  yield delay(1000);
  console.log("taskB done");
}

run(taskA()).then(function() {
  console.log("All tasks done");
});
```

```ts
taskA
taskB
* Waiting 1 second
taskB done
taskA done
All tasks done
```

* You can wait for more task to finish using an array

```ts
function* taskA() {
  yield delay(2000);
  console.log("taskA");
  yield delay(1000);
  console.log("taskA done");
  return "A";
}

function* taskB() {
  yield delay(500);
  console.log("taskB");
  yield delay(500);
  console.log("taskB done");
  return "B";
}


function* taskX() {
  console.log("taskX");
  yield delay(1000);
  let arr = yield [taskA(), taskB()];
  console.log(arr);
  yield delay(1000);
  console.log("taskX done");
}

run(taskX());
```
> **PS:** If `yield` keyword used with an `*` asterisk, it can known the yield properties of the given object to it own right. For example;
> 
> ```ts
> function* count() {
>  yield 1;
>  yield 2;
> }
> 
> function* readThis() {
>   yield* count();
> }
> 
> let read = readThis();
> read.next(); // {value: 1, done: false}
> read.next(); // {value: 2, done: false}
> read.next(); // {value: undefined, done: true}
> ```
> 
> Also, `yield*` can return array values one-by-one and read the characters of the string one-by-one.
>
> ```ts
> function* dogsOut() {
>   yield* "who";
> }
> let whoLetThe = dogsOut();
> whoLetThe.next(); {value: 'w', done: false}
> whoLetThe.next(); {value: 'h', done: false}
> whoLetThe.next(); {value: 'o', done: false}
> whoLetThe.next(); {value: undefined, done: true}
> ```

# ES7 - Async functions

We've seen the easy way to manage async cases in ES6. But, we can't use yield directly making function call. We need `run()` method. In ES7, this requirement has been removed and the `async function` syntax has been introduced.

```ts
async function hello() {

}
```

We can do asynchronous function definition like as you can see at above.

```ts
async function hello() {
  console.log("merhaba");
}
hello();
```

In ES6 we have to use `run()` method, but in this case we have directly call function. We can think of asynchronous functions as a keyword that translates into promise.

```ts
async function hi() {
  console.log("merhaba");
}

// compiled like this,

function hi() {
  return new Promise(function(resolve, reject) {
    try {
      console.log("merhaba");
      resolve();
    } catch(e) {
      reject(e);
    }
  });
}

// async function definetly return a promise.
hi().then(function() {
  console.log("runned");
})
```

Okay then, what can i do this async functions? In ES6 we can use `yield` to pause asynchronous cases. But in ES7 `await` keyword for asynchronous cases.

```ts
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  });
}

async function hi() {
  console.log("merhaba");
  await delay(1000);
  console.log("dünya");
}

hi();
```

Because of async functions return promise, we can pause another async function in async function with await.

```ts
async function taskA() {
  console.log("A");
  let b = await taskB();
  return "A" + b;
}

async function taskB() {
  console.log("B");
  return "B";
}

taskA().then(function(result) {
  console.log(result); // AB
})
```

As you see this example, possible to use await in any expression. In this way we can set value for any variable.

> **Important PS:** During all of these happened, extremely recommended to you use try catches. If there is an error in promise at new added Node.js releases and if this error is not catched, `process.exit ()` will be executed like application crashes.

> **PS:** If we set `null` of `await` keyword, it's not an error.

> **PS:** If you give an external value to the promise, `await` keyword will pass directly. I mean, if write `let t = await 1;`, t value is equal 1. The normal function will be passed in the same way.
