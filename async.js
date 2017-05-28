function run(g) {
  return new Promise(function (resolve, reject) {
    (function innerRun(g, data) {
      var i;

      try {
        i = g.next(data);
      } catch (e) {
        g.throw(e);
      }

      if (!i.done) {
        if (i.value != undefined && i.value.constructor == Promise) {
          i.value.then(function (data) {
            setTimeout(function (g) {
              innerRun(g, data);
            }, null, g);
          }, function (e) {
            g.throw(e);
          });
        } else if (i.value != undefined && i.value.toString() == "[object Generator]") {
          setTimeout(function (i, g) {
            run(i.value).then(function (data) {
              innerRun(g, data);
            }, function (e) {
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
            }, function (e) {
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

exports.delay = function delay(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, time);
  });
}

function next(arr) {
  return arr.find(function (p) {
    return p.status == 'begin';
  });
}

function unfinished(arr) {
  return arr.find(function (p) {
    return p.status == 'wait';
  });
}

function execute(p, callback) {
  if (p.promise.toString() == "[object Generator]") {
    p.promise = run(p.promise);
  }

  p.status = 'wait';
  p.promise.then(function (value) {
    p.data = value;
    p.status = 'ok';
    callback(p);
  }).catch(function (err) {
    p.data = err;
    p.status = 'err';
    callback(p);
  });
}

exports.concurrent = function concurrent(limit, arr) {
  arr = arr.map(function (value) {
    return {
      status: 'begin',
      promise: value,
      data: null,
    }
  });

  return new Promise(function (resolve, reject) {
    var errored = false;
    function done(p) {
      if (errored) {
        return;
      }

      if (p.status == 'err') {
        errored = true;
        reject(p.data);
        return;
      }

      var n = next(arr);
      if (!n) {
        if (!unfinished(arr)) {
          resolve(arr.map(function (p) {
            return p.data
          }));
        }
      } else {
        setTimeout(function (n, done) {
          execute(n, done);
        }, null, n, done);
      }
    }

    for (var i = 0; i < limit; i++) {
      var n = next(arr);
      if (n) {
        execute(n, done);
      }
    }
  });
}

exports.run = run;