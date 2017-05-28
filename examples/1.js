var async = require('../async.js');
var run = async.run;
var delay = async.delay;
var concurrent = async.concurrent;

var d = Date.now();

function* taskA() {
    console.log("+A " + (Date.now() - d));
    yield delay(500);
    console.log("-A " + (Date.now() - d));
    return "A";
}

function* taskB() {
    console.log("+B " + (Date.now() - d));
    yield delay(300);
    console.log("-B " + (Date.now() - d));
    return "B";
}

function* taskC() {
    console.log("+C " + (Date.now() - d));1
    yield delay(250);
    console.log("-C " + (Date.now() - d));
    return "C";
}

function* main() {
    yield taskA();
    let [a, b, c] = yield [taskA(), taskB(), taskC()];
    console.log("all tasks ended", a, b, c);

    let [ca, cb, cc] = yield concurrent(2, [taskA(), taskB(), taskC()]);
    console.log("all tasks ended", ca, cb, cc);
}

run(main()).then(() => {
    console.log("program exit");
    process.exit(0);
});