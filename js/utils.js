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

utils.show = show;
utils.createExchangePairs = createExchangePairs;
window.utils = utils;
})();