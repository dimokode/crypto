;(function(){

function historical(){}

async function show(){
    const html = await template.loadRawTemplateFromFile('history.html');
    // https://stackoverflow.com/questions/12446317/change-url-without-redirecting-using-javascript
    // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    // window.history.pushState('', '', 'historical');
    $('content').html(html);
}

function getHistoryDataFile(symbol, timeframe){
   return fs.readDataFromFile({
        folder: `history/${symbol}`,
        filename: `${symbol}_${timeframe}.txt`,
    }).then(response => {
        if(response.success){
            return response.data;
        }else{
            console.log(response.error);
        }
    });
}


// function getHistoricalDataForSymbol(symbol, timeframe = '1d'){
//     console.log(`getHistoricalDataForSymbol for ${symbol}`);
//     common.sendAjax({
//         controller: 'history',
//         action: 'getHistoricalDataForSymbol',
//         symbol,
//         timeframe
//     }).then( async response => {
//         console.log(response);
//         if(response.success){
//             const saveResult = await fs.saveDataToFile({
//                 folder: `history/${symbol}`,
//                 filename: `${symbol}_${timeframe}.txt`,
//                 data: response.data
//             });
//             if(saveResult.success){
//                 console.log(`Histrorical data for ${symbol} has been successfully saved!`);
//             }else{
//                 console.error(saveResult.error);
//             }
//         }else{
//             console.error(response.error);
//         }
//     });
// }


function saveDataToFile(folder, filename, data){
    fs.saveDataToFile({
        folder,
        filename,
        data
    }).then( response => {
        if(response.success){
            console.log(`Histrorical data has been successfully saved into ${filename}!`);
            return true;
        }else{
            console.error(response.error);
            return false;
        }
    });

}

// todo - rename this function
async function getHistoricalDataForSymbol(symbol, timeframe = '1d', startTime=1502928000000){
    let stop = false;
    let counter = 0;
    const folder = `history/${symbol}`;
    // startTime = Date.now();

    let tss, _startTime, _endTime, filename;
    let data = {};
    let cumData = {};

    while(!stop){
    // for(let i=0; i<2; i++){
        counter++;
        data = await downloadHistoricalDataForSymbol(symbol, timeframe = '1d', startTime);
        console.log(data);
        if(data && !isObjectEmpty(data)){
            Object.assign(cumData, data);
            tss = Object.keys(data);
            _startTime = tss.min();
            _endTime = tss.max();
            startTime = _endTime;
            console.log(counter, _startTime, _endTime);
            if(_startTime == _endTime){
                console.log('all data downloaded / stop trigger activated');
                stop = true;
                break;
            }

            filename =`${symbol}_${timeframe}_${_startTime}_${_endTime}.txt`;
            await saveDataToFile(folder, filename, data);

        }else{
            // stop = true;
            console.log('data is empty / stop trigger activated');
            stop = true;
            break;
        }

        if(counter == 5){
            stop = true;
            console.log('stop trigger activated');
            break;
        }
    }
    // }

    if(!isObjectEmpty(cumData)){
        let filename =`${symbol}_${timeframe}.txt`;
        saveDataToFile(folder, filename, cumData);
    }


}

function downloadHistoricalDataForSymbol(symbol, timeframe = '1d', startTime){
    return common.sendAjax({
        controller: 'history',
        action: 'getHistoricalDataForSymbol',
        symbol,
        timeframe,
        startTime
    }).then( response => {
        console.log(response);
        if(response.success){
            return response.data;
        }else{
            console.error(response.error);
            return false;
        }
    });
}

function getTimeStampForEndOfTheDay(timestamp, timeOffsets = [2, 3]){
    const exchangeTimezoneOffset = config['exchange']['timezoneOffset'];
    const localTimezoneOffset = getTimezoneOffset();
    const timezoneOffset = localTimezoneOffset - exchangeTimezoneOffset;
    let d = new Date(timestamp);
    console.log(d);
    // let d2 = new Date(d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours() + timezoneOffset);
    // let d2 = new Date(d.getFullYear(), d.getMonth()+1, d.getDate(), 3);
    const result = timeOffsets.map( timeOffset => {
        // return new Date(d.getFullYear(), d.getMonth()+1, d.getDate(), timeOffset).getTime();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), timeOffset).getTime();
    });
    // return d2.getTime();
    return result;
}

function testGetTimeStampForEndOfTheDay(timestamp){
    console.log(timestamp, convertTimestampToDatetime(timestamp));
    tss = getTimeStampForEndOfTheDay(timestamp)
    console.log(tss);
    dts = tss.map(item => {
        return convertTimestampToDatetime(item)
    })
    console.log(dts);
}

function getTimezoneOffset(){
    return (new Date().getTimezoneOffset())/60 * -1;
}


function getPriceForTimestamp(tss, data){
    return data[tss[0]] != undefined ? data[tss[0]] : data[tss[1]];
}

function getHistoricalDataBySymbol(symbol, timeframe){
    return fs.readDataFromFile({
        folder: `history/${symbol}`,
        filename: `${symbol}_${timeframe}.txt`,
    }).then( response => {
        if(response.success){
            return response.data;
        }else{
            console.error(response.error);
            return false;
        }
    });
}


async function getPriceForTime(symbol, ts, timeframe='1d'){
    console.log(ts, convertTimestampToDatetime(ts));
    const data = await getHistoricalDataBySymbol(symbol, timeframe);

    if(data){
        // console.log(data);
        // for(let dd in data){
        //     console.log(convertTimestampToDatetime(Number(dd)));
        // }
        // tss = convertTimestampToDatetime(ts);
        // const tz_off = getTimezoneOffset();
        // console.log(tz_off);
        let tss = getTimeStampForEndOfTheDay(ts);
        console.log(tss);
        let price = getPriceForTimestamp(tss, data);
        // console.log(price);
        // console.log(ts, convertTimestampToDatetime(ts), d, convertTimestampToDatetime(d));
        // console.log(d, convertTimestampToDatetime(d), data[d], data[String(d)]);
        console.log(price['close']);
        return price['close'];

    }
}


// async function getPriceForTime(symbol, ts, timeframe='1d'){
//     console.log(ts);
//     const readResult = await fs.readDataFromFile({
//         folder: `history/${symbol}`,
//         filename: `${symbol}_${timeframe}.txt`,
//     });

//     if(readResult.success){
//         const data = readResult.data;
//         console.log(data);
//         // for(let dd in data){
//         //     console.log(convertTimestampToDatetime(Number(dd)));
//         // }
//         // tss = convertTimestampToDatetime(ts);
//         const tz_off = getTimezoneOffset();
//         console.log(tz_off);
//         let tss = getTimeStampForEndOfTheDay(ts);
//         console.log(tss);
//         let price = getPriceForTimestamp(tss, data);
//         // console.log(price);
//         // console.log(ts, convertTimestampToDatetime(ts), d, convertTimestampToDatetime(d));
//         // console.log(d, convertTimestampToDatetime(d), data[d], data[String(d)]);
//         console.log(price['close']);
//         return price['close'];

//     }else{
//         console.error(readResult.error);
//     }
// }


function getDateSpan(symbol, timeframe){
    getHistoryDataFile(symbol, timeframe).then(data => {
        // console.log(data);
        const tss = Object.keys(data).map(item => {
            return item;
        });
        const ts_min = tss.min();
        const dt_min = convertTimestampToDatetime(ts_min);
        const ts_max = tss.max();
        const dt_max = convertTimestampToDatetime(ts_max);
        // console.log(tss, tss.min(), tss.max());
        console.table(ts_min, dt_min, ts_max, dt_max);
    });
}

function getServerTime(){
    common.sendAjax({
        controller: 'history',
        action: 'getServerTime'
    }).then( response => {
        console.log(response);
        if(response.success){
            console.log(response.server_time, convertTimestampToDatetime(response.server_time));
            // return response.server_time;
        }else{
            console.error(response.error);
            return false;
        }
    });
}

function test(){
    const symbol = 'BTCUSDT';
    const timeframe = '1d';

    fs.readDataFromFile({
        folder: `history/${symbol}`,
        filename: `${symbol}_${timeframe}.txt`,
    }).then( response => {
        if(response.success){
            const data = response.data;
            console.log(data);
            const tss = Object.keys(data).map(item => {
                return convertTimestampToDatetime(item);
            });
            console.log(tss);
        }else{
            console.error(response.error);
        }
    })
}

historical.show = show;
historical.getHistoricalDataForSymbol = getHistoricalDataForSymbol;
historical.getTimeStampForEndOfTheDay = getTimeStampForEndOfTheDay;
historical.getPriceForTime = getPriceForTime;
historical.getDateSpan = getDateSpan;
historical.testGetTimeStampForEndOfTheDay = testGetTimeStampForEndOfTheDay;
historical.getServerTime = getServerTime;
historical.test = test;
window.historical = historical;
})();