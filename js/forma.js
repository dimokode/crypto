;(function(){
    function forma(){}
    
    function submitForm(){
        const operation = document.querySelector('form').getAttribute('operation');//insert or update
        const popupId = document.querySelector('form').getAttribute('popupId');
        const popupElement = document.querySelector('#'+popupId);

        let formData = forma.getFormData();
        console.log(formData);
        if(!formData){
            console.log('Please correct your input');
            return false;
        }else{
            //console.log(formData);
            let dataForServer = prepareDataForServer(formData);
            console.log('dataForServer', dataForServer);
            
            const obj = {
                controller : 'dbf',
                action : 'putDataInDb',
                //action : 'putFormDataInDb',
                operation : operation,
                formData : dataForServer
                //formData : formData
            }

            return common.sendAjax(obj).then((response) => {
                console.log(response);
                
                if(response.success){
                    //popupElement.remove();
                    Popup.hide(popupId);
                    //window['posts']['cb_'+action](response.unique_id, response.formData);
                    //window['posts']['cb_'+action](response.cbArr);
                    
                    if(window['cb'][operation] !== undefined){
                        //console.log(window['links']['cb_'+operation] );
                        window['cb'][operation](response.data);
                    }else{
                        console.log('cb function doesnt exist');
                    }
                    return true;
                }else{
                    console.log(response.error);
                    return false;
                }
            });
            
        }
    };

    function prepareDataForServer(formData){
        let tables = {},
            data = {};
        //console.clear();
        for(let item in formData){
            //console.log(item, formData[item]);
            let db = formData[item]['db'];
            let value = formData[item]['value'];
            //console.log('db', db);
            //console.log('value', value);
            if(tables[db['db_table']] == undefined){
                tables[db['db_table']] = {};
                data[db['db_table']] = {};
            }

            if(tables[db['db_table']][db['db_field']] == undefined){
                tables[db['db_table']][db['db_field']] = {};
                data[db['db_table']][db['db_field']] = {};
            }

            if(formData[item]['db']['db_field_unique']){
                data[db['db_table']][db['db_field']]['unique'] = true;
            }

            tables[db['db_table']][db['db_field']][item] = value;
        }

        for(let tableName in tables){
            let tableData = tables[tableName];
            for(let field in tableData){
                //console.log(field, tableData[field], Object.keys(tableData[field]).length);
                let len = Object.keys(tableData[field]).length;
                if(len == 1){
                    data[tableName][field]['value'] = tableData[field][field];
                }else{
                    data[tableName][field]['value'] = JSON.stringify(tableData[field]);
                }
            }
        }

        return data;
    }



    function getFormData(){
        let formData = {};
        let formValidationData = {};

        let formElement = document.querySelector('form');
        let formDataElements = formElement.querySelectorAll('input,textarea,select');
        console.log(formDataElements);
        formDataElements.forEach((formDataElement) => {
            //console.log(formDataElement.id);
            formData[formDataElement.id] = {};

            let value = defineValue(formDataElement);

            formValidationData[formDataElement.id] = {
                elRules : formDataElement.getAttribute('validation'),
                elValue : value
            };

            formData[formDataElement.id]['value'] = value;
            if(formDataElement.getAttribute('db') !== null){
                formData[formDataElement.id]['db'] = JSON.parse(formDataElement.getAttribute('db'));
            }
            
        });


        console.log(formData);
        console.log(formValidationData);
        
        let formValidationRules = validator.getFormValidationRules(formValidationData);
        //console.log(formValidationRules);
        //console.log('getFormValidationResult:' + getFormValidationResult(formValidationRules));

        if(!getFormValidationResult(formValidationRules)){
            showValidationResult(formValidationRules);
            return false;
        }else{
            showValidationResult(formValidationRules);
            return formData;
        }
    }



    function getFormValidationResult(formValidationRules){
        console.log('formValidationRules', formValidationRules);
        if(isObjectEmpty(formValidationRules)){
            return true;
        }
        //let formValidationResult = false;
        for(let el in formValidationRules){
            //console.log(formValidationRules[el]);
            if(!formValidationRules[el]['validationResult']){
                return false;
            }
        }
        return true;
    }



    function showValidationResult(formValidationRules){

        console.log(formValidationRules);
        document.querySelectorAll('form input.form_element_error').forEach((element) => {
            element.classList.remove('form_element_error');
            element.setAttribute('title', '');
        });

        if(isObjectEmpty(formValidationRules)){
            console.log('forms.showValidationResult nothing to do');
            return;
        }
        //document.querySelectorAll('form label.form_element_error').forEach((element) => {

        //formElement.classList.remove('form_element_error');
        //let formValidationResult = false;
        for(let el in formValidationRules){
            //let formElement = document.querySelector('div[div-name="'+el+'"]>label');
            let formElement = document.querySelector('form div[div-name="'+el+'"]>input');
            console.log(formValidationRules[el][0]);
            if(formValidationRules[el][0] !== true){

                
                formElement.classList.add('form_element_error');
                let errorText = '';
                for(let ruleNr in formValidationRules[el]['validationRules']){
                    if(formValidationRules[el]['validationRules'][ruleNr] !== true){
                        errorText+=formValidationRules[el]['validationRules'][ruleNr]+'\n';
                    }
                }
                formElement.setAttribute('title', errorText);
            }
            //console.log(formValidationRules[el]);

        }
    }

function defineValue(obj){
    console.log(obj);
    let value = '';
    const tagName = obj.tagName;
    //console.log(tagName);
    //console.log(obj.type);
    
    switch(tagName) {
        case 'INPUT':
            if(obj.type == 'text' || obj.type =='date' || obj.type == 'hidden' ){
                value = obj.value;
    
            }else if(obj.type == 'checkbox'){
                value = obj.checked;
            }
            break;
        case 'TEXTAREA':
            value = obj.value;
        case 'SELECT':
            value = obj.options[obj.selectedIndex].value;
            break;
        default:
            //value = '';
            alert('Element was not recognized');
    }

    return value;
}


async function showForms(){
    const html = await template.loadRawTemplateByName('forms.html');
    $('content').html(html);

    getForms();
}

async function getForms(){
    const forms = await fs.getFilesInFolder('forms');
    console.log(forms);

    let html = template.generateList({
        tpl : `<button class="w3-button w3-grey" onclick="forma.generateSQL('{%filename%}')">{%filename%}</button>`,
        data : forms
    });
    $('forms').html(html); 
}

//CREATE TABLE 'operations' ('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'symbol1' TEXT, 'symbol2' TEXT, 'operation' TEXT, 'qty' INTEGER, 'price' REAL,'timestamp' TEXT)
async function generateSQL(filename){
    const objForm = await importObjectFromFile('/config/forms/'+filename);
    console.log(objForm);
    let sql = {};

    for(let field in objForm){
        
            //console.log(field, objForm[field]);
        
        const db = objForm[field]['db'];
        if(db !== undefined){
            
            //const attributes = objForm[field]['attributes'];

            if(sql[ db['db_table'] ] == undefined){
                sql[ db['db_table'] ] = {}
            }

            db['db_type'] = db['db_type'].toUpperCase();
    
            sql[ db['db_table'] ][ db['db_field'] ] = `'${db['db_field']}' ${db['db_type']}`;
            if( db['db_field_unique'] !== undefined ){
                sql[ db['db_table'] ][ db['db_field'] ]+= ' '+db['db_field_unique'];
            }
        }
    }

    //console.log(sql);

    for(let table in sql){
        const tableData = sql[table];
        let tableSql = '';

        tableSql+= `CREATE TABLE '${table}' (`+Object.values(tableData).join(', ') + `)`;
        /*
        for(let field in tableData){
            $tableSql+= tableData[field]+','
        }
        */
        console.log(tableSql);
        $('#sqlite').text(tableSql);
    }
    
}


forma.getFormData = getFormData;
forma.defineValue = defineValue;
forma.submitForm = submitForm;
forma.getForms = getForms;
forma.showForms = showForms;
forma.generateSQL = generateSQL;
window.forma = forma;
})();