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