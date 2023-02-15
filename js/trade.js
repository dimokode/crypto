;(function(){

function trade(){}

async function show(){
    const html = await template.loadRawTemplateByName('trade.html');
    $('content').html(html);
    

}


async function openSymbolTrades(symbol){
    if(!symbol) symbol = 'BTCUSDT';
    const dataOpenOrders = await Symbols3.getOpenOrdersByPair(symbol);
    console.log('dataOpenOrders', dataOpenOrders);
    const table = dataviews.tableOpenOrders(dataOpenOrders);
    //console.log(table);
    
    /*
    const popupId = 'popupTrade'+symbol;
    popup.new(popupId);
    popup.show(popupId);
    */
   //$('trade-content').html('adads');
   const chart = new LWC('chart');
   const series = chart.addCandlestickSeries();
   const seriesVolumes = chart.addHistogramSeries({
        color: "#385263",
        lineWidth: 2,
        priceFormat: {
            type: "volume"
        },
        overlay: true,
        autoScale : true,
        scaleMargins: {
            top: 0.93,
            bottom: 0
        }
    });
   //series.setData(await bina.convertKlines('BTCUSDT', '1m'));
    const data = await bina.retrieveKlinesFromBinance(symbol, '1m');
    //chart.fitContent();
    console.log(data);

    series.setData(data['klines']);
    seriesVolumes.setData(data['volumes']);

   
   const wss = new WSS('klines', symbol, '1m');
   wss.onmessage((event) => {
       const data = bina.prepareDataForKline( JSON.parse(event.data) );
       console.log(data);
       series.update( data['dataKline'] );
       seriesVolumes.update( data['dataVolumes'] );
   });
   wss.onerror((error) => {
       console.error(error);
   })
   
}


function getSymbolFromInputs(id1, id2){
    return $(`#${id1}`).val()+$(`#${id2}`).val();
}

trade.show = show;
trade.openSymbolTrades = openSymbolTrades;
trade.getSymbolFromInputs = getSymbolFromInputs;
window.trade = trade;
})();