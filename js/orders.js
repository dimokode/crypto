;(function(){

function orders(){}


function getOrdersBySymbol(asset){
    const promisesOrders = [];
    const exchangeAssets = Exchange.getExchangePairsForAsset(asset);
    // console.log('exchangeAssets', exchangeAssets);

    exchangeAssets.forEach((exchangeAsset)=>{
        let pair = asset + exchangeAsset;
        // console.log(pair);
        promisesOrders.push( common.sendAjax({
            controller : 'Symbols3',
            action : 'getOrdersByPair',
            pair : pair
        }));
    });

    let arrOrders = [];
    return Promise.all(promisesOrders).then((responseOrders) => {

        // console.log('responseOrders', responseOrders);

        responseOrders = responseOrders.filter((item) => {
            return (item.success === true) ? true : false;
        }).map( item => item.data);
        // console.log('responseOrders', responseOrders);
         
        responseOrders.forEach( (item) => {
            arrOrders = arrOrders.concat(item);
        });

        return arrOrders;
    });
}

//should be renamed
function getOrders(){
    return common.sendAjax({
        controller: 'Orders',
        action: 'getOrders'
    }).then( response => {
        if(response.success){
            return response.arrFiles;
        }else{
            return false;
        }
        
        //console.log(response);
    });
}

function retrieveOrdersFromBinanceForPair(pair){
    const objRequest = {
        controller : 'Symbols3',
        action : 'retrieveOrdersFromBinanceForPair',
        pair : pair
    }

    return common.sendAjax(objRequest).then( response => {
        console.log('retrieveOrdersFromBinanceForPair', response);
        if(response.success){
            return response.data;
        }else{
            console.log(response.error);
            return false;
        }
    });
}


orders.getOrdersBySymbol = getOrdersBySymbol;
orders.getOrders = getOrders;
orders.retrieveOrdersFromBinanceForPair = retrieveOrdersFromBinanceForPair;
window.orders = orders;
})();