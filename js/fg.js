;(function(){
    //form generator
    function fg(){}
    
    let rule = '';
    
    async function generate(obj){
        //console.log(obj);
        //console.log(fg.rule);
        //console.log(JSON.stringify(obj));
        //let visible = obj['visible'];
        /*
        if(obj['visible'] !== undefined && obj['visible'][fg.rule] === undefined){
            return '';
        }
        */
        let temp = document.createElement('div');
        let elDiv = document.createElement('div');
    
        try {
            //elDiv.setAttribute('data-name', obj['attributes']['name']); 
            elDiv.setAttribute('div-name', obj['attributes']['name']);
        }catch(err){
            console.log('Error was catched:');
            console.log(obj);
        }
    
        if(obj['props'] !== undefined){
            for(let propName in obj['props']){
                elDiv.setAttribute(propName, obj['props'][propName]);
            }
        }

        if(obj['parent'] !== undefined){
            for(let propName in obj['parent']){
                elDiv.setAttribute(propName, obj['parent'][propName]);
            }
        }
//APP
        if(obj['app'] !== undefined){
            let app = document.createElement('app');
            if(obj['app']['attributes'] !== undefined){
                for(let attrName in obj['app']['attributes']){
                    app.setAttribute(attrName, obj['app']['attributes'][attrName]);
                }
            }
            //app.innerHTML = await template.loadRawTemplateFromFile(obj['app']['template']);
            
            const response = await template.loadRawTemplateFromFile(obj['app']['template']);
            console.log(response);
            if(response.success){
                app.innerHTML = response.content;
                //app.innerHTML = 'adsdadasd';
            }else{
                console.log(response.error);
            }
            
            
            elDiv.append(app);
        }
//APP end    
        
        let element = obj['element'];
        
        let el = document.createElement(element);

        if(obj['attributes']['type'] == 'date' && obj['attributes']['value'] !== undefined && obj['attributes']['value'] != ''){
            obj['attributes']['value'] = obj['attributes']['value'].replace(/^(\d{2}).(\d{2}).(\d{4})$/, '$3-$2-$1');
        }
    
        if(obj['attributes']['type'] == 'checkbox' && (obj['attributes']['value'] === true || obj['attributes']['value'] === 1)){
            //obj['attributes']['checked'] = obj['attributes']['value'];
            obj['attributes']['checked'] = true;
            //obj['attributes']['value'] = null;
            //console.log(JSON.stringify(obj));
        }

        if(obj.eventListeners !== undefined){
            //console.log('processor', obj['processor']);
            for(let event in obj.eventListeners){
                el.setAttribute(event, obj.eventListeners[event]);
            }
        }

        //DB attributes
        if(obj['db'] !== undefined){
            el.setAttribute( 'db', JSON.stringify(obj['db']) ); 
        }
    
        if(element == 'textarea' || element == 'button'){
            //console.log('TEXTAREA');
            //console.log(obj);
            el.innerHTML = (obj['attributes']['value']!==undefined) ? obj['attributes']['value'] : '';
            delete obj['attributes']['value'];
        }
    
        for(let attr in obj['attributes']){
            //console.log(attr + '=>' + obj['attributes'][attr]);
            el.setAttribute( attr, obj['attributes'][attr] );
        }
    
        if(obj['dependency'] !== undefined){
            el.setAttribute('dependency-field', obj['dependency']['field']);
            el.setAttribute('dependency-value', obj['dependency']['value']);
        }
    
        if(obj['options'] !== undefined){
            for(let optionNr in obj['options']){
                let elOption = document.createElement('option');
                for(let oAttr in obj['options'][optionNr]){
                    //console.log(oAttr + '=>' + obj['options'][optionNr][oAttr]);
                    if(oAttr == 'attributes'){
                        for(let dataAttr in obj['options'][optionNr]['attributes']){
                            elOption.setAttribute(dataAttr, obj['options'][optionNr]['attributes'][dataAttr]);
                        }
                    }else{
                        elOption[oAttr] = obj['options'][optionNr][oAttr];
                    }
                    
                    
                }
    
                el.append(elOption);
            }
        }
    
        //elDiv.append(generateLabel(obj['label']));
        /*
        let labelText = dict.get(obj['attributes']['name']);
        if(!labelText){
            labelText = obj['attributes']['name'];
        }
        elLabel = generateLabel(labelText);
        */
       
        //elLabel = generateLabel(obj['attributes']['name']);
        if(obj['attributes'] !== undefined){
            if(obj['attributes']['type'] != 'hidden'){
                if(obj['label'] !== undefined){
                    elLabel = generateLabel(obj['label']);
                    elDiv.append(elLabel);
                }else{
                    //elLabel = generateLabel(obj['attributes']['name']);
                }
                
            }   
        }
        
    
        if(obj['attributes']['type'] == 'hidden'){
            elDiv.classList.add('hidden');
            //elLabel = generateLabel(obj['attributes']['id'], true);
        }
    //    elDiv.append(generateLabel(obj['attributes']['id']));
        
        elDiv.append(el);
        temp.append(elDiv);
        let html = temp.innerHTML;
        //console.log(html);
        //document.getElementById('container').append(elDiv);
        return html;
    
    }
    
    
    function generateLabel(labelText, hidden = false){
        if(labelText !== undefined){
            let elLabel = document.createElement('label');
            elLabel.textContent = labelText;
            if(hidden) elLabel.classList.add('hidden');
            //elDiv.append(elLabel);
            return elLabel;
        }
        return '';
    }
    
    function test(){
        alert('TESSSSSTSTSTTSTSTSTSTSTSTST');
    }
    

    function generateOptionsObject(arrKeys){
        console.log(arrKeys);
        let objOptions = {};
        objOptions[null] = {
            text : 'select',
            attributes : {
                value : null,
                selected : true
            }
        }
        arrKeys.forEach( (item, index) => {
            //console.log(item);
            objOptions[index] = {
                text : item,
                attributes : {
                    value : item
                }
            }
        });
        return objOptions;
    }
    
    fg.generate = generate;
    fg.rule = rule;
    fg.test = test;
    fg.generateOptionsObject = generateOptionsObject;
    window.fg = fg;
    })();