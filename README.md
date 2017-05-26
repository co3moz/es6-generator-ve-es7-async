# ES6 Generatorler and yield (TR)
Bu repository altında bir ES6 standartı olan yield keyword'ünü inceleyeceğiz.

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

Bence tüm bu olayların dışında yield'ın en güzel olayı asenkron işleri yapmakta çatı sağlaması. Şimdi teorik olarak düşünelim. yield bir fonksiyon generatörünü durduruyor. 
