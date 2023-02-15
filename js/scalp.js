;(function(){

function scalp(){}

async function show(){
    const html = await template.loadRawTemplateByName('scalp.html');
    $('content').html(html);

    common.sendAjax({
        controller : 'dbf',
        action : 'getScalps'
    }).then( async response => {
        console.log(response);
        if(response.success){
            const data = response.data;

            let htmlScalpRow = await template.loadRawTemplateFromFile('scalprow.html');

            htmlScalpRow = template.generateList({
                tpl : htmlScalpRow,
                data : data
            });
            $('#scalp').html(htmlScalpRow);

        }else{
            console.log(response.error);
        }
    });
}


async function add(){
    //const popup = new Popup();
    //popup.show();
    const popupId = popup.new();
    console.log(popupId);
    //console.log(popup.id);
    popup.show(popupId);


    let formObj = await importObjectFromFile('/config/forms/form.js');
    let htmlForm = '';

    for(let el in formObj){
        htmlForm+= await fg.generate(formObj[el]);
    }
    htmlForm = `<form id="scalpForm" operation="insert" popupId="${popup.id}" onsubmit="return false;">${htmlForm}</form>`;
    //popup.addContent(html);

    let htmlAddPage = await template.loadRawTemplateFromFile('scalp.add.html');

    popup.addContent(popupId, htmlAddPage);

    popup.replaceTags(popupId, {
        form : htmlForm,
    });


    let preparedBalances = Symbols3.prepareBalances(await Symbols3.getBalances()),
        dataBalances = preparedBalances['dataBalances'],
        dataFiat = preparedBalances['dataFiat'];

    console.log(dataBalances, dataFiat);

    let objSelect1 =  {
        element : 'select',
        label : 'Symbol1',
        attributes : {
            id: 'selectSymbol1',
            name : 'selectSymbol1',
            onchange : `scalp.showSymbolPairSelect(this, "${popupId}");`
        },
        options : fg.generateOptionsObject(Object.keys(dataBalances)),
    };

    let objSelect2 =  {
        element : 'select',
        label : 'Symbol2',
        attributes : {
            id: 'selectSymbol2',
            name : 'selectSymbol2',
            disabled : true
        },
        options : {},
    };


    //popup.changeTagContent('select-symbol-1', 'dasdasdasd');
    popup.changeTagContent(popupId, 'select-symbol-1', await fg.generate(objSelect1));
    popup.changeTagContent(popupId, 'select-symbol-2', await fg.generate(objSelect2));
/*
    popup.replaceTags({
        selectSymbol : await fg.generate(objSelect),
    });
*/
/*
    let objOptions = fg.generateOptionsObject(Object.keys(dataBalances));
    console.log(objOptions);
*/  
}


async function showSymbolPairSelect(el, popupId){
    console.log('showSymbolPairSelect');
    const symbol = el.value;
    console.log(symbol);
    const objExchangePairs = await Symbols3.getExchangePairsBySymbol(symbol);
    console.log('objExchangePairs', objExchangePairs);


    let objSelect2 =  {
        element : 'select',
        label : 'Symbol2',
        attributes : {
            id: 'selectSymbol2',
            name : 'selectSymbol12',
            //onchange : 'scalp.showSymbolPairSelect(this);'
        },
        options : fg.generateOptionsObject(objExchangePairs),
    };

    popup.changeTagContent(popupId, 'select-symbol-2', await fg.generate(objSelect2));
    //const symbols = objExchangeInfo['symbols'];
}

async function getOrdersByPair(symbol){

    const form = $('form');
    form.find('input[name="symbol"]').val(symbol);
    $('#waitAMinute').show();
    //const symbol = document.querySelector('#selectSymbol1').value+document.querySelector('#selectSymbol2').value;
    console.log('symbol', symbol);
    

    //const response = await Symbols3.retrieveOrdersFromBinanceForPair(symbol);
    const data = await Symbols3.getOrdersByPair(symbol);
    $('#waitAMinute').hide();
    console.log(data);


    const popupId = popup.new();
    popup.show(popupId);


    const structure = {
        cb :{
            name : 'cb',
            type : 'checkbox',
            nodata : true
        },
        nr : 
        {
            name : 'nr',
            type : 'increment',
            count : 0,
            nodata : true
        },
        id :
        {
            name : 'id',
            type : 'text',
            trId : true
        },
        time :
        {
            name : 'time',
            type : 'datetime',
            sortable : true,
            //trId : true
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
    /*
    let div = document.createElement('div');
    div.append(tableContent);
    let htmlTable = div.innerHTML;
    console.log(htmlTable);
    */
    let htmlHeader = `
<button class="w3-button w3-green" onclick="scalp.getSelectedOrders('tableOrders', '${popupId}');">Get Orders</button>
    `;

    popup.addContent(popupId, htmlHeader);
    popup.addContent(popupId, tableContent);

    data.forEach( item => {
        tableto.addRow('tableOrders', item);
    });
    tableto.colorizeTable({
        tableId : 'tableOrders'
    });

    tableto.sort('tableOrders', 'time');

}

function getSelectedOrders(tableId, popupId){
    //const colsList = tableto.getColsListFromTableHeader(tableId);

    const arrSelectedRows = tableto.getSelectedRowsFromTable(tableId);
    console.log(arrSelectedRows);

    const objHead  = tableto.extractDataFromTableHead(tableId);
    console.log(objHead);
    const cols = Object.keys(objHead);
    console.log(cols);
    let arr = [];

    arrSelectedRows.forEach( row => {
        const obj = tableto.extractDataFromTableRow(row, 'td', cols);
        //console.log(obj);
        arr.push(obj);
    })

        popup.hide(popupId);
        //$('#qty1').val('ggg');
        console.log(arr);

        const obj = proceedOrders(arr);
        console.log(obj);

        const form = $('form');
        for(let item in obj){
            form.find(`input[name="${item}"]`).val(obj[item]);
        }
        
        //return arr;
}

function proceedOrders(arr){
    obj = {};
    let qty = Number(0);
    //let price = Number(0);
    let quoteQty = Number(0);
    arr.forEach( (order => {
            qty+= Number(order.qty);
            quoteQty+= Number(order.quoteQty);
            //console.log(Number(order.price * order.qty));
            
            
    }));

    obj.qty = qty;
    obj.quoteQty = quoteQty;
    obj.price = quoteQty/qty;

    return obj;
    
}

scalp.show = show;
scalp.add = add;
scalp.showSymbolPairSelect = showSymbolPairSelect;
scalp.getOrdersByPair = getOrdersByPair;
scalp.getSelectedOrders = getSelectedOrders;
window.scalp = scalp;

})();