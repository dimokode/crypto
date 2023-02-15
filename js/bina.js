;(function(){

function bina(){}



 async function getData(urlSufix, params){
    
    let url = 'https://api.binance.com/'+urlSufix;
    let arr = [];
    for(let paramName in params){
        arr.push(`${paramName}=${params[paramName]}`);
    }
    let str = arr.join('&');

    url = url + '?' + str;
    console.log(url);

    const response = await fetch(url);
    const data = await response.json();
    return data;
}


/**
Parameters:

Name	    Type	Mandatory	Description
symbol	    STRING	YES	
interval	ENUM	YES	
startTime	LONG	NO	
endTime	    LONG	NO	
limit	    INT	    NO	        Default 500; max 1000

Response:

1499040000000,      // Open time
"0.01634790",       // Open
"0.80000000",       // High
"0.01575800",       // Low
"0.01577100",       // Close
"148976.11427815",  // Volume
1499644799999,      // Close time
"2434.19055334",    // Quote asset volume
308,                // Number of trades
"1756.87402397",    // Taker buy base asset volume
"28.46694368",      // Taker buy quote asset volume
"17928899.62484339" // Ignore.
 */
async function klines(symbol, interval){
    ///api/v3/klines
    let obj = {
        symbol : symbol,
        interval : interval
    };

    const data = await bina.getData('api/v3/klines', obj);
    console.log(data);

    fs.saveDataToFile({
        folder : 'klines',
        filename : `${symbol}_${interval}.txt`,
        data : data
    }).then( response => {
        console.log( response );
    });
}


async function retrieveKlinesFromBinance(symbol, interval){
    let obj = {
        symbol : symbol,
        interval : interval
    };

    const data = await bina.getData('api/v3/klines', obj);
    //console.log(data);
    return prepareData(data);

    /*
    let dataKline = [];
    let dataVolumes = [];
    data.forEach( kline => {
        dataKline.push({
            //time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72
            time : timeToLocal(kline[0] / 1000),
            open : kline[1],
            high : kline[2],
            low : kline[3],
            close : kline[4],
        });

        dataVolumes.push({
            time : timeToLocal(kline[0] / 1000),
            value : kline[5],
        });
    });
    return {
        klines : dataKline,
        volumes : dataVolumes
    };
    */
}


function prepareData(data){
    let dataKline = [];
    let dataVolumes = [];
    data.forEach( kline => {
        const sign = (kline[4]>kline[1]) ? 'negative' : 'positive';
        dataKline.push({
            //time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72
            time : timeToLocal(kline[0] / 1000),
            open : kline[1],
            high : kline[2],
            low : kline[3],
            close : kline[4],
        });

        dataVolumes.push({
            time : timeToLocal(kline[0] / 1000),
            value : kline[5],
            color : (sign == 'negative') ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255,82,82, 0.8)',
        });
    });
    return {
        klines : dataKline,
        volumes : dataVolumes
    };
}



function depth(symbol){
    //https://api.binance.com/api/v3/depth?symbol=BTCUSDT
    
}

function readKlines(symbol, interval){
    return fs.readDataFromFile({
        folder : 'klines',
        filename : `${symbol}_${interval}.txt`,
    }).then( response => {
        if(response.success){
            return response.data;
        }else{
            console.log(response.error);
            return false;
        }
    });
}

function timeToLocal(originalTime) {
    const d = new Date(originalTime * 1000);
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
}

async function convertKlines(symbol, interval){
    const data = await readKlines(symbol, interval);
    console.log(data);

    let dataKline = [];
    let dataVolumes = [];
    let dataLines = [];
    data.forEach( kline => {
        dataKline.push({
            //time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72
            time : timeToLocal(kline[0] / 1000),
            open : kline[1],
            high : kline[2],
            low : kline[3],
            close : kline[4],
        });

        dataVolumes.push({
            time : timeToLocal(kline[0] / 1000),
            value : kline[5],
        });

        dataLines.push({
            time : timeToLocal(kline[0] / 1000),
            value : kline[4],
        });
    });
    return {
        klines : dataKline,
        volumes : dataVolumes,
        lines : dataLines
    };
}

function prepareDataForKline(data){
    let dd = new Date(data['E']);

    let roundTS = (data['E'] - ( Number(dd.getSeconds())*1000 + Number(dd.getMilliseconds()) )) / 1000;
    //console.log('roundTS', roundTS);

    const sign = (data['k']['c']>data['k']['o']) ? 'negative' : 'positive';

    return {
        dataKline : {
            time: timeToLocal(roundTS),
            open: data['k']['o'],
            high: data['k']['h'],
            low: data['k']['l'],
            close: data['k']['c'] 
        },
        dataVolumes : {
            time: timeToLocal(roundTS),
            value: data['k']['v'],
            color : (sign == 'negative') ? 'rgba(0, 150, 136, 0.8)' : 'rgba(255,82,82, 0.8)',
        },
    }
}

bina.getData = getData;
bina.klines = klines;
bina.convertKlines = convertKlines;
bina.retrieveKlinesFromBinance = retrieveKlinesFromBinance;
bina.prepareDataForKline = prepareDataForKline;

window.bina = bina;
})();