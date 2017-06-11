async function taskA() {
    return taskB; // fonksiyon çağrısı yapılmadı
}

async function taskB() {
    return "1";
}

async function main() {
    let deger = await await taskA(); // bu hatalı bir çağrı olur.
    // let deger = await (await taskA())(); olmalı

    console.log(deger);
}

main().then(function() {

});