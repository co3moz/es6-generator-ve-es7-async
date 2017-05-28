var async = require('../async.js');
var run = async.run;
var delay = async.delay;
var concurrent = async.concurrent;

var d = Date.now();

function* taskA() {
    console.log("1");
    throw new Error(1);
    console.log("2");
}

function* main() {
    console.log("3");
    yield taskA();
    console.log("4");
}

run(main()).then(() => {
    console.log("program exit");
    process.exit(0);
},(err) => {
    console.log("program exit with error " + err.stack);
    process.exit(1);
});