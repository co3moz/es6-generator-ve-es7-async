# ES6 generator and ES7 async functions (TR)
Bu repository altında ES6'da bulunan generatör fonksiyonlarını ve ES7'de bulunan async fonksiyonlarını inceleyeceğiz.

# ES6 - Generatörler

## Nedir bu generatorler?
Generatörler adlandırıldığı gibi bir takım fonksiyondur. Normal bir fonksiyondan farklı olarak çalışma zamanından kaldığı yerden devam etme özelliği taşırlar. Bu sayede bir işi üretirken bir anda döndürmek yerine parça parça döndürebilme yeteneğine sahiptirler.

Generatör fonksiyonumuzu tanımlarken normal fonksiyona ek, `*` (yıldız) karakterini kullanmamız gerekiyor.


```ts
function* generator() {

}
```

Bu generator fonksiyonumuzu çağırdığımız taktirde generator'ün gövdesinde tanımlı olan kod parçası çalışmaz.


```ts
function* generator() {
  console.log("merhaba");
}

generator();
```

Bunun yerine generator fonksiyonu özel başka bir obje döndürüyor. Eğer dönen bu objenin `.next()` metodunu çağırırsanız merhaba yazısını görebileceksiniz.

```ts
function* generator() {
  console.log("merhaba");
}

var g = generator();
g.next(); // "merhaba" yazıldı ve {value: undefined, done: true} döndürüldü
```

Gördüğünüz gibi metod başka bir obje döndürdü. Burada `value` undefined olarak atanmış ve `done` ise true. `done` ifadesi generatör fonksiyonun tüm işlevinin bittiğini gösteriyor. `value` ise return edilen değeri getiriyor. 

Buraya kadar normal fonksiyonun dışında farklı bir işlem göremedik ancak işler daha yeni kızışmaya başladı.

## Yield

Generatörlerin `done` değeri döndürdüğünü gördük, demek ki biz generatörleri bir şey kullanarak durdurabiliyoruz. `yield` bu işi yapmamızı sağlayan özelliktir.

`yield` tıpkı return gibi fonksiyondan çıkışı sağlar ancak returnun aksine çıkılan bu fonksiyona tekrar girişi mümkün kılar. Sadece bu da değil; çıkılan noktaya dışardan değer girilebilmesinide sağlar.

```ts
function* generator() {
  console.log("merhaba");
  yield;
}

var g = generator();
g.next(); // "merhaba" yazıldı ve {value: undefined, done: false} döndürüldü
```

Gördüğünüz gibi bu sefer `done` değeri false oldu. Eğer bir defa daha `.next()` metodunu çalıştırırsak;

```js
function* generator() {
  console.log("merhaba");
  yield;
}

var g = generator();
g.next(); // "merhaba" yazıldı ve {value: undefined, done: false} döndürüldü
g.next(); // {value: undefined, done: true} döndürüldü
```

`done` değeri `true` olacak. `.next()` metodu çağrıldığında `yield` ifadesine gelinceye kadar tüm kodlar sırayla çalıştırılır. `yield` ifadesi geldiğinde eğer return gibi sağında bir değer işlem varsa yapılır, döndürdüğü değer ise `.next()` methodunun döndürdüğü objenin `value` property'sine yazılır.

Eğer bir değer döndürmek istersek `yield`'in sağına yazabiliriz.

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

Bu fikirden yola çıkarak `fibonacci sayılarını` generate edebiliriz.

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

Bu generatorümüzün herhangi bir sonu yok. Yani `done` asla true olmayacak.

## for-of altında generatörler

Generatörlerimizi `for-of` syntaxı içinde kullanmamız mümkündür. Ancak bir önceki örnekte olduğu gibi sonsuz olmasından kaçının. Her bir iteration'da `.next()` çağrısı yapılacak ve döndürülen değer değişkene yansıtılacak. For gövdesindeki işler tamamlandıktan sonra tekrar `.next()` çağrısı yapılacak. `done` `true` olduğu an döngü kırılacak. 

```ts
function* fibonacci(limit) {
  let a = 1, b = 1;
  while(limit--) {
    console.log("bir sonraki :" + (a + b));
    yield a + b;
    let t = b;
    b = a + b;
    a = t;
  }
  console.log("bitti");
}

for(sayi of fibonacci(10)) {
  console.log(sayi);
}
```

Bu kodumuzun konsol çıktısı;

```ts
bir sonraki :2
2
bir sonraki :3
3
bir sonraki :5
5
bir sonraki :8
8
bir sonraki :13
13
bir sonraki :21
21
bir sonraki :34
34
bir sonraki :55
55
bir sonraki :89
89
bir sonraki :144
144
bitti
```

## next, throw ve return
`.next()` metodunun bir parametre girişi vardır. Bu girişten vereceğimiz sayı ile `yield` alanına sayı göndermemiz mümkündür.

```ts
function* say() {
  var baslangic = yield;
  console.log(baslangic);
}

var s = say();
s.next(); // yield alanına kadar next yapıyoruz.
s.next(3); // 3
```

`.throw()` metodu tıpkı next gibi kodun bulunduğu yerde `throw` yapar.

```ts
function* say() {
  try {
    yield Math.random();
  } catch(e) {
    console.error(e); // 0.5'ten büyük olmamalı
  }
}

var s = say();
if(s.next().value > 0.5) {
  s.throw(new Error("0.5'ten büyük olmamalı"));
}
```

`.return()` metodu generatorü sonlandırarak ilk parametredeki değeri value olarak döndürür. 

```ts
function* say() {
  console.log(1);
  yield 1;
  console.log(2);
  yield 2;
  console.log(3);
  yield 3;
}

var s = say();
s.next(); // {value: 1, done: false}
s.return(4); // {value: 4, done: true}
s.next(); // {value: undefined, done: true}
```

## Yield ve asenkron işler

Bence tüm bu olayların dışında `yield`'ın en güzel olayı asenkron işleri yapmakta çatı sağlaması. Şimdi teorik olarak düşünelim. `yield` bir fonksiyon generatörünü durduruyor. Sadece durdurmakla kalmıyor bize veride veriyor. Biz `yield`'da `promise` versek, ve bu `promise` bittiğinde başka bir next çağırmasını sağlasak callbacklerden kurtulmuş olmaz mıyız?

```ts
function* asenkron() {
  yield new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, 1000);
  });
  console.log("merhaba");
}

var s = asenkron();
var promise = s.next().value; // {value: Promise, done: false}
promise.then(function() {
  s.next();
});
```

Bu kod ile 1 saniye bekledikten sonra merhaba yazdırdık. Öyle bir fonksiyon tasarlayalım ki bu işi bizim yerimize o yapsın.

```ts
function run(g) {
  var i = g.next(); // bir sonraki değeri getir
  if (!i.done) { // eğer bitmediyse
    if (i.value && i.value.constructor == Promise) { // dönen değer promise ise
      i.value.then(function (data) { // promise'in bitmesini bkele
        run(g); // yeniden kendini çağır
      }).catch(function (e) { // hata oluştuysa
        g.throw(e); // ilgili yerde hata fırlat
      });
    } else { // eğer promise değilse sadece devam et
      run(g);
    }
  }
}
```

Tabi ki bu kodu inanılmaz derecede basit tuttum ve bu yüzden de bellek problemleri var. Kullanmak için tek yapılması gereken `run(generator())` çağrısı yapmak. Daha önce tanımladığımız delay işlemini fonksiyon halinede getirelim.

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
function* merhaba() {
  yield delay(1000);
  console.log("merhaba");
  
  yield delay(1000);
  console.log("dünya");
}
run(merhaba());
```

1 saniye aralıklarla merhaba dünya yazdırdık.

Bu run metodunu biraz daha mükemmelleştirip aşağıdaki haline getirdim. Ancak bu sefer pek direkt satır satır anlaşılmıyor. Zaten bu kısmın kullanıcı tarafından anlaşılmasına pek gerek yok. 

```ts
function run(g) {
  return new Promise(function (resolve, reject) { // kendisi bir promise döndürüyor.
    (function innerRun(g, data) {
      var i = g.next(data); // bir sonraki değeri getir
      if (!i.done) { // eğer bitmediyse
        if (i.value != undefined && i.value.constructor == Promise) { // değer promise ise
          i.value.then(function (data) { // promise'in bitmesini bekle
            setTimeout(function (g) { // stack'in şişmesini engelliyoruz bu çağrıyla
              innerRun(g, data); // kendini çağır 
            }, null, g);
          }).catch(function (e) { // promise hata döndürürse
            g.throw(e); // ilgili satırda hata fırlat
          });
        } else if (i.value != undefined && i.value.toString() == "[object Generator]") { // eğer değer bir generatörse
          setTimeout(function (i, g) { // stack'in şişmesini engelle
            run(i.value).then(function (data) { // run çağrısı yap ve bittiğinde geri innerRun fonksiyonunu tetikle
              innerRun(g, data);
            }).catch(function (e) {
              g.throw(e);
            });
          }, null, i, g);
        } else if (i.value != undefined && i.value.constructor == Array) { // eğer değer bir dizi ise
          setTimeout(function (i, g) { // stack'in şişmesini engelle
            var arr = i.value.map(function (t) { // her bir değer için
              if (t == null) { // null olmayanları
                return;
              }

              if (t.constructor == Promise) { // promise olanlar direkt olarak geçecek şekilde 
                return t;
              }

              if (t.toString() == "[object Generator]") { // generatörler run'ı çağıracak biçimde
                return run(t);
              }
            });
            Promise.all(arr).then(function (data) { // promise.all çağrısı yap bu sayede tüm bu promise'lerin bitmesini bekle
              innerRun(g, data);
            }).catch(function (e) {
              g.throw(e);
            });
          }, null, i, g);
        } else { // eğer değer ne promise ne generatör nede diziyse
          setTimeout(function (i, g) { // stack'in şişmesini engelle
            innerRun(g, i.value);
          }, null, i, g);
        }
      } else { // done: true ise
        resolve(i.value); // bitir.
      }
    })(g);
  });
}
```

Bu fonksiyon ile aşağıdaki işlemleri yapabilirsiniz;

* Promise döndürerek bitişi takip etmek.

```ts
run(generator()).then(function() {

});
```

* Promise hata verdiğinde ilgili satırda exception fırlatımı
* Kod içerisinde başka bir generator fonksiyonu çağırabilirsiniz. örneğin;

```ts
function* taskA() {
  console.log("taskA");
  yield taskB();
  console.log("taskA bitti");
}

function* taskB() {
  console.log("taskB");
  yield delay(1000);
  console.log("taskB bitti");
}

run(taskA()).then(function() {
  console.log("tüm tasklar bitti");
});
```

```ts
taskA
taskB
* 1 saniye bekler
taskB bitti
taskA bitti
tüm tasklar bitti
```

* Dizi verilerek birden fazla taskın bitmesini bekleyebilirsiniz

```ts
function* taskA() {
  yield delay(2000);
  console.log("taskA");
  yield delay(1000);
  console.log("taskA bitti");
  return "A";
}

function* taskB() {
  yield delay(500);
  console.log("taskB");
  yield delay(500);
  console.log("taskB bitti");
  return "B";
}


function* taskX() {
  console.log("taskX");
  yield delay(1000);
  let arr = yield [taskA(), taskB()];
  console.log(arr);
  yield delay(1000);
  console.log("taskX bitti");
}

run(taskX());
```

# ES7 - Async fonksiyonlar

ES6'da asenkron işleri yönetmenin kolay yolunu gördük. Ancak yield'i direkt olarak fonksiyon çağrısı yaparak kullanamıyoruz. `run()` methoduna ihtiyacımız var. ES7'de bu ihtiyaç kaldırılarak `async function` syntax'ı gelmiştir.


```ts
async function merhaba() {

}
```

Yukardaki gibi asenkron fonksiyon tanımlaması yapabiliriz. 

```ts
async function merhaba() {
  console.log("merhaba");
}
merhaba();
```

ES6'da `run()` methodunu kullanmamız gerekirken, burada direkt olarak fonksiyon çağrısı yaptık. Asenkron fonksiyonları sanki promise yapısına çeviren bir keyword olarak düşünebiliriz.

```ts
async function selam() {
  console.log("merhaba");
}

// aşağıdaki gibi derleniyor

function selam() {
  return new Promise(function(resolve, reject) {
    try {
      console.log("merhaba");
      resolve();
    } catch(e) {
      reject(e);
    }
  });
}

// bir asenkron fonksiyon her daim bir promise döndürecektir.
selam().then(function() {
  console.log("çalıştı");
})
```

Peki bu async fonksiyonlarla neler yapabilirim. ES6'da `yield`'ı asenkron işleri bekletmek için kullanabiliyorduk. ES7'de bu iş için `await` keywordu bulunmaktadır.

```ts
function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  });
}

async function selam() {
  console.log("merhaba");
  await delay(1000);
  console.log("dünya");
}

selam();
```

async fonksiyonlar promise döndürdüğü için bir async fonksiyonu içinde await ile başka bir async fonksiyonu bekletebiliriz.

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

taskA().then(function(sonuc) {
  console.log(sonuc); // AB
})
```

Örnektede görüldüğü gibi await'i herhangi bir expression içinde kullanmamız mümkün. Bu sayede bir değişkene değer atayabiliriz. Döndürdüğümüz değer await'in bulunduğu konuma yerleştirilecektir.

> **Önemli Not:** Bu tüm işlemler sırasında try catch kullanmanız şiddetle önerilir. İlerki Node.js sürümlerinde eğer promisede oluşmuş bir hata varsa ve catch ile yakalanmamışsa uygulama çökmüş gibi `process.exit()` işlemi yapılacaktır.

> **Not:** `await` keywordune `null` verirsek bir hataya neden olmayacaktır.

> **Not:** `await` keywordune promise harici bir değer verirsek direkt olarak pass edecektir yani `let t = await 1;` yaparsanız t değeri direkt 1 olacaktır. Normal fonksiyonları versenizde aynı şekide pass işlemi yapılacaktır.
