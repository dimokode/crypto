;(function(){

function utils(){}

async function show(){
    const html = await template.loadRawTemplateFromFile('utils.html');
    $('content').html(html);
}

async function createExchangePairs(){
    const objExchangeInfo = await getExchangeInfo();
    console.log(objExchangeInfo);
    const symbols = objExchangeInfo['symbols']
    let objPairs = {};
    for(let pair in symbols){
        const objPair = symbols[pair];
        const baseAsset = objPair['baseAsset'];
        const quoteAsset = objPair['quoteAsset'];
        if( objPairs[baseAsset] == undefined){
            objPairs[baseAsset] = [];
        }
        objPairs[baseAsset].push(quoteAsset);
    }
    console.log(objPairs);

    common.sendAjax({
        controller : 'Symbols3',
        action : 'saveExchangePairs',
        data : objPairs
    }).then( response => {
        console.log( response );
    });
    return true;
    //return objPairs;
}


function getExchangeInfo(){
    const pricesRequestObj = {
        controller : 'symbols3',
        action : 'getExchangeInfo',
    }

    return common.sendAjax(pricesRequestObj).then(function(response){
            if(response.success){
                //return response['data'];
                //console.log(response.data);
                return response.data;
            }else{
                throw new Error(response.error);
            }
        }).catch( err => console.error(err));
}


async function getOrdersForAllOwnedAssets(){
    let objBalances = await Symbols3.getBalances();
    const actual = objBalances.actual.data;
    const previous = objBalances.previous.data;
    // console.log('actual', actual)
    // console.log('previous', previous);
    assets = new Set()
    for(assetName in actual){
        // console.log(asset, actual[assetName]);
        if(parseFloat(actual[assetName].available) > 0 || parseFloat(actual[assetName].onOrder) > 0){
            assets.add(assetName)        
        }
    }

    for(assetName in previous){
        // console.log(asset, previous[assetName]);
        if(parseFloat(previous[assetName].available) > 0 || parseFloat(previous[assetName].onOrder) > 0){
            assets.add(assetName)        
        }
    }

    assets = [...assets]
    // assetName = 'BTC'
    assets.forEach((assetName) => {
        const promisesOrders = [];
        stablecoins.forEach((stablecoin)=>{
            let pair = assetName+stablecoin;
            promisesOrders.push(orders.retrieveOrdersFromBinanceForPair(pair))
        });

        arrOrders = []
        Promise.all(promisesOrders).then((responseOrders) => {
            arrOrders.push(responseOrders)
        })
        console.log('arrOrders', arrOrders)
    })
}

utils.show = show;
utils.createExchangePairs = createExchangePairs;
utils.getOrdersForAllOwnedAssets = getOrdersForAllOwnedAssets;
window.utils = utils;
})();