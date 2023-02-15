;(function(){

function test(){}

let ss,
candlestickSeries;

function test(){
    console.log(ss);
}


async function show(){
    const html = await template.loadRawTemplateByName('test.html');
    $('content').html(html);
    //str = "bbb";
}


function getWithdrawHistory(){
    $('#waitAMinute').show();
    common.sendAjax({
        controller : 'Symbols3',
        action : 'retrieveWithdrawHistoryFromBinance'
    }).then( response => {
        $('#waitAMinute').hide();
        console.log(response)    
    })
}

function getDepositHistory(){
    $('#waitAMinute').show();
    common.sendAjax({
        controller : 'Symbols3',
        action : 'retrieveDepositHistoryFromBinance'
    }).then( response => {
        $('#waitAMinute').hide();
        console.log(response)    
    })
}

function timeToTz(originalTime, timeZone) {
    const zonedDate = new Date(new Date(originalTime * 1000).toLocaleString('en-US', { timeZone }));
    return zonedDate.getTime() / 1000;
}

function timeToLocal(originalTime) {
    const d = new Date(originalTime * 1000);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
}

function prepareDataForChart(data){
    /*
A: "2.00546000"
B: "0.52617000"
C: 1652978232506
E: 1652978232510
F: 1372427122
L: 1374088601
O: 1652891832506
P: "3.786"
Q: "0.00841000"
a: "30230.47000000"
b: "30230.46000000"
c: "30230.46000000"
e: "24hrTicker"
h: "30545.18000000"
l: "28654.47000000"
n: 1661480
o: "29127.59000000"
p: "1102.87000000"
q: "2014747612.68578190"
s: "BTCUSDT"
v: "68531.29335000"
w: "29398.94337607"
x: "29128.70000000"
    */
    let dd = new Date(data['E']);

    let roundTS = (data['E'] - ( Number(dd.getSeconds())*1000 + Number(dd.getMilliseconds()) )) / 1000;
    console.log('roundTS', roundTS);

    return {
        time: timeToLocal(roundTS),
        //time: '2022-05-19',
        //time: data['E']/1000,
        open: data['o'],
        high: data['h'],
        low: data['l'],
        close: data['c'] 
    }
}

function prepareDataForKline(data){
    let dd = new Date(data['E']);

    let roundTS = (data['E'] - ( Number(dd.getSeconds())*1000 + Number(dd.getMilliseconds()) )) / 1000;
    console.log('roundTS', roundTS);

    return {
        time: timeToLocal(roundTS),
        //time: '2022-05-19',
        //time: data['E']/1000,
        open: data['k']['o'],
        high: data['k']['h'],
        low: data['k']['l'],
        close: data['k']['c'] 
    }
}

function convertTime(strTime){
    let td = convertTimestampToDatetime(strTime);
    console.log(td);
}

function myClickHandler(param) {
    if (!param.point) {
        return;
    }

    var ohlc = param.seriesPrices.get(candlestickSeries);
    console.log(ohlc);
    let price = candlestickSeries.coordinateToPrice(param.point.y);
    console.log(price);
    //console.log(`Click at ${param.point.x}, ${param.point.y}. The time is ${param.time}.`);
    //console.log(param.seriesPrices);
    //const price = param.seriesPrices.get(Series).high;
    //const price = param.seriesPrices.coordinateToPrice(100);
    //console.log(price);
}


async function getSocket(){

    const chart = LightweightCharts.createChart(document.body, { width: 800, height: 400 });
    chart.applyOptions({
        timeScale: {
            timeVisible: true,
            secondsVisible : false,
        }
    });

    chart.subscribeClick(myClickHandler);
    
    candlestickSeries = chart.addCandlestickSeries();
    //console.log(candlestickSeries);
    histogramSeries = chart.addHistogramSeries();

    const data = await bina.convertKlines('BTCUSDT', '1m');
    candlestickSeries.setData(data['klines']);
    //histogramSeries.setData(data['volumes']);




    //let socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");
    //<symbol>@kline_<interval>
    let socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");
    ss = socket;



    socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        console.log(data);
        //convertTime(data['E']);
        candlestickSeries.update(prepareDataForKline(data));
        //chart.timeScale().fitContent();
    }

    socket.onclose = function ( event ){
        //let price = candlestickSeries.coordinateToPrice(100);
        //console.log(price);
        console.log(event);
    }
    socket.onerror = function( error ){
        console.error(error);
    }
}

function closeSocket(){
    ss.close();
}


test.test = test;
test.show = show;
test.getWithdrawHistory = getWithdrawHistory;
test.getDepositHistory = getDepositHistory;
test.getSocket = getSocket;
test.closeSocket = closeSocket;
window.test = test;

})();