;(function(){

function operations(){}

function show(){

    template.loadTemplateByName('operations.html').then(function(html){
        $('#content').html(html);

        const obj = {
            controller : 'operations',
            action : 'getOperations'
        }

        common.sendAjax(obj).then(async function(json){

            //console.log(json);
            

            if(json['success']){
                //$('#pairs').html(json['json']);
                const structure = {
                    id : {
                        name : 'id',
                        type : 'text',
                        contenteditable : false
                    },
                    
                    timestamp : {
                        name : 'timestamp',
                        type : 'text',
                        contenteditable : false
                    },
                    
                    symbol1 : {
                        name : 'symbol1',
                        type : 'select',
                        datasource : 'tdb:symbols',
                        contenteditable : false
                    },
                    symbol2 : {
                        name : 'symbol2',
                        type : 'select',
                        datasource : 'tdb:symbols',
                        option : {
                            value : 'symbol',
                            text : 'symbol'
                        },
                        contenteditable : false
                    },
                    operation : {
                        name : 'operation',
                        type : 'select',
                        datasource : 'config:operations_type',
                        option : {
                            value : 'value',
                            text : 'text',
                            class : 'class'
                        },
                        contenteditable : false
                    },
                    qty : {
                        name : 'qty',
                        type: 'text',
                        contenteditable : true
                    },
                    price : {
                        name : 'price',
                        type: 'float',
                        contenteditable : true
                    }
                }
                if(json['json'] == ''){
                    json['json'] = '{}';
                }
                let tableContent = await tableto.createTable(structure);
                //console.log(localStorage.getItem('symbols'));
                $('#operations').html(tableContent);
                //let jsonData = JSON.parse(json['json']);
                let jsonData = json['data'];
                //console.log(jsonData);
                for(let item in jsonData){
                    tableto.addRow(jsonData[item]);
                }
                //tableto.addEvents();
            }else{
                alert(json['error']);
            }
        });
    });
}

function add(){
    template.loadTemplateByName('popup.html').then(function(html){
        let popup = document.createElement('div');
        popup.id = 'popup';
        popup.className = 'popup';
        popup.style.display = 'block';
        popup.innerHTML = html;
        document.body.appendChild(popup);

        const structure = {
                    
            timestamp : {
                name : 'timestamp',
                type : 'datetime-local',
                value : formatDate(Date.now(), 'yyyy-MM-ddThh:mm'),
                contenteditable : false
            },
            
            symbol1 : {
                name : 'symbol1',
                type : 'select',
                datasource : 'tdb:symbols',
                option : {
                    value : 'symbol',
                    text : 'symbol'
                },
                contenteditable : false
            },
            symbol2 : {
                name : 'symbol2',
                type : 'select',
                datasource : 'tdb:symbols',
                option : {
                    value : 'symbol',
                    text : 'symbol'
                },
                contenteditable : false
            },
            operation : {
                name : 'operation',
                type : 'select',
                datasource : 'config:operations_type',
                option : {
                    value : 'value',
                    text : 'text',
                    class : 'class'
                },
                contenteditable : false
            },
            qty : {
                name : 'qty',
                type: 'text',
                contenteditable : true
            },
            price : {
                name : 'price',
                type: 'text',
                contenteditable : true
            }
        }

        const btn = {
            text : 'Add',
            onclick : "operations.addToDB();",
            class : "w3-button w3-green"
        }

        let htmlForm = tableto.createForm(structure, btn);
        $('#form').html(htmlForm);
    });
}


function addToDB(){
    let jsonData = tableto.getDataFromForm();

    const obj = {
        controller : 'operations',
        action : 'addToDB',
        jsonData : jsonData
    }

    common.sendAjax(obj).then(function(json){
        console.log(json);
    });
}

operations.show = show;
operations.add = add;
operations.addToDB = addToDB;
window.operations = operations;
})();