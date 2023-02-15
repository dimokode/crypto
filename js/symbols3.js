;(function(){
    function Symbols3(){}

    async function show() {

        const html = await template.loadRawTemplateFromFile('deposit.html');
        //console.log(response);

        $('content').html(html);

        
        const tableFrameworkElement = createTable();
        document.querySelector('content-main').innerHTML = '';
        document.querySelector('content-main').appendChild( tableFrameworkElement );

        let dataBalancesHistory = await getBalances();
        console.log('dataBalancesHistory', dataBalancesHistory);
        
        let dataPrices = await getPrices();
        console.log('dataPrices', dataPrices);



        let preparedBalances = prepareBalances(dataBalancesHistory),
            dataBalances = preparedBalances['dataBalances'],
            dataFiat = preparedBalances['dataFiat'];
        

        console.log('dataBalances', dataBalances);
        console.log('dataFiat', dataFiat);

        for(let assetId in dataBalances){
            //console.log(assetId+'USDT', dataPrices[assetId+'USDT'])
            let assetObj = {
                symbol : assetId,
                //price : dataPrices['actual']['data'][assetId+'USDT']
                price : {
                    actual : (dataPrices['actual']['data'][assetId+'USDT'] !== undefined) ? dataPrices['actual']['data'][assetId+'USDT'] : "0",
                    //previous : "0",
                    //previous : (dataPrices['previous']['data'][assetId+'USDT'] !== undefined) ? dataPrices['previous']['data'][assetId+'USDT'] : "0",
                    //previos : (dataPrices['previous'] !== undefined) ? "1" : "0",
                }
            }

            if(dataPrices['previous'] !== undefined){
                assetObj['price']['previous'] = (dataPrices['previous']['data'][assetId+'USDT'] !== undefined) ? dataPrices['previous']['data'][assetId+'USDT'] : "0";
            }else{
                assetObj['price']['previous'] = '0';
            }

            assetObj = Object.assign(assetObj, dataBalances[assetId]);
            //console.log(assetObj)
            tableto.addRow('tableBalance', assetObj);
            await calculateRow('tableBalance', assetId);
        }

        //tableto.setTableId = 'tableBalance';
        //let arr = tableto.sort('amount');
        tableto.sort('tableBalance', 'amount');
        //console.log(arr);

        let totalAmount = summarize('tableBalance', 'amount');
        let actualBalance = summarize('tableBalance', 'actualBalance');
        let usdtBalance = summarize('tableBalance', 'usdtBalance');
        $('totalAmount').html(totalAmount.toFixed(2));
        $('actualBalance').html(actualBalance.toFixed(2));
        $('usdtBalance').html(usdtBalance.toFixed(2));

    }



    function prepareBalances( dataBalancesHistory ){
        let dataBalance = {};

        for(let asset in dataBalancesHistory['actual']['data']){

            let dataAsset = {
                'available' : {},
                'onOrder' : {}
            }

            dataAsset['available']['actual'] = dataBalancesHistory['actual']['data'][asset]['available'];
            dataAsset['onOrder']['actual'] = dataBalancesHistory['actual']['data'][asset]['onOrder'];

            if(dataBalancesHistory['previous'] !== undefined){
                if(dataBalancesHistory['previous']['data'][asset] !== undefined){
                    dataAsset['available']['previous'] = dataBalancesHistory['previous']['data'][asset]['available'];
                    dataAsset['onOrder']['previous'] = dataBalancesHistory['previous']['data'][asset]['onOrder'];
                }else{
                    dataAsset['available']['previous'] = "0";
                    dataAsset['onOrder']['previous'] = "0";
                }
            }else{
                dataAsset['available']['previous'] = "0";
                dataAsset['onOrder']['previous'] = "0";
            }
            dataBalance[asset] = dataAsset;
        }

        console.log('dataBalance', dataBalance);
        
        //remove assets with zero balance and UAH ans USDT assets
        filteredBalances = filterBalances(dataBalance);
        return filteredBalances;
    }


    function summarize(tableId, field){
        let rowIds = tableto.getRowIdsArrayFromTable(tableId);
        //console.log(rowIds)
        let totalAmount = 0.0;
        rowIds.forEach( rowId => {
            //console.log(assetId)
            let value = tableto.td(tableId, rowId, field).getData('value');
            totalAmount = totalAmount + Number(value)

        })
        return totalAmount;
        console.log('END')
    }






    function filterBalances(dataBalances){
        let dataFiat = {}
        //remove assets with zero balance and UAH ans USDT assets
        for(let assetId in dataBalances){
            //console.log(item);
            /*
            if(dataBalances[assetId]['available']['actual'] == 0 
                && dataBalances[assetId]['available']['previous'] == 0
                    && dataBalances[assetId]['onOrder']['actual'] == 0
                        && dataBalances[assetId]['onOrder']['previous'] == 0){
                */

            if(Number(dataBalances[assetId]['available']['actual']) == 0 && Number(dataBalances[assetId]['onOrder']['actual']) == 0){
                
                if(Number(dataBalances[assetId]['available']['previous']) !== undefined && Number(dataBalances[assetId]['onOrder']['previous']) !== undefined){
                    if(Number(dataBalances[assetId]['available']['previous']) == 0 && Number(dataBalances[assetId]['onOrder']['previous']) == 0){
                        delete(dataBalances[assetId])
                    }
                }else{
                    delete(dataBalances[assetId])
                }

            }else if(assetId=='USDT' || assetId=='UAH'){
                dataFiat[assetId] = dataBalances[assetId]
                delete(dataBalances[assetId])
            }
        }

        return {
            dataBalances : dataBalances,
            dataFiat : dataFiat
        }
    }



    function updateBalances(){
        $('#waitAMinute').show();
        common.sendAjax({
            controller : 'Symbols3',
            action : 'retrieveBalancesFromBinance'
        }).then( response => {
            $('#waitAMinute').hide();
            console.log(response)    
        })
    }



    function updatePrices(){
        $('#waitAMinute').show();
        common.sendAjax({
            controller : 'Symbols3',
            action : 'retrievePricesFromBinance'
        }).then( response => {
            $('#waitAMinute').hide();
            console.log(response)
        })
    }


    function exchangeInfo(){
        $('#waitAMinute').show();
        common.sendAjax({
            controller : 'Symbols3',
            action : 'retrieveExchangeInfoFromBinance'
        }).then( response => {
            $('#waitAMinute').hide();
            console.log(response)
        })
    }


    function createTable() {
        const structure = {
            cb :{
                name : 'cb',
                type : 'checkbox'
            },
            nr : 
            {
                name : 'nr',
                type : 'increment',
                count : 0
            },
            symbol : 
            {
                name : 'symbol',
                type : 'text',
                trId : true,
            },
            available : {
                name : 'available',
                type : 'text',
                sortable : true,
            },
            onOrder : {
                name : 'onOrder',
                type : 'text',
                sortable : true,
            },
            price : {
                name : 'price',
                type : 'float',
                sortable : true,
                template : `<span class="oldPrice">{%price%}</span>`
            },
            averageBuyerPrice : {
                name : 'averageBuyerPrice',
                type : 'text',
            },
            usdtBalance : {
                name : 'usdtBalance',
                type : 'text',
                sortable : true,
                colorize : {
                    positive : 'w3-pale-green',
                    negative : 'w3-pale-red'
                },
                //colored : true
            },

            actualBalance : {
                name : 'actualBalance',
                type : 'text',
                sortable : true,
                colorize : {
                    positive : 'w3-pale-green',
                    negative : 'w3-pale-red'
                },
            },

            
            amount : {
                name : 'amount',
                type : 'text',
                sortable : true,
            },
        }

        const rowButtons = {
            //'deleteRow' : `<button class="w3-button w3-text-red" onclick="tableto.deleteRow(this);">x</button>`,
            'showOrdersByPair' : `<button class="w3-button w3-blue" onclick="Symbols3.showOrdersByPair(this);">$</button>`,
            'showSymbolInfo' : `<button class="w3-button w3-green" onclick="btn.showSymbolInfo(this);">i</button>`,
            //'updateRow' : `<button class="w3-button w3-green" name="btnUpdateRow" onclick="Symbols3.updateRow(this);">U</button>`,
            'updateOrders' : `<button class="w3-button w3-blue" onclick="Symbols3.btnUpdateOrdersForPair(this);">Order</button>`,
        }

        return tableto.createTable('tableBalance', structure, rowButtons);
    }

    function btnUpdateOrdersForPair(el){
        let tableId = tableto.getTableIdByTdElement(el);
        let symbol = rowId = tableto.getRowIdByTdElement(el);
        //const pair = symbol + 'USDT';
        stablecoins.forEach((stablecoin) => {
            let pair = symbol+stablecoin;
            updateOrdersForPair(tableId, rowId, pair);  
        });
        //updateOrdersForPair(tableId, rowId, pair);

    }

    function updateOrdersForPair(tableId, rowId, pair){
        let objTableStyle = {
            symbol : {
                class : 'w3-pale-yellow'
            }
        }
        tableto.updateTableStyle(tableId, rowId, objTableStyle)

        retrieveOrdersFromBinanceForPair(pair).then( objOrders => {
            if(objOrders){
                //console.log(objOrders)
                objTableStyle = {
                    symbol : {
                        class : 'w3-pale-green'
                    }
                }
            }else{
                /*
                objTableStyle = {
                    symbol : {
                        class : 'w3-pale-red'
                    }
                }
                */
            }
            tableto.updateTableStyle(tableId, rowId, objTableStyle)
            
        })
    }

    function retrieveOrdersFromBinanceForPair(pair){
        const objRequest = {
            controller : 'Symbols3',
            action : 'retrieveOrdersFromBinanceForPair',
            pair : pair
        }

        return common.sendAjax(objRequest).then( response => {
            if(response.success){
                return response.data;
            }else{
                console.log(response.error);
                return false;
            }
        });
    }



    function retrieveOpenOrdersFromBinanceForPair(pair){
        const objRequest = {
            controller : 'Symbols3',
            action : 'retrieveOpenOrdersFromBinanceForPair',
            pair : pair
        }

        return common.sendAjax(objRequest).then( response => {
            if(response.success){
                return response.data;
            }else{
                console.log(response.error);
                return false;
            }
        });
    }


    //btnClick U
    async function updateRow(el){
        //console.log('element', el)
        let tableId = tableto.getTableIdByTdElement(el);
        
        //let symbol = tableto.getRowIdByTdElement(el);
        let rowId = tableto.getRowIdByTdElement(el);
        //let price = tableto.getTdValue(tableId, rowId, 'price');
        //let available = tableto.getTdValue(tableId, rowId, 'available');
        let response = await calculateRow(tableId, rowId);
        console.log('response', response)

    }



    function showOrdersForPair(pair){
        common.sendAjax({
            controller : 'Symbols3',
            action : 'getOrdersByPair',
            pair : pair
        }).then(response=>{
            let sum = 0;
            if(response.success){
                const data = response.data;
                data.forEach(item => {
                    //console.log(item)
                    sum = sum + Number(item.quoteQty)
                })

                console.log(sum)
            }else{
                console.log(response.error)
            }
            //console.log(response)
        })
    }


    function getOrdersByPair(pair){
        return common.sendAjax({
            controller : 'Symbols3',
            action : 'getOrdersByPair',
            pair : pair
        }).then(response=>{
            console.log(response);
            if(response.success){
                return response.data;
            }else{
                console.log(response.error)
                return false;
            }
            //console.log(response)
        })
    }


    function getOpenOrdersByPair(pair){
        return common.sendAjax({
            controller : 'Symbols3',
            action : 'getOpenOrdersByPair',
            pair : pair
        }).then(response=>{
            console.log(response);
            if(response.success){
                return response.data;
            }else{
                console.log(response.error)
                return false;
            }
            //console.log(response)
        })
    }


    /*
    function priceToShow(price){
        price = Number(price)
        if(Math.abs(price)>1 || Math.abs(price)<0.9){
            return price.toFixed(3)
        }else if(Math.abs(price)<0.099){
            return price.toFixed(4)
        }else if(Math.abs(price)<0.0001){
            return price.toFixed(6)
        }else if(Math.abs(price)<0.000001){
            return price.toFixed(8)
        }else{
            return price
        }
    }
    */

    function priceToShow(price){
        //console.log(price)
        price = Number(price);
        let digitsAfterPoint = detectDigitsAfterPoint(Math.abs(price))
        return price.toFixed(digitsAfterPoint);
    }


    function detectDigitsAfterPoint(price, dig = 2){
        
        price = Number(price)
        if(price == 0) return 0
        if(price >= 10) return dig
        
        //console.log(price-1)
        if(((price-1) >= 0)){
            //console.log(price, dig)
            return dig+1
        }else{
            return detectDigitsAfterPoint(price*10, dig+1);
        }
    }


    function valueDif(actual, previous){
        actual = Number(actual)
        previous = Number(previous)
        value = actual-previous
        return priceToShow(value);
    }

    function calculatePriceRelativeDifference(priceDifAbs, pricePrevious){
        if(priceDifAbs == 0 || pricePrevious == 0){
            return 0
        }else{
            return priceDifAbs/(pricePrevious/100);
        }
    }


    async function calculateRow(tableId, rowId){
        //console.log('tableId', tableId)
        tableto.setTableId(tableId);
        let price = tableto.td(tableId, rowId, 'price').getData('actual');
        //console.log('price', price)
        let pricePrevious = Number(tableto.td(tableId, rowId, 'price').getData('previous'));
        //console.log('pricePrevious', pricePrevious)
        let priceDifAbs = valueDif(price, pricePrevious);

        let priceDifRel = calculatePriceRelativeDifference(priceDifAbs, pricePrevious);

        //console.log('priceDifRel', priceDifRel)
        let htmlpriceDifRel = tableto.colorizeNumber(priceToShow(priceDifRel)) + '%';
        tableto.td(tableId, rowId, 'price').setData('value', priceDifRel);

        let available = tableto.td(tableId, rowId, 'available').getData('actual')
        let onOrder = tableto.td(tableId, rowId, 'onOrder').getData('actual')
        tableto.td(tableId, rowId, 'onOrder').setData('value', onOrder);

        //tableto.setTdContent(rowId, 'price', priceToShow(price)+'<br>'+ `<span class="w3-text-grey">`+priceToShow(pricePrevious)+`</span>`)
        tableto.setTdContent(rowId, 'price', priceToShow(price)+` (${htmlpriceDifRel})`+'<br>' + tableto.colorizeNumber(priceDifAbs) +'<br>'+`<span class="w3-text-grey">`+priceToShow(pricePrevious)+`</span>`)
        //tableto.setTdContent(rowId, 'price', price+'<br>'+`<span class="w3-text-grey">`+priceToShow(price)+`</span>`)
        tableto.setTdContent(rowId, 'available', available)
        tableto.setTdContent(rowId, 'onOrder', onOrder)
        //console.log(tableto.td(tableId, rowId, 'price').getData('actual'));


        let objAnalitica = {
            price : price,
            available : available,
            onOrder : onOrder,
            //orders : response['data']
            orders : await orders.getOrdersBySymbol(rowId)
        }

        rowData = Symbols3.analitica(objAnalitica)
        tableto.updateRow(tableId, rowId, rowData)

        const objTableStyle = {
            symbol : {
                class : 'w3-green'
            }
        }
        tableto.updateTableStyle(tableId, rowId, objTableStyle)

    }






    function getBalances(){
        const balancesRequestObj = {
            controller : 'Symbols3',
            action : 'getBalances',
        }
    
        return common.sendAjax(balancesRequestObj).then(function(response){
            console.log(response);
            
                if(response['success']){
                    return response['data'];
                }else{
                    throw new Error(response['error']);
                }     
            }).catch( err => console.error(err));
    }

    function getPrices(){
        const pricesRequestObj = {
            controller : 'symbols3',
            action : 'getPrices',
        }
    
        return common.sendAjax(pricesRequestObj).then(function(response){
                if(response['success']){
                    return response['data'];
                }else{
                    throw new Error(response['error']);
                }
            }).catch( err => console.error(err));
    }




    async function showOrdersByPair(el){
        let tableId = tableto.getTableIdByTdElement(el);
        let symbol = rowId = tableto.getRowIdByTdElement(el);
        //let price = tableto.getTdContent(tableId, rowId, 'price');
        let price = tableto.td(tableId, rowId, 'price').getData('actual');
        let available = tableto.getTdContent(tableId, rowId, 'available');
        let onOrder = tableto.getTdContent(tableId, rowId, 'onOrder');
        //console.log('price:' + price);


        let arrOrders = await orders.getOrdersBySymbol(symbol);
        //console.log(arrOrders);
        //return;

        let objAnalitica = {
            symbol : symbol,
            price : price,
            available : available,
            onOrder : onOrder
        }
        //console.log(objAnalitica)
        const popupId = popup.new();
        popup.show(popupId);

        let htmlPopup = await template.loadRawTemplateFromFile('popup2.html');
            //console.log('answer:' + answer);
            if(htmlPopup){
                popup.addContent(popupId, htmlPopup);

                    objAnalitica['orders'] = arrOrders;
                    //console.log(orders);
                    const structure = {
                        cb :{
                            name : 'cb',
                            type : 'checkbox'
                        },
                        nr : 
                        {
                            name : 'nr',
                            type : 'increment',
                            count : 0
                        },
                        id :
                        {
                            name : 'id',
                            type : 'text',
                            trId : true
                        },
                        time : {
                            name : 'time',
                            type : 'datetime',
                            sortable : true,
                        },
                        symbol :
                        {
                            name : 'symbol',
                            type : 'text',
                        },
                        qty : {
                            name : 'qty',
                            type : 'text',
                        },
                        price : {
                            name : 'price',
                            type : 'text',
                        },
                        commission : {
                            name : 'commission',
                            type : 'text',
                        },
                        commissionAsset : {
                            name : 'commissionAsset',
                            type : 'text',
                        },
                        quoteQty : {
                            name : 'quoteQty',
                            type : 'text',
                        },
                        isBuyer : {
                            name : 'isBuyer',
                            type : 'text',
                        },
                    }
    
                    let tableContent = tableto.createTable('tableOrders', structure);
                    $('#popup-content').html(tableContent);
                       
                    let objBalance = Symbols3.analitica(objAnalitica, (order)=>{
                        tableto.addRow('tableOrders', order);
                        //console.log(order);
                    });



                    $('#popup-header').find('div[name="symbol"]>span').html(symbol);
                    for(let prop in objBalance){
                        //$('#popup-header').find('div[name="'+prop+'"]>span').html(objBalance[prop].toFixed(5)); 
                        //console.log(prop, objBalance[prop], typeof objBalance[prop])
                        $('#popup-header').find('div[name="'+prop+'"]>span').html(objBalance[prop]);
                    }

                    tableto.colorizeRows({
                        tableId : 'tableOrders',
                        field : {
                            name : 'isBuyer',
                            conditions : {
                                 'true': 'w3-pale-green',
                                 'false': 'w3-pale-red'
                            }
                        }
                    });
                    tableto.sort('tableOrders', 'time');



                //});
                return

                common.sendAjax(obj).then(function(responseOrders){
                    //console.log(responseOrders);
                    let orders = responseOrders['data'];
                    objAnalitica['orders'] = orders;
                    //console.log(orders);
                    const structure = {
                        cb :{
                            name : 'cb',
                            type : 'checkbox'
                        },
                        nr : 
                        {
                            name : 'nr',
                            type : 'increment',
                            count : 0
                        },
                        id :
                        {
                            name : 'id',
                            type : 'text',
                            trId : true
                        },
                        time : {
                            name : 'time',
                            type : 'datetime',
                            sortable : true,
                        },
                        symbol :
                        {
                            name : 'symbol',
                            type : 'text',
                        },
                        qty : {
                            name : 'qty',
                            type : 'text',
                        },
                        price : {
                            name : 'price',
                            type : 'text',
                        },
                        commission : {
                            name : 'commission',
                            type : 'text',
                        },
                        commissionAsset : {
                            name : 'commissionAsset',
                            type : 'text',
                        },
                        quoteQty : {
                            name : 'quoteQty',
                            type : 'text',
                        },
                        isBuyer : {
                            name : 'isBuyer',
                            type : 'text',
                        },
                    }
    
                    let tableContent = tableto.createTable('tableOrders', structure);
                    $('#popup-content').html(tableContent);
                       
                    let objBalance = Symbols3.analitica(objAnalitica, (order)=>{
                        tableto.addRow('tableOrders', order);
                        //console.log(order);
                    });



                    $('#popup-header').find('div[name="symbol"]>span').html(symbol);
                    for(let prop in objBalance){
                        //$('#popup-header').find('div[name="'+prop+'"]>span').html(objBalance[prop].toFixed(5)); 
                        //console.log(prop, objBalance[prop], typeof objBalance[prop])
                        $('#popup-header').find('div[name="'+prop+'"]>span').html(objBalance[prop]);
                    }

                    tableto.colorizeRows({
                        tableId : 'tableOrders',
                        field : {
                            name : 'isBuyer',
                            conditions : {
                                 'true': 'w3-pale-green',
                                 'false': 'w3-pale-red'
                            }
                        }
                    });
                    tableto.sort('tableOrders', 'time');
                    
                });
            }

    }



    function analitica(objAnalitica, cb = null){
        //console.log(objAnalitica)
        if(cb){
            //console.log('cb function is not null');
        }else{
            //console.log('cb function is null')
        }
        //let symbol = objAnalitica.symbol;
        let price = Number(objAnalitica.price);
        let available = Number(objAnalitica.available);
        let onOrder = Number(objAnalitica.onOrder);
        let orders = objAnalitica.orders;
        let objBalance = {
            //balance : 0,
            //symbol : symbol,
            available : available,
            onOrder : onOrder,
            buyed : 0,
            sold :0,
            usdtAmountBuy : 0,
            usdtAmountSell : 0,
            usdtBalance : 0,
            averageBuyerPrice : 0,
            averageSellerPrice : 0,
            actualAmount : 0,
            actualPrice : price,
            margin : 0,
            averagePrice : 0,
            actualBalance : 0
        };
        //console.log(objBalance);

        let buyed = 0, sold = 0;
        let sumBuyedQuote = 0, sumSoldQuote = 0;
        //let quoteQty = 0; //amount in USDT
        for(let item in orders){
            let order = orders[item];
            //console.log(order);
            if(cb){
                cb(order)
            }
            
            if(order['isBuyer']){
                buyed+=Number(order['qty']);
                objBalance.usdtAmountBuy+=Number(order['quoteQty']);
                sumBuyedQuote+=Number(order['quoteQty']);
            }else{
                sold+=Number(order['qty']);
                objBalance.usdtAmountSell+=Number(order['quoteQty']);
                sumSoldQuote+=Number(order['quoteQty']);
            }
        }

        objBalance.averageBuyerPrice = sumBuyedQuote / buyed;

        objBalance.amount = (available + onOrder) * price;

        objBalance.averageSellerPrice = (sumSoldQuote > 0) ? (sumSoldQuote / sold) : 0;
        objBalance.tradeBalance = buyed - sold;
        //objBalance.available = available;
        objBalance.buyed = buyed;
        objBalance.sold = sold;
        objBalance.actualAmount = (objBalance.available + objBalance.onOrder) * price;
        objBalance.usdtBalance = objBalance.usdtAmountSell - objBalance.usdtAmountBuy;

        if(objBalance.usdtBalance > 0) {
            objBalance.averagePrice = objBalance.averageBuyerPrice;
            objBalance.margin = objBalance.actualAmount + objBalance.usdtBalance;
        }else{
            objBalance.averagePrice = Math.abs(objBalance.usdtBalance) / (objBalance.available + objBalance.onOrder);
            objBalance.margin = objBalance.actualAmount - Math.abs(objBalance.usdtBalance);
        }
        objBalance.actualBalance = objBalance.amount + objBalance.usdtBalance


        if(objBalance.averageBuyerPrice > 1){
            objBalance.averageBuyerPrice = objBalance.averageBuyerPrice.toFixed(2)
        }else if(objBalance.averageBuyerPrice < 1 && objBalance.averageBuyerPrice > 0.01){
            objBalance.averageBuyerPrice = objBalance.averageBuyerPrice.toFixed(4)
        }else if(objBalance.averageBuyerPrice > 0.01 && objBalance.averageBuyerPrice > 0.0001){
            objBalance.averageBuyerPrice = objBalance.averageBuyerPrice.toFixed(8)
        }

        if(objBalance.amount > 0){
            objBalance.amount = objBalance.amount.toFixed(2)
        }

        return objBalance
    }


    //update Orders for all symbols
    function updateOrders(){
        console.log('update orders')

        let tableId = tableto.tableId;
        //let symbol = rowId = tableto.getRowIdByTdElement(el);
        let arrRowIds = tableto.getRowIdsArrayFromTable('tableBalance')
        //console.log(arrRowIds)
        arrRowIds.forEach( symbol => {
            //console.log(rowId)


            stablecoins.forEach((stablecoin) => {
                let pair = symbol+stablecoin;
                updateOrdersForPair(tableId, symbol, pair);  
            });

            //const pair = rowId+'USDT';
            //console.log(pair)
            //updateOrdersForPair('tableBalance', rowId, pair);

        })
    }

    function showSymbolInfo(assetId){
        console.log('showSymbolInfo');
        const popupId = popup.new();
        popup.show(popupId);

        template.loadRawTemplateByName('symbolinfo.html').then(content => {
            if(content){
                //console.log(content);
                content = template.generateByTemplate({
                    tpl : content,
                    tags : {
                        symbol : assetId,
                    }
                });
                //console.log(content)
                popup.addContent(popupId, content);

            }
            
        });
    }



    function showMarket(){
        const popup = new Popup();
        popup.show();

        template.loadRawTemplateByName('market.html').then(content => {
            if(content){
                /*
                content = template.generateByTemplate({
                    tpl : content,
                    tags : {
                        symbol : assetId,
                    }
                });
                */
                popup.addContent(content); 
            }
        });
    }

    function getExchangePairsBySymbol(symbol){
        return common.sendAjax({
            controller : 'Symbols3',
            action : 'getPairsForSymbol',
            symbol : symbol
        }).then( response => {
            if(response.success){
                return response.data; 
            }else{
                console.log(response.error);
                return false;
            }
        });

        //console.log(arrPairsForSymbol);
    }


    Symbols3.show = show;
    Symbols3.createTable = createTable;
    Symbols3.getBalances = getBalances;
    Symbols3.getPrices = getPrices;
    Symbols3.showOrdersByPair = showOrdersByPair;
    Symbols3.updateRow = updateRow;
    Symbols3.analitica = analitica;
    Symbols3.updateOrders = updateOrders;
    Symbols3.exchangeInfo = exchangeInfo;
    Symbols3.btnUpdateOrdersForPair = btnUpdateOrdersForPair;
    Symbols3.updateOrdersForPair = updateOrdersForPair;
    Symbols3.updateBalances = updateBalances;
    Symbols3.updatePrices = updatePrices;
    Symbols3.showOrdersForPair = showOrdersForPair;

    Symbols3.getOrdersByPair = getOrdersByPair;
    Symbols3.getOpenOrdersByPair = getOpenOrdersByPair;


    Symbols3.showSymbolInfo = showSymbolInfo;
    Symbols3.showMarket = showMarket;
    Symbols3.prepareBalances = prepareBalances;
    Symbols3.getExchangePairsBySymbol = getExchangePairsBySymbol;
    Symbols3.retrieveOrdersFromBinanceForPair = retrieveOrdersFromBinanceForPair;
    Symbols3.retrieveOpenOrdersFromBinanceForPair = retrieveOpenOrdersFromBinanceForPair;
    window.Symbols3 = Symbols3;
})();