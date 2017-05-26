# ES6 Generators and yield (TR)
Bu repository altında bir ES6 standartı olan yield keyword'ünü inceleyeceğiz.

## Nedir bu generatorler?
Generatörler adlandırıldığı gibi bir takım fonksiyondur. Normal bir fonksiyondan farklı olarak çalışma zamanından kaldığı yerden devam etme özelliği taşırlar. Bu sayede bir işi üretirken bir anda döndürmek yerine parça parça döndürebilme yeteneğine sahiptirler.

Generatör fonksiyonumuzu tanımlarken normal fonksiyona ek, `*` (yıldız) harfini kullanmamız gerekiyor.


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
g.next(); // {value: undefined, done: true}
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
g.next(); // {value: undefined, done: false}
```

Gördüğünüz gibi bu sefer done değeri false oldu. Eğer bir defa daha `.next()` metodunu çalıştırırsak;

```es6
function* generator() {
  console.log("merhaba");
  yield;
}

var g = generator();
g.next(); // {value: undefined, done: false}
g.next(); // {value: undefined, done: true}
```

Done değeri true olacak. `.next()` metodu çağrıldığında yield ifadesine gelinceye kadar tüm kodlar sırayla çalıştırılır. yield ifadesi geldiğinde eğer return gibi sağında bir değer işlem varsa yapılır, döndürdüğü değer ise `.next()` methodunun döndürdüğü objenin value property'sine yazılır.
