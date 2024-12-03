;(function(){

function tableto(){}


function createForm(structure, btnObj){
    let htmlForm = '';
    for(let item in structure){
        let htmlItem = '';
        let itemObj = structure[item];
        //console.log(itemObj);
        itemType = itemObj['type'];

        if(itemType == 'text' || itemType == 'datetime-local'){
            htmlItem = createInput(itemObj);
        }else if(itemType == 'select'){
            htmlItem = createSelect(itemObj);
        }
        htmlForm+=htmlItem;
    }

    let button = document.createElement('button');
    button.innerHTML = btnObj['text'];
    button.setAttribute('onclick', btnObj['onclick']);
    button.setAttribute('class', btnObj['class']);
    let div = document.createElement('div');
    div.appendChild(button);
    return htmlForm + div.innerHTML;
}

function createInput(obj){
    let div = document.createElement('div');
    let br = document.createElement('br');
    let label = document.createElement('label');
    label.setAttribute('for', obj['name']);
    let input = document.createElement('input');
    input.setAttribute('name', obj['name']);
    input.setAttribute('type', obj['type']);
    
    //console.log(obj['value']);
    if(obj['value'] !== undefined){
        input.setAttribute('value', obj['value']);
        console.log(input.getAttribute('value'));
    }
    label.innerHTML = obj['name'];
    div.appendChild(label);
    div.appendChild(br);
    div.appendChild(input);
    div.appendChild(br);
    return div.innerHTML;
}

function createSelect(obj){

    let div = document.createElement('div');
    let br = document.createElement('br');
    let label = document.createElement('label');
    let select = document.createElement('select');
    label.setAttribute('for', obj['name']);

    let ds = parseDatasource(obj['datasource']);
    console.log(ds);
    
    let data = JSON.parse(localStorage.getItem(ds['tdbName']));
    console.log(data);
    

    for(let item in data){
        //console.log(data[item]);
        let option  = document.createElement('option');
        option.value = data[item][obj['option']['value']];
        option.text = data[item][obj['option']['text']];
        select.appendChild(option);
        //console.log(data[item][tdbField]);
    }


    select.setAttribute('name', obj['name']);

    label.innerHTML = obj['name'];
    div.appendChild(label);
    div.appendChild(br);
    div.appendChild(select);
    div.appendChild(br);
    return div.innerHTML;
}




function createTable(tableId = null, structure, rowButtons = {}){
    document.querySelectorAll('template').forEach(function(item){
        item.remove();
    });

    let div = document.createElement('div');


    let table = document.createElement('table');
    if(tableId === null){
        table.id = "tableto";
    }else{
        table.id = tableId;
    }
    
    table.classList.add('w3-table');
    table.classList.add('w3-striped');
    table.classList.add('w3-small');
    table.classList.add('w3-bordered');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    let template = document.createElement('template');
        template.id = 'tmpTableRow';
    let templateRow = document.createElement('tr');
    let tr = document.createElement('tr');
    


    // buttons
    let th = document.createElement('th');
    th.setAttribute('nodata', true);
    th.setAttribute('name', 'buttons');
    tr.appendChild(th);
    let td = document.createElement('td');
    for(let rowButton in rowButtons){
        td.innerHTML+=rowButtons[rowButton]
    }

    td.setAttribute('nodata', true);
    td.setAttribute('name', 'buttons');
    templateRow.appendChild(td);
    // buttons end



    for(let elem in structure){
        
        th = document.createElement('th');

        for(let attr in structure[elem]){
            let attrType = typeof structure[elem][attr];
            //console.log(attr, attrType)
            if(attrType == 'object'){
                th.dataset[attr] = JSON.stringify(structure[elem][attr]);
            }else{
                th.setAttribute(attr, structure[elem][attr]);
            }
        }


        if(structure[elem]['type'] == 'checkbox'){
            th.innerHTML = `<input type="checkbox" onclick="tableto.swapCheckboxes(this);">`
        }else{
            th.innerHTML = structure[elem]['name'];
        }
        

        // sort event
        if(th.getAttribute('sortable')){
            th.classList.add('th-clickable');
            th.addEventListener('click', (event)=>{
                console.log('eventTarget', event.target);

                //event.preventDefault();
                //console.log('click');
                //tableto.tableId = table.id;
                console.log(tableto.tableId, table.id);
                tableto.sort(table.id, structure[elem]['name']);
                
                //console.log(tableto.tableId);
                //tableto.sort(event.target);
            })
        }
        // sort event end
        
        let td = document.createElement('td');
        td.setAttribute('name', structure[elem]['name']);
        td.setAttribute('type', structure[elem]['type']);
        if(structure[elem]['contenteditable']){
            td.setAttribute('contentEditable', true);
        }

        //events
        if(structure[elem]['events']){
            for(let event in structure[elem]['events']){
                td.setAttribute(event, structure[elem]['events'][event]);
            }
        }

        //add classes to TD
        if(structure[elem]['class']){
            td.classList.add(structure[elem]['class']);
        }
        
        templateRow.appendChild(td);
        tr.appendChild(th);
    }//for


    thead.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tbody);
    //div.appendChild(btnAdd);
    div.appendChild(table);
    template.appendChild(templateRow);
    document.body.appendChild(template);

    return div;
}


function swapCheckboxes(el){
    console.log(el);
    const cbState = el.checked;
    console.log('cbState', cbState);

    const tableId = el.findParentElementByTagname('table').id;
    console.log(tableId);

    const tableElement = document.querySelector('#' + tableId);
    const cbs = tableElement.querySelectorAll('tr>td[name="cb"]>input[type="checkbox"]');
    //console.log(trs);

    cbs.forEach( cb => {
        cb.checked = cbState;
    });
}



function parseDatasource(strDatasource){
    //let regExp = /(.*?):(.*?)\[(.*?)\]/;
    let regExp = /([a-zA-Z]{1,}):([a-zA-Z]{1,})/;
    let found = strDatasource.match(regExp);
    //console.log(Array.from(found));
    console.log(found);
    return {
        sourceType : found[1],//tdb, config
        tdbName : found[2],
    }

}


function addCheckboxes(tableId){
    if(tableId == undefined){
        console.log('tableId is not defined');
        return;
    }
    let table = document.querySelector('#'+tableId+'>tbody');
    let tdCb = `
<td>
    <input type="checkbox">    
</td>`;
}


function addRow(tableId = null, rowData = null){
    //console.log(rowData);
    if(tableId === null){
        tableId = 'tableto';
    }
    let table = document.querySelector('#'+tableId);
    let tmpRow = document.querySelector('template#tmpTableRow>tr');
    let tmpRow2 = tmpRow.cloneNode(true);
    //console.log(tmpRow2);
 
    //let objHeaderCols = {};
    tmpRow2.querySelectorAll('td:not([nodata=true])').forEach(function(item){
        //:not([nodata=true]) exclude first column with buttons
        //console.log(item);
        let tdId = item.getAttribute('name');//asset
        let tdType = item.getAttribute('type');
        let th = table.querySelector('thead>tr>th[name="'+tdId+'"]');


        //console.log(tdId);
        //console.log(tdType);
        //console.log(th);

        let dataValue = '';
        if(rowData != null){
            //console.log(typeof rowData[tdId])
            if(typeof rowData[tdId] == 'object'){
                //dataValue = (rowData[tdId] !== undefined) ? rowData[tdId]['actual'] : '';
                item.dataset.actual = rowData[tdId]['actual'];
                item.dataset.previous = rowData[tdId]['previous'];
                item.dataset.value = rowData[tdId]['actual'];
                dataValue = rowData[tdId]['actual'];
            }else{
                dataValue = (rowData[tdId]!==undefined) ? rowData[tdId] : '0';
                item.dataset.value = dataValue;
                //dataValue = rowData[tdId];
                //item.dataset.value = (rowData[tdId]!==undefined) ? rowData[tdId] : '';
            }
            
            //console.log(dataValue)
        }

        //console.log('dataValue', dataValue);
        //if(dataValue !== undefined){
        //    item.dataset.value = dataValue;
        //}
        
        //item.dataset.value = 'aaa';
        //dataValue = (dataValue !== undefined) ? dataValue : 0;

        if(tdType == 'text'){
           item.innerHTML = dataValue;
        }else if(tdType == 'select'){
            /*
            if(rowData != null){
                item.innerHTML = (rowData[tdId]!==undefined) ? rowData[tdId] : '';
            }  
            item.setAttribute('onclick', 'tableto.addSelect(this)');
            */
        }else if(tdType == 'float'){
            item.innerHTML = dataValue;
        }else if(tdType == 'increment'){
            let tdNr = Number(th.getAttribute('count'))+1;
            //item.innerHTML = `<input type="checkbox" value="${tdNr}">${tdNr}`;
            item.innerHTML = `${tdNr}`;
            th.setAttribute('count', tdNr);
        }else if(tdType == 'datetime'){
            //item.innerHTML = new Date(dataValue).toLocaleString();
            item.innerHTML = convertTimestampToDatetime(dataValue);
        }else if(tdType == 'checkbox'){
            item.innerHTML = `<input type="checkbox">`;
        }
        


        if(th.hasAttribute('colored')){
            if((item.innerHTML*1) > 0){
                item.classList.add('w3-green');
            }else{
                item.classList.add('w3-red');
            }
        }

        
        if(th.hasAttribute('trid')){
            //console.log('tdID', tdId, rowData[tdId]);
            tmpRow2.setAttribute('name', rowData[tdId]);
            //console.log(tmpRow2);
        } 
    });

    //console.log(objHeaderCols);

    //console.log(tmpRow2);
    table.querySelector('tbody').appendChild(tmpRow2);
}








// return ARRAY
function getSelectedRowsFromTable(tableId){
    console.log(tableId);
    if(tableId === null){
        tableId = 'tableto';
    }
    let table = document.querySelector('#'+tableId+'>tbody');
    //let cbs = table.querySelectorAll('tr>td>input[type="checkbox"]:checked');
    let cbs = Array.from(table.querySelectorAll('tr>td>input[type="checkbox"]:checked')).map(cb => {
        return cb.findParentElementByTagname('tr');
    })
    
    //console.log(cbs);
    return cbs;
    /*
    cbs.forEach(item => {
        let tr = item.findParentElementByTagname('tr');
        //console.log(tr);
        //extractDataFromTableRow(tr);
    })
    */
}


function getAttributesObject(attributesNamedNodeMap){
    let obj = {};
    Array.from(attributesNamedNodeMap).forEach( attr => {
            obj[attr.name] = attr.value;
    });
    return obj;
}


function extractDataFromTableRow(trElement, colTag = 'td', cols){
    let obj = {};
    const tds = trElement.querySelectorAll(colTag);
    //console.log(tds);
    tds.forEach( td => {
        //console.log(td);
        const tdName = td.getAttribute('name');
        if(cols.includes(tdName)){
            obj[tdName] = td.dataset.value;
        }
        
    });

    return obj;
}

function extractDataFromTableHead(tableId){
    let obj = {};
    let ths = document.querySelectorAll('#'+tableId+'>thead>tr>th');
    //console.log(ths);
    ths.forEach( th => {
        obj[th.getAttribute('name')] = getAttributesObject(th.attributes);
        if(obj[th.getAttribute('name')]['nodata']){
            delete obj[th.getAttribute('name')];
        }
    })
    
    return obj;
}


function deleteRow(el){
    //console.log(el);
    let element = $(el).parent('td').parent('tr');
    console.log(element);
    element.remove();
}


function addSelect(el){
    let tdValue = el.innerHTML;
    el.innerHTML = '';
    //el.innerHTML = "Slelece";
    let tdId = el.getAttribute('name');
    //let data = getDataByDatasource(tdId);
    let th = document.querySelector('table>thead>tr>th[name="'+tdId+'"]');
    let datasource = th.dataset.datasource;
    let th_option = JSON.parse(th.dataset.option);
    console.log(th_option);
    
    if(th_option === undefined){
        alert('no option exists');
        return;
    }
    //console.log(datasource);
    const ds = parseDatasource(datasource);
    console.log(ds);
    /*
    let regExp = /(.*?)\[(.*?)\]/;
    let found = datasource.match(regExp);
    let tdbName = found[1];
    let tdbField = found[2];
    */
    let data = JSON.parse(localStorage.getItem(ds['tdbName']));

    let select  = document.createElement('select');
    for(let item in data){
        let option  = document.createElement('option');
        option.value = data[item][th_option['value']];
        if(tdValue == option.value){
            option.setAttribute('selected', true);
        }
        option.text = data[item][th_option['text']];
        if(th_option['class'] !== undefined){
            option.classList.add(data[item][th_option['class']]);
        }
        select.appendChild(option);
        //console.log(data[item][tdbField]);
    }
    el.setAttribute('onclick', false);
    select.setAttribute('onblur', 'tableto.swapSelect(this)');
    el.appendChild(select);
    
    select.focus();
    

}

function swapSelect(el){
    console.log('swap select');
    //console.log(el.value);
    let elParent = $(el).parent('td');
    console.log(elParent);
    //elParent.html(el.value);
    elParent[0].innerHTML = el.value;
    elParent[0].className = el.options[el.selectedIndex].className;
    //console.log(el.options[el.selectedIndex].className);
    elParent[0].setAttribute('onclick', 'tableto.addSelect(this)');


}

function getDataByDatasource(tdId){
    let datasource = document.querySelector('table>thead>tr>th[name="'+tdId+'"]').dataset.datasource;
    //console.log(datasource);
    let regExp = /(.*?)\[(.*?)\]/;
    let found = datasource.match(regExp);
    let tdbName = found[1];
    //let tdbField = found[2];
    return JSON.parse(localStorage.getItem(tdbName));
}

function getDataFromTable(){
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
    return jsonData;
}

function getDataFromForm(){
    let jsonData = {};
    let formElements = document.querySelectorAll('input, select');
    formElements.forEach(function(elem){
        //console.log(elem);
        let tagName = elem.tagName;
        console.log(tagName);
        let elementName = elem.getAttribute('name');
        let elementValue = elem.value;
        jsonData[elementName] = elementValue;

        //console.log(elementName + ' => ' + elementValue);
    });
    return jsonData;

}


function addEvents(){

    $('#tableto').sortable({
        items : "> tbody > tr",
        cursor : 'move',
        helper : 'clone'
    });

    $('#tableto>tbody>tr').find('td').each(function(){
        //$(this).css('color', 'red');
        $(this).on("click", function(){
            
            $(this).focus();
            
        }).on("keydown", function(event){
            //console.log(event.keyCode);
            //event.preventDefault();
            if(event.keyCode == 13 || event.keyCode == 27){
                $(this).blur();
            }
        })
    });
}




function colorizeTable(obj){
    const table = document.querySelector('#'+obj.tableId);
    const trNodeList = table.querySelectorAll('tbody>tr');
    //console.log(trNodeList)
    trNodeList.forEach( (tr) => {
        //console.log(tr)
        let isBuyer = tr.querySelector('td[name="isBuyer"]').innerHTML;
        //console.log(isBuyer);
        //if(isBuyer !== null){
        //    isBuyer = isBuyer.innerHTML;
        //}
        
        //console.log('isBuyer', isBuyer)
        if(isBuyer == 'true'){
            tr.classList.add('w3-pale-green')
        }else{
            tr.classList.add('w3-pale-red')
        }
    })
}


function colorizeRows(params){
    /*
{
       tableId : 'tableOpenOrders',
       field : {
           name : 'side',
           conditions : {
                buy: 'w3-green',
                sell: 'w3-red'
           }
       }
   }
*/
    const table = document.querySelector('table#'+params.tableId);
    const trs = table.querySelectorAll('tbody>tr');
    const fieldName = params.field.name;
    const conditions = params.field.conditions;
    trs.forEach( tr => {
        let value = tr.querySelector(`td[name="${fieldName}"]`).dataset.value.toLowerCase();
        //console.log(value);
        //console.log(conditions[value]);
        if(conditions[value] !== undefined){
            tr.classList.add(conditions[value]);
        }
            
    })
}


function colorizeNumber(num){
    let className = 'w3-text-green';
    num = Number(num);
    if(num<0){
        className = 'w3-text-red';
    }
    return `<span class="${className}">${num}</span>`
}

function colorizeRow(tableId, rowId){
    let tableElement = document.querySelector('#'+tableId)
    let rowElement  =tableElement.querySelector('tr[name="'+rowId+'"]')

}

function updateRow(tableId, rowId, rowData){
    // WARNING! Replace table cells content by rowId
    let tableElement = document.querySelector('#'+tableId)
    let rowElement  =tableElement.querySelector('tr[name="'+rowId+'"]')
    for(let colId in rowData){
        const tdElement = rowElement.querySelector('td[name="'+colId+'"]')
        if(tdElement){
            let value = Number(rowData[colId])
            tdElement.dataset.value = value
            if(Math.abs(value) < 1 && String(rowData[colId]).length>8){
                value = value.toFixed(8)
            }else if(value < 0 || value > 1){
                value = value.toFixed(2)
            }
            tdElement.innerHTML = value
            //tdElement.innerHTML = Number(tdElement.innerHTML).toFixed(2)
            
            const thElement = tableElement.querySelector('thead>tr>th[name="'+colId+'"]')
            if(thElement !== undefined){
                const dataColorize = thElement.dataset.colorize
                if(dataColorize !== undefined){
                    objColorize = JSON.parse(dataColorize)
                    //console.log(objColorize)
                    if(rowData[colId] >0 ){
                        tdElement.classList.add(objColorize['positive'])
                    }else if(rowData[colId] <0 ){
                        tdElement.classList.add(objColorize['negative'])
                    }
                }
            }
        }     
    }
    //let rowElement = tableElement.querySelector('tr#'+rowId)

}

function getTableIdByTdElement(el){
    if(el.tagName === 'TD'){
        return $(el).parent('tr').parent('tbody').parent('table').attr('id');
    }
    return $(el).parent('td').parent('tr').parent('tbody').parent('table').attr('id');
    //let price = Number($(el).parent('td').parent('tr').find('td[name="price"]').text());
    //let available = Number($(el).parent('td').parent('tr').find('td[name="available"]').text());
}

function getRowIdByTdElement(el){
    if(el.tagName === 'TD'){
        return $(el).parent('tr').attr('name');    
    }
    return $(el).parent('td').parent('tr').attr('name');
    //let price = Number($(el).parent('td').parent('tr').find('td[name="price"]').text());
    //let available = Number($(el).parent('td').parent('tr').find('td[name="available"]').text());
}


function setTdContent(rowId, colId, value){
    const tableId = tableto.tableId;
    //console.log('tableId', tableId);
    const tableElement = document.querySelector('#'+tableId);
    let rowElement = tableElement.querySelector('tr[name="'+rowId+'"');
    rowElement.querySelector('td[name="'+colId+'"]').innerHTML = value;
}

function getTdContent(tableId, rowId, colId){
    const tableElement = document.querySelector('#'+tableId)
    let rowElement = tableElement.querySelector('tr[name="'+rowId+'"')
    return Number( rowElement.querySelector('td[name="'+colId+'"]').innerHTML )
}

function getTdValue(tableId, rowId, colId){
    const tableElement = document.querySelector('#'+tableId)
    let rowElement = tableElement.querySelector('tr[name="'+rowId+'"')
    return Number( rowElement.querySelector('td[name="'+colId+'"]').dataset.value )
}


function td(tableId, rowId, colId){
    const tableElement = document.querySelector('#'+tableId)
    let rowElement = tableElement.querySelector('tr[name="'+rowId+'"')
    let tdElement = rowElement.querySelector('td[name="'+colId+'"]')

    return {
        getData(name){
            return tdElement.dataset[name]
        },
        setData(name, value){
            tdElement.dataset[name] = value
        }
    }
}

function setTdValue(rowId, colId, value){
    const tableId = tableto.tableId;
    //console.log('tableId', tableId);
    const tableElement = document.querySelector('#'+tableId);
    let rowElement = tableElement.querySelector('tr[name="'+rowId+'"');
    rowElement.querySelector('td[name="'+colId+'"]').dataset.value = value;
}

function getRowIdsArrayFromTable(tableId){
    const tableElement = document.querySelector('#'+tableId)
    let arrRowIds = []
    tableElement.querySelectorAll('tbody>tr').forEach( rowElement => {
        //console.log(row);
        arrRowIds.push(rowElement.getAttribute('name'));
    })

    return arrRowIds;
}

function updateTableStyle(tableId, rowId, objTableStyle){
    let tableElement = document.querySelector('#'+tableId)
    let rowElement  =tableElement.querySelector('tr[name="'+rowId+'"]')
    for(let tdId in objTableStyle){
        let tdElement = rowElement.querySelector('td[name="'+tdId+'"]')
        if(tdElement){
            for(let attr in objTableStyle[tdId]){
                if(attr == 'class'){
                    tdElement.classList.add(objTableStyle[tdId][attr])
                }else{
                    tdElement.setAttribute(attr, objTableStyle[tdId][attr])
                }
                
            }
        }
    }
}



function setTableId(tableId){
    tableto.tableId = tableId;
}





function sort(tableId, fieldName = '', type = 'desc'){
    console.log('tableId', tableId);
    if(tableId == undefined){
        console.warn('Please, specify table ID');
    }
    console.log('sort', fieldName, type);
    
    //const tableId = tableto.tableId;
    //console.log('tableId', tableId);
    const tableElement = document.querySelector('#'+tableId);
    
    //let sortType = '';
    tableElement.querySelectorAll(`thead>tr>th:not([name="${fieldName}"])`).forEach( item => {
        //console.log(item)
        item.classList.remove('asc')
        item.classList.remove('desc')
    })

    let thElement = tableElement.querySelector(`thead>tr>th[name="${fieldName}"]`);
    //console.log(thElement);
    //console.log(thElement.classList.contains('asc'))

    if(thElement.classList.contains('asc')){
        thElement.classList.remove('asc')
        type = 'desc';
    }else if(thElement.classList.contains('desc')){
        thElement.classList.remove('desc')
        type = 'asc';
    }else{
        type = 'desc';
    }

    //console.log('type', type)

    let classNameSort = '';
    if(type == 'asc'){
        classNameSort = 'asc';
    }else if(type = 'desc'){
        classNameSort = 'desc';
    }

    
    thElement.classList.add(classNameSort);


    let arrRowElements = {};//[attr="name"] = row DOM element
    let objSortField = {};
    tableElement.querySelectorAll('tbody>tr').forEach( rowElement => {
        //console.log(rowElement)
        //console.log(rowElement.getAttribute('name'), fieldName);

        arrRowElements[rowElement.getAttribute('name')] = rowElement;
        rowElement.remove();

        
        objSortField[rowElement.getAttribute('name')] = Number($(rowElement).find('td[name="'+fieldName+'"]')[0].dataset.value);
        
    });


    //console.log('arrRowElements', arrRowElements);
    //console.log(objSortField)


    keysSorted = Object.keys(objSortField).sort(function(a,b){
        if(type == 'desc'){
            return objSortField[b]-objSortField[a]
        }else if(type == 'asc'){
            return objSortField[a]-objSortField[b]
        }
    })

    //console.log('keysSorted', keysSorted);
    

    //tableElement.querySelector('tbody').remove()

    let tbodyElement = tableElement.querySelector('tbody');
    //console.log(tbodyElement);
    let counter = Number(1);
    keysSorted.forEach( assetId => {
        //console.log(assetId)
        //console.log(arrRowElements[assetId])
        arrRowElements[assetId].querySelector('td[type="increment"]').innerHTML = Number(counter);
        counter++;
        tbodyElement.appendChild(arrRowElements[assetId]);
    })


/*
    obj.sort((a, b) => {
        return a[1]-b[1]
    })
*/
    return keysSorted;
}




tableto.createTable = createTable;
tableto.setTableId = setTableId;

tableto.sort = sort;

tableto.createForm = createForm;
tableto.addRow = addRow;
tableto.deleteRow = deleteRow;
tableto.addSelect = addSelect;
tableto.swapSelect = swapSelect;
tableto.getDataFromTable = getDataFromTable;
tableto.addEvents = addEvents;
tableto.getDataFromForm = getDataFromForm;

tableto.colorizeTable = colorizeTable;
tableto.updateRow = updateRow;
tableto.getTableIdByTdElement = getTableIdByTdElement;
tableto.getRowIdByTdElement = getRowIdByTdElement;

tableto.setTdContent = setTdContent;
tableto.getTdContent = getTdContent;

tableto.colorizeRow = colorizeRow;
tableto.colorizeRows = colorizeRows;
tableto.colorizeNumber = colorizeNumber;

tableto.getRowIdsArrayFromTable = getRowIdsArrayFromTable;
tableto.updateTableStyle = updateTableStyle;

tableto.setTdValue = setTdValue;
tableto.getTdValue = getTdValue;

tableto.addCheckboxes = addCheckboxes;
tableto.swapCheckboxes = swapCheckboxes;
tableto.getSelectedRowsFromTable = getSelectedRowsFromTable;
tableto.extractDataFromTableRow = extractDataFromTableRow;
tableto.extractDataFromTableHead = extractDataFromTableHead;
tableto.td = td;

window.tableto = tableto;

})();