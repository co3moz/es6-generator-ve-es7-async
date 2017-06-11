async function asenkron() {
    let hmm = await (async function() {
        return "hmm";
    })();

    console.log(hmm);
    return hmm;
}

asenkron().then((data) => {

}).catch((err) => {

});

