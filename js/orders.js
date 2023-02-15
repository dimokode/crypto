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


orders.getOrdersBySymbol = getOrdersBySymbol;
orders.getOrders = getOrders;
window.orders = orders;
})();