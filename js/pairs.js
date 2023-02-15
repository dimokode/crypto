;(function(){

function pairs(){}

function show(){
    
    template.loadTemplateByName('pairs.html').then(function(html){
        $('#content').html(html);
        const obj = {
            controller : 'pairs',
            action : 'getPairs'
        }

        common.sendAjax(obj).then(async function(json){
            console.log(json['data']);
            let balance = await calculateBalance(json['data']);
            let objBalance = balance['balance'];
            delete balance['balance'];
            console.log(balance);
            console.log(objBalance);
            

            if(json['success']){
                //$('#pairs').html(json['json']);
                const structure = {
                    /*
                    id : {
                        name : 'id',
                        type : 'autoincrement',
                        contenteditable : false
                    },
                    */
                    symbol1 : {
                        name : 'symbol1',
                        type : 'text',
                        //datasource : 'tdb:symbols[symbol]',
                        
                        contenteditable : false
                    },
                    symbol2 : {
                        name : 'symbol2',
                        type : 'text',
                        //datasource : 'tdb:symbols[symbol]',
                        contenteditable : false
                    },
                    sum_qty : {
                        name : 'sum_qty',
                        type : 'text',
                        contenteditable : true
                    },
                    price_avg : {
                        name : 'price_avg',
                        type : 'text',
                        contenteditable : true
                    },
                    price_now : {
                        name : 'price_now',
                        type : 'text',
                        contenteditable : false
                    },
                    price_dif_abs : {
                        name : 'price_dif_abs',
                        type : 'text',
                        colored : true,
                    },
                    price_dif_rel : {
                        name : 'price_dif_rel',
                        type : 'text',
                        colored : true,
                    },
                    balance_buyed : {
                        name : 'balance_buyed',
                        type : 'text',
                        //colored : true,
                    },
                    balance_dif_abs : {
                        name : 'balance_dif_abs',
                        type : 'text',
                        colored : true,
                    },
                    balance_dif_rel : {
                        name : 'balance_dif_rel',
                        type : 'text',
                        colored : true,
                    },
                }

                let tableContent = await tableto.createTable(structure);
                //console.log(localStorage.getItem('symbols'));
                $('#pairs').html(tableContent);
                //let jsonData = JSON.parse(json['json']);
                //let jsonData = json['data'];
                let jsonData = balance;
                //console.log(jsonData);
                for(let item in jsonData){
                    tableto.addRow(jsonData[item]);
                }
                tableto.addEvents();
            }else{
                alert(json['error']);
            }
        });
    });
}


async function calculateBalance(data){
    let pair = {};
    for(let item in data){
        let pairId = data[item]['symbol1']+data[item]['symbol2'];
        if(pair[pairId] === undefined){
            pair[pairId] = {
                'symbol1' : data[item]['symbol1'],
                'symbol2' : data[item]['symbol2'],
                'sum_qty' : 0,
                'sum_buy' : 0,
                'amount_buy' : 0
                
            };
        }
        if(data[item]['operation'] == 'Buy'){
            pair[pairId]['sum_qty'] += data[item]['qty']*1;
            pair[pairId]['sum_buy'] += data[item]['qty']*1;
            pair[pairId]['amount_buy'] += data[item]['qty']*data[item]['price'];
            //pair[pairId]['avg_price'] = data[item]['avg_price'];
        }else if(data[item]['operation'] == 'Sell'){
            pair[pairId]['sum_qty'] -= data[item]['qty']*1;
        }
    }

    let objBalance = {
        'balance_buyed' : 0,
        'balance_actual' : 0,
    };

    for(let pairId in pair){
        let price_avg = pair[pairId]['amount_buy']/pair[pairId]['sum_buy'];
        pair[pairId]['price_avg'] = (price_avg>10) ? price_avg.toFixed(2) : price_avg.toFixed(5);
        let price_now = (await getPrice(pairId))['price']*1;
        pair[pairId]['price_now'] = (price_now>10) ? price_now.toFixed(2) : price_now.toFixed(5);
        let price_dif_abs = price_now - price_avg;
        //console.log(balance_abs);
        pair[pairId]['price_dif_abs'] = (Math.abs(price_dif_abs) > 1) ? price_dif_abs.toFixed(2) : price_dif_abs.toFixed(5);
        //console.log(balance_abs);
        pair[pairId]['price_dif_rel'] = (price_dif_abs / (price_avg / 100)).toFixed(2);
        //console.log(pair[pairId]['price']);
        let balance_buyed = price_avg * pair[pairId]['sum_qty'];
        pair[pairId]['balance_buyed'] = (balance_buyed>10) ? balance_buyed.toFixed(2) : balance_buyed.toFixed(5);
        let balance_actual = price_now * pair[pairId]['sum_qty'];
        let balance_dif_abs = balance_actual - balance_buyed;
        pair[pairId]['balance_dif_abs'] = (Math.abs(balance_dif_abs) > 10) ? balance_dif_abs.toFixed(2) : balance_dif_abs.toFixed(5);
    
        let balance_dif_rel = balance_dif_abs / (balance_buyed / 100)
        //pair[pairId]['balance_dif_rel'] = (Math.abs(balance_dif_rel) > 10) ? balance_dif_rel.toFixed(2) : balance_dif_rel.toFixed(5);
        pair[pairId]['balance_dif_rel'] = balance_dif_rel.toFixed(2);

        objBalance['balance_buyed']+=balance_buyed;
        objBalance['balance_actual']+=balance_actual;
    }
    objBalance['balance_dif_abs'] = objBalance['balance_actual'] - objBalance['balance_buyed'];
    objBalance['balance_dif_rel'] = objBalance['balance_dif_abs'] / (objBalance['balance_buyed'] / 100);
    pair['balance'] = objBalance;
    return pair;
}

function getPrice(pair){
    return new Promise(function(resolve){
        const obj = {
            controller : 'pairs',
            action : 'getPrice',
            pair : pair
        }
    
        common.sendAjax(obj).then(function(json){
            //console.log(json);
            if(json['success']){
                console.log(JSON.parse(json['data'])['price'])
                resolve(JSON.parse(json['data']));
            }else{
                alert(json['error']);
                //return false;
            }
        });
    });

}

function save(){
    /*
    let jsonData = {};
    let tableRows = document.querySelectorAll('table>tbody>tr');
    console.log(tableRows);
    let i = 0;
    tableRows.forEach(function(elem){
        //console.log(elem);
        let tdArr = elem.querySelectorAll('td');
        //console.log(tdArr);
        jsonData[i] = {};
        tdArr.forEach(function(td){
            if(!td.getAttribute('nodata')){
                console.log(td.getAttribute('name'));
                jsonData[i][td.getAttribute('name')] = td.innerHTML;
            }
        })
        i++;
    })
    */
    const obj = {
        controller : 'pairs',
        action : 'savePairs',
        jsonData : JSON.stringify(tableto.getDataFromTable())
    }

    common.sendAjax(obj).then(function(json){
        if(json['success']){
            alert('Data was successfully saved');
        }else{
            alert(json['error']);
        }
    });

    //console.log(JSON.stringify(jsonData));
}

pairs.show = show;
pairs.getPrice = getPrice;
pairs.save = save;
window.pairs = pairs;

})();