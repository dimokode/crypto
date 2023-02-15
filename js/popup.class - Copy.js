class Popup{
    constructor(obj = {}){
        let popupId = 'popup_'+Date.now();
        this.id = popupId;

        let html = 
`
<button class="w3-button" style="float:right;" onclick="Popup.hide(this);">X</button>
<popup-content></popup-content>
`
        let popup = document.createElement('popup');
        popup.id = popupId;
        //popup.classList.add('popup');
        popup.insertAdjacentHTML('beforeend', html);
        document.body.append(popup);
    }

    static hide(el){
        el.parentElement.remove();
    }

    show(){
        const popupElement = document.querySelector(`popup#${this.id}`);
        popupElement.style.display = 'block';
    }


    addContent(html, insertTag = undefined){
        if(insertTag == undefined){
            document.querySelector(`popup#${this.id}>popup-content`).insertAdjacentHTML('beforeend', html);
        }else{
            document.querySelector(`popup#${this.id}>popup-content>${insertTag}`).innerHTML = html;
        }
    }


    replaceTags(objTags){
        const popupElement = document.querySelector(`popup#${this.id}`);
        let popupContentElement = popupElement.querySelector('popup-content');
        let popupContent = popupContentElement.innerHTML;
        popupContent = template.generateByTemplate({
            tpl : popupContent,
            tags : objTags 
        });

        popupContentElement.innerHTML = popupContent;
    }

    changeTagContent(tagname, value){
        const popupElement = document.querySelector(`popup#${this.id}`);
        let popupContentElement = popupElement.querySelector('popup-content');
        template.changeTagContent(popupContentElement, tagname, value);
    }

}