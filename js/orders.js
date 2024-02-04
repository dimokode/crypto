;(function(){

function orders(){}


function getOrdersBySymbol(asset){
    const promisesOrders = [];
    stablecoins.forEach((stablecoin)=>{
        let pair = asset+stablecoin;
        promisesOrders.push( common.sendAjax({
            controller : 'Symbols3',
            action : 'getOrdersByPair',
            pair : pair
        }));
    });

    let arrOrders = [];
    return Promise.all(promisesOrders).then((responseOrders) => {
        responseOrders = responseOrders.filter((item) => {
            return (item.success === true) ? true : false;
        }).map( item => item.data);
         
        responseOrders.forEach( (item) => {
            arrOrders = arrOrders.concat(item);
        })

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