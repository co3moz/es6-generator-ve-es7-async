# ES6 generator and ES7 async functions (TR)
Bu repository altında ES6'da bulunan generatör fonksiyonlarını ve ES7'de bulunan async fonksiyonlarını inceleyeceğiz.

# ES6 - Generatörler

## Nedir bu generatorler?
Generatörler adlandırıldığı gibi bir takım fonksiyondur. Normal bir fonksiyondan farklı olarak çalışma zamanından kaldığı yerden devam etme özelliği taşırlar. Bu sayede bir işi üretirken bir anda döndürmek yerine parça parça döndürebilme yeteneğine sahiptirler.

Generatör fonksiyonumuzu tanımlarken normal fonksiyona ek, `*` (yıldız) karakterini kullanmamız gerekiyor.


```es6
function* generator() {

}
```

Bu generator fonksiyonumuzu çağırdığımız taktirde generator'ün gövdesinde tanımlı olan kod parçası çalışmaz.


```es6
function* generator() {
  console.log("merhaba");
}

generator();
```

Bunun yerine generator fonksiyonu özel başka bir obje döndürüyor. Eğer dönen bu objenin `.next()` metodunu çağırırsanız merhaba yazısını görebileceksiniz.

```es6
function* generator() {
  console.log("merhaba");
}

var g = generator();
g.next(); // "merhaba yazıldı" ve {value: undefined, done: true} döndürüldü
```

Gördüğünüz gibi metod başka bir obje döndürdü. Burada value undefined olarak atanmış ve done ise true. done ifadesi generatör fonksiyonun tüm işlevinin bittiğini gösteriyor. Value ise return edilen değeri getiriyor. 

Buraya kadar normal fonksiyonun dışında farklı bir işlem göremedik ancak işler daha yeni kızışmaya başladı.

## Yield

Generatörlerin done objesi döndürdüğünü gördük, demek ki biz generatörleri bir şey kullanarak durdurabiliyoruz. İşte aradığımız keyword `yield`tır.

Yield tıpkı return gibi fonksiyondan çıkışı sağlar. Ancak returnun aksine çıkılan bu fonksiyona tekrar girişi mümkün kılar. Sadece bu da değil; çıkılan noktaya dışardan değer girilebilmesinide sağlar.

```es6
function* generator() {
  console.log("merhaba");
  yield;
}

var g = generator();
g.next(); // "merhaba yazıldı" ve {value: undefined, done: false} döndürüldü
```

Gördüğünüz gibi bu sefer done değeri false oldu. Eğer bir defa daha `.next()` metodunu çalıştırırsak;

```es6
function* generator() {
  console.log("merhaba");
  yield;
}

var g = generator();
g.next(); // "merhaba yazıldı" ve {value: undefined, done: false} döndürüldü
g.next(); // {value: undefined, done: true} döndürüldü
```

Done değeri true olacak. `.next()` metodu çağrıldığında yield ifadesine gelinceye kadar tüm kodlar sırayla çalıştırılır. yield ifadesi geldiğinde eğer return gibi sağında bir değer işlem varsa yapılır, döndürdüğü değer ise `.next()` methodunun döndürdüğü objenin value property'sine yazılır.

Eğer bir değer döndürmek istersek yield'in sağına yazabiliriz.

```es6
function* generator() {
  console.log("merhaba");
  yield 8;
  yield 9;
}

var g = generator();
g.next(); // {value: 8, done: false}
g.next(); // {value: 9, done: false}
g.next(); // {value: undefined, done: true}
```

Bu fikirden yola çıkarak fibonacci sayılarını generate edebiliriz.

```es6
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

Bu generatorümüzün herhangi bir sonu yok. Yani done asla true olmayacak.

## for-of altında generatörler

Generatörlerimizi for-of syntaxı içinde kullanmamız mümkündür. Ancak bir önceki örnekte olduğu gibi sonsuz olmasından kaçının. Her bir iteration'da `.next()` çağrısı yapılacak ve döndürülen değer değişkene yansıtılacak. For gövdesindeki işler tamamlandıktan sonra tekrar `.next()` çağrısı yapılacak. done true olduğu an döngü kırılacak. 

```es6
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

```
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
`.next()` metodunun bir parametre girişi vardır. Bu girişten vereceğimiz sayı ile yield alanına sayı göndermemiz mümkündür.

```es6
function* say() {
  var baslangic = yield;
  console.log(baslangic);
}

var s = say();
s.next(); // yield alanına kadar next yapıyoruz.
s.next(3); // 3
```

`.throw()` metodu tıpkı next gibi kodun bulunduğu yerde throw yapar.

```es6
function* say() {
  try {
    yield Math.random();
  } catch(e) {
    // sayı 0.5'ten büyük
    console.log("sayı 0.5'ten büyük");
  }
}

var s = say();
if(s.next().value > 0.5) {
  s.throw(new Error("0.5'ten büyük olmamalı"));
}
```

`.return()` metodu generatorü sonlandırarak ilk parametredeki değeri value olarak döndürür. 

```es6
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

Bence tüm bu olayların dışında yield'ın en güzel olayı asenkron işleri yapmakta çatı sağlaması. Şimdi teorik olarak düşünelim. yield bir fonksiyon generatörünü durduruyor. Sadece durdurmakla kalmıyor bize veride veriyor. Biz yield'ta promise alsak, ve bu promise'nin bittiğinde başka bir next çağırmasını sağlasak callbacklerden kurtulmuş olmaz mıyız?

```es6
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

```es6
function run(g) {
  var i = g.next();
  if (!i.done) {
    if (i.value && i.value.constructor == Promise) {
      i.value.then(function (data) {
        run(g);
      }).catch(function (e) {
        g.throw(e);
      });
    } else {
      run(g);
    }
  }
}
```

Tabi ki bu kod inanılmaz derecede basit tutuldu ve bu yüzden de bellek açığı var. Kullanmak çok basit tek yapılması gereken `run(generator())` çağrısı yapmak. Yukarda daha önce tanımladığımız delay işlemini fonksiyon halinede getirelim.

```es6
function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, time);
  });
}
```

```es6
function* merhaba() {
  yield delay(1000);
  console.log("merhaba");
  
  yield delay(1000);
  console.log("dünya");
}
run(merhaba());
```

Gerçekten çok rahat okunabilir bu kod ile 1 saniye aralıklarla merhaba dünya yazdırdık.

Bu run metodunu biraz daha mükemmelleştirip aşağıdaki haline getirdim. Ancak bu sefer pek direkt satır satır anlaşılmıyor. Zaten bu kısmın kullanıcı tarafından anlaşılmasına pek gerek yok. 

```es6
function run(g) {
  return new Promise(function (resolve, reject) {
    (function innerRun(g, data) {
      var i = g.next(data);
      if (!i.done) {
        if (i.value != undefined && i.value.constructor == Promise) {
          i.value.then(function (data) {
            setTimeout(function (g) {
              innerRun(g, data);
            }, null, g);
          }).catch(function (e) {
            g.throw(e);
          });
        } else if (i.value != undefined && i.value.toString() == "[object Generator]") {
          setTimeout(function (i, g) {
            run(i.value).then(function (data) {
              innerRun(g, data);
            }).catch(function (e) {
              g.throw(e);
            });
          }, null, i, g);
        } else if (i.value != undefined && i.value.constructor == Array) {
          setTimeout(function (i, g) {
            var arr = i.value.map(function (t) {
              if (t == null) {
                return;
              }

              if (t.constructor == Promise) {
                return t;
              }

              if (t.toString() == "[object Generator]") {
                return run(t);
              }
            });
            Promise.all(arr).then(function (data) {
              innerRun(g, data);
            }).catch(function (e) {
              g.throw(e);
            });
          }, null, i, g);
        } else {
          setTimeout(function (i, g) {
            innerRun(g, i.value);
          }, null, i, g);
        }
      } else {
        resolve(i.value);
      }
    })(g);
  });
}
```

Bu fonksiyon ile aşağıdaki işlemleri yapabilirsiniz;

* Promise döndürerek bitişi takip etmek.

```es6
run(generator()).then(function() {

});
```

* Promise hata verdiğinde ilgili satırda exception fırlatımı
* Kod içerisinde başka bir generator fonksiyonu çağırabilirsiniz. örneğin;

```es6
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

```
taskA
taskB
* 1 saniye bekler
taskB bitti
taskA bitti
tüm tasklar bitti
```

* Dizi verilerek birden fazla taskın bitmesini bekleyebilirsiniz

```es6
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


```es7
async function merhaba() {

}
```

Yukardaki gibi asenkron fonksiyon tanımlaması yapabiliriz. 

```es7
async function merhaba() {
  console.log("merhaba");
}
merhaba();
```

ES6'da `run()` methodunu kullanmamız gerekirken, burada direkt olarak fonksiyon çağrısı yaptık. Asenkron fonksiyonları sanki promise yapısına çeviren bir keyword olarak düşünebiliriz.

```es7
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

```es7
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

```es7
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
