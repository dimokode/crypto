class popup{

    //static id = 'aaa';
    static new(popupId){
        
        if(popupId == undefined){
            popupId = 'popup_'+Date.now();
        }
        
        //this.id = popupId;

        let html = 
`
<button class="w3-button" style="float:right;" onclick="popup.hide('${popupId}');">X</button>
<popup-content></popup-content>
<popup-header></popup-header>
<popup-body></popup-body>
`
        let popup = document.createElement('popup');
        popup.id = popupId;
        //popup.classList.add('popup');
        popup.insertAdjacentHTML('beforeend', html);
        document.body.append(popup);
        return popupId;
    }




    static hide(popupId){
        document.querySelector(`popup#${popupId}`).remove();
    }

    static show(popupId){
        if(!popupId){
            console.error('popupId is not defined');
            return
        }
        const popupElement = document.querySelector(`popup#${popupId}`);
        popupElement.style.display = 'block';
    }


    static addContent(popupId, html, insertTag = undefined){
        //console.log(typeof html);
        //return
        if(insertTag == undefined){
            if(typeof html == 'string'){
                document.querySelector(`popup#${popupId}>popup-content`).insertAdjacentHTML('beforeend', html);
            }else if(typeof html == 'object'){
                document.querySelector(`popup#${popupId}>popup-content`).append(html);
            }
        }else{
            if(typeof html == 'string'){
                document.querySelector(`popup#${popupId}>popup-content>${insertTag}`).innerHTML = html;
            }
        }
    }

    /*
    static addContentBySelector(popupId, html, selector){
        document.querySelector(`popup#${popupId}>popup-content ${selector}`).innerHTML = html;
    }
    */




    static addContentToHeader(popupId, selector, html){
        try{
            const el = document.querySelector(`popup#${popupId} #popup-header ${selector}`);
            if(el){
                //el.innerHTML = html;
                el.insertAdjacentHTML('beforeend', html);
            }else{
                console.warn("selector doesn't exist", selector);
            }
            
        }catch(e){
            console.log(e);
            console.log('selector', selector);
        }
    }



    static addContentToBody(popupId, selector = '', html){
        try{
            const el = document.querySelector(`popup#${popupId} #popup-body ${selector}`);
            if(el){
                //el.innerHTML = html;
                if(typeof html == 'string'){
                    el.insertAdjacentHTML('beforeend', html);
                }else if(typeof html == 'object'){
                    el.append(html);
                }
                
            }else{
                console.warn("selector doesn't exist", selector);
            }
            
        }catch(e){
            console.log(e);
            console.log('selector', selector);
        }
    }


    static replaceTags(popupId, objTags){
        const popupElement = document.querySelector(`popup#${popupId}`);
        let popupContentElement = popupElement.querySelector('popup-content');
        let popupContent = popupContentElement.innerHTML;
        popupContent = template.generateByTemplate({
            tpl : popupContent,
            tags : objTags 
        });

        popupContentElement.innerHTML = popupContent;
    }

    static changeTagContent(popupId, tagname, value){
        const popupElement = document.querySelector(`popup#${popupId}`);
        let popupContentElement = popupElement.querySelector('popup-content');
        template.changeTagContent(popupContentElement, tagname, value);
    }



}