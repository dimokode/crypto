;(function(){
function dataviews(){}

function tableOpenOrders(data){

    console.log(data);

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
        /*
        clientOrderId :
        {
            name : 'clientOrderId',
            type : 'text',
            //trId : true
        },
        */
        orderId :
        {
            name : 'orderId',
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
        origQty : {
            name : 'origQty',
            type : 'text',
        },
        price : {
            name : 'price',
            type : 'text',
        },

        type : {
            name : 'type',
            type : 'text',
        },
        side : {
            name : 'side',
            type : 'text',
        },
        status : {
            name : 'status',
            type : 'text',
        },
    }

    let tableContent = tableto.createTable('tableOpenOrders', structure);
    
    let tableTemplate = document.createElement('div');
    tableTemplate.append(tableContent);

    document.body.append(tableTemplate);
    //let htmlTable = div.innerHTML;
    //console.log(htmlTable);
    

    //data.forEach( row => {
    //    tableto.addRow('tableOrders', row);
    //});
    for(let i=0; i<data.length; i++){
        tableto.addRow('tableOpenOrders', data[i]);
    }
    
    /*
    tableto.colorizeTable({
        tableId : 'tableOpenOrders'
    });
    */
   tableto.colorizeRows({
       tableId : 'tableOpenOrders',
       field : {
           name : 'side',
           conditions : {
                buy: 'w3-pale-green',
                sell: 'w3-pale-red'
           }
       }
   });
    
    //tableto.sort('tableOrders', 'time');
    return tableTemplate;
}

dataviews.tableOpenOrders = tableOpenOrders;
window.dataviews = dataviews;
})();