;(function assets(){

// dataBalancesHistory_raw
// {
//     actual:{
//         data: {
//             BTC: {
//                 "available": "24.80000000",
//                 "onOrder": "0.00000000",
//                 "btcValue": 0,
//                 "btcTotal": 0
//             }
//         },
//         success: true,
//         timestamp: 000000000
//     },
//     previous:{
//         data: {
//             BTC: {
//                 "available": "24.80000000",
//                 "onOrder": "0.00000000",
//                 "btcValue": 0,
//                 "btcTotal": 0
//             }
//         },
//         success: true,
//         timestamp: 000000000
//     },
// }
async function getAssets(dataBalancesHistory_raw){
    let [assetsFromBalance, LD_assets] = getAssetsFromBalance(dataBalancesHistory_raw);
    let assetsFromOrders = await getAssetsFromOrders();
    const assets = new Set([...assetsFromBalance, ...assetsFromOrders]);
    return [[...assets], LD_assets];
}


function getAssetsFromBalance(dataBalancesHistory_raw){
    // let assets = new Set();
    const actual = getNotZeroAssets(dataBalancesHistory_raw['actual']['data']);
    const previous = getNotZeroAssets(dataBalancesHistory_raw['previous']['data']);
    const assets = new Set([...actual, ...previous]);
    let LD_assets = {}
    for(let asset of assets){
        
        if(asset.startsWith('LD')){
            let LD_asset = asset.slice(2);
            // console.log(asset, LD_asset);
            assets.delete(asset);
            assets.add(LD_asset);
            LD_assets[LD_asset] = dataBalancesHistory_raw['actual']['data'][asset]['available']
        }
    }
    return [assets, LD_assets];
    // return [...assets];
}

function getNotZeroAssets(data){
    const assets = new Set();
    for(let asset in data){
        if(Number(data[asset]['available']) > 0 || Number(data[asset]['onOrder']) > 0){
            assets.add(asset)
        }
    }
    console.log(assets);
    return assets;
}


async function getAssetsFromOrders(){
    const data = await orders.getOrders();
    console.log('data', data)
    if(data){
        //console.log(data);
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
                    //console.log(asset);
                    ss.add(asset);
                }
            });
            
        });
        // return [...ss];
        return ss;
    }
}




async function showAsset(el){

    let tableId = tableto.getTableIdByTdElement(el);
    let asset = rowId = tableto.getRowIdByTdElement(el);//rename symbol to asset

    console.log('tableId', tableId);
    console.log('rowId', rowId);

    let price = tableto.td(tableId, rowId, 'price').getData('actual');
    let available = tableto.getTdContent(tableId, rowId, 'available');
    let onOrder = tableto.getTdContent(tableId, rowId, 'onOrder');
    let arrOrders = await orders.getOrdersBySymbol(asset);


    let objAnalitica = {
        symbol : asset,
        price : price,
        available : available,
        onOrder : onOrder,
        orders : arrOrders
    }

    let objBalance = Symbols3.analitica(objAnalitica);
    console.log('objBalance', JSON.stringify(objBalance, null, "\t"));
    

    //const popupId = popup.new();
    //popup.show(popupId);
    const popup = new Popup2();
    popup.show();

    const html = await template.loadRawTemplateByName('assetPage.html');
    const htmlPopup = await template.loadRawTemplateFromFile('ordersBySymbol.html');
    popup.body().insert(html);
    popup.header().insert(htmlPopup);
    popup.body().insert(asset, 'asset');
    //popup.addContentBySelector(popupId, asset, 'asset');
    //popup.addContentBySelector(popupId, JSON.stringify(objBalance, null, "\t"), '#info');
    //popup.addContent(popupId, `<h1>${asset}</h1>`);
    //popup.addContent(popupId, `Something else`);
    for(let param in objBalance){
        console.log(param);
        popup.header().insert(objBalance[param], 'div[name="'+param+'"]>span');
    }

}

function changeColor(el, color_style='w3-yellow'){
    let tableId = tableto.getTableIdByTdElement(el);
    let asset = rowId = tableto.getRowIdByTdElement(el);

    tableto.td(tableId, asset, 'symbol').setColor(color_style);
}



assets.getAssets = getAssets;
assets.showAsset = showAsset;
assets.changeColor = changeColor;
window.assets = assets;

})();