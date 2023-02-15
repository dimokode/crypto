;(function(){

function btn(){}

function showSymbolInfo(btnElement){
    let tableId = tableto.getTableIdByTdElement(btnElement);
    let assetId = tableto.getRowIdByTdElement(btnElement);
    console.log('tableId', tableId);
    console.log('assetId', assetId);
    Symbols3.showSymbolInfo(assetId);
}

btn.showSymbolInfo = showSymbolInfo;
window.btn = btn;

})();