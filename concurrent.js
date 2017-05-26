Object.defineProperty(Array.prototype, "concurrent", {
  value: function (limit) {
    var arr = Array.from(this);

    return new Promise(function (resolve, reject) {
      function done(t) {
        if (arr.length == 0) {
          resolve();
          return;
        }

        var obj = arr.shift();
        if (obj.toString() == "[object Generator]") {
          obj = run(obj);
        }

        obj.then(done).catch(reject);
      }

      for (var i = 0; i < limit; i++) {
        var obj = arr.shift();
        if(!obj) continue;
        if (obj.toString() == "[object Generator]") {
          obj = run(obj);
        }

        obj.then(done).catch(reject);
      }
    });
  }
});
