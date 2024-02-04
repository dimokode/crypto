;(function(){
function init(){}

async function bootLoader(){
    Symbols3.show()
    //test.testPopup();
    //doIt();


    //await scalp.show();
    //$('#btnAddScalp').click();
    //forma.showForms();
    //test.show();
    //chart.show();
    //trade.show();
}


async function doIt(){
    //const data = await orders.getOrdersBySymbol('BTC');
    //console.log(data);

    const arrAssets = await assets.getAssets();
    console.log(arrAssets);
    
    const balances = await Symbols3.getBalances();
    console.log('balances', balances);
    
    const filteredBalances = Symbols3.filterBalances2(balances, arrAssets);
    console.log('filteredBalances', filteredBalances);

    
}



init.bootLoader = bootLoader;
window.init = init;

})();