;(function(){

function testapi(){}

function show(){
    console.log('show from testapi');
    const capi = new CryptoAPI(new DummyApi());
    capi.retrieveOrdersForPair('ETHUSDC').then(response => {
        console.log('testapi', response);
    }).catch(error => {
        console.error(error.message);
    });
    // const result = capi.retrieveOrdersForPair('ETHUSDT');
    // console.log(result);
}

testapi.show = show;
window.testapi = testapi;

})();