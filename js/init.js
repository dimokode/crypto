;(function(){
function init(){}

async function bootLoader(){
    //Symbols3.show()
    doIt();


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

    const data = await orders.getOrders();
    if(data){
        console.log(data);
        const ss = new Set();
        data.forEach(symbolData => {
            //console.log(symbolData);
            
            const symbol = symbolData.filename.split('.')[0];
            //console.log(symbol);

            stablecoins.forEach( stablecoin => {
                //console.log(stablecoin);
                const pos = symbol.indexOf(stablecoin);
                //console.log(pos);
                if(pos !== -1){
                    const asset = symbol.slice(0, pos);
                    console.log(asset);
                    ss.add(asset);
                }
            });
            
        });
        const arrAssets = [...ss];
        //console.log(arrAssets);
        const balances = await Symbols3.getBalances();
        console.log('balances', balances);
        const filteredBalances = Symbols3.filterBalances2(balances, arrAssets);
        console.log('filteredBalances', filteredBalances);
        //arrAssets.forEach( asset => {
            //console.log(asset);
        //});
    }else{
        console.log('something goes wrong!');
    }
    
}



init.bootLoader = bootLoader;
window.init = init;

})();