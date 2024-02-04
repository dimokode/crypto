class PopupInsertedContentType{

    html(html){
        if(this.selector){
            this.block.querySelector(this.selector).innerHTML = html;
        }else{
            this.block.innerHTML = html;
        }
        
        return this;
    }

}


class PopupInsertContent{
    /*
    insert(html){
        if(this.selector){
            this.block.querySelector(this.selector).innerHTML = html;
        }else{
            this.block.innerHTML = html;
        }
    }
    */


    insert(html){
        try{
            let el;
            if(this.selector){
                el = this.block.querySelector(this.selector);
            }else{
                el = this.block;
            }
            
            

            if(el !== null){
                console.log(el, this.selector);    
                const htmlType = typeof html;
                console.log('htmlType', htmlType);

                if(htmlType == 'string' || htmlType == 'number'){
                    switch(this.insertionType){
                        case 'insert':
                            el.innerHTML = html;
                            break;
                        case 'after':
                            el.insertAdjacentHTML('beforeend', html);
                            break;
                        case 'before':
                            el.insertAdjacentHTML('afterbegin', html);
                            break;
                    }
                }else if(htmlType == 'object'){
                    switch(this.insertionType){
                        case 'insert':
                            el.replaceWith(html);
                            break;
                        case 'after':
                            el.append(html);
                            break;
                        case 'before':
                            el.prepend(html);
                            break;
                    }
                }



                

            }else{
                console.warn("selector doesn't exist", this.selector);
            }
            
        }catch(e){
            console.log(e);
            //console.log('selector', selector);
        }
    }
}



//class PopupActions extends PopupInsertedContentType{
class PopupActions extends PopupInsertContent{

    insert(html, selector){
        this.selector = selector;
        this.insertionType = 'insert';
        super.insert(html);
        return this;
    }

    before(html, selector){
        this.selector = selector;
        this.insertionType = 'before';
        super.insert(html);
        return this;
    }

    after(html, selector){
        this.selector = selector;
        this.insertionType = 'after';
        super.insert(html);
        return this;
    }

}




class Popup2 extends PopupActions{

    constructor(popupId){
        super();
        if(popupId == undefined){
            this.popupId = 'popup_'+Date.now();
        }
        
        let html = 
`
<button class="w3-button" style="float:right;" onclick="popup.hide('${this.popupId}');">X</button>
header
<popup-header></popup-header>
header-end
<br>
body
<popup-body></popup-body>
body-end
`
        let popup = document.createElement('popup');
        popup.id = this.popupId;
        popup.insertAdjacentHTML('beforeend', html);
        document.body.append(popup);
        return this;
    }


    show(){
        const popupElement = document.querySelector(`popup#${this.popupId}`);
        popupElement.style.display = 'block';
        return this;
    }

    header(){
        //this.insertType =insertType;
        this.block = document.querySelector(`popup#${this.popupId} popup-header`);
        return this;
    }

    body(){
        //this.insertType =insertType;
        this.block = document.querySelector(`popup#${this.popupId} popup-body`);
        return this;
    }

}

