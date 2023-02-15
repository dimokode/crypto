;(function(){

function tabs(){}

function open(tabId){
    document.querySelectorAll('div.tab').forEach( tab => {
        tab.style.display = 'none';
    })
    document.querySelector('div.tab#'+tabId).style.display = 'block';
}

function openSelect(elSelect){
   const selectedOptionValue = elSelect.options[elSelect.selectedIndex].value;
   const group = elSelect.getAttribute('group');
   //console.log(group);
   document.querySelectorAll('div#'+group+' div.tab').forEach( tab => {
       tab.style.display = 'none';
   });
   document.querySelector('div#'+group+' div.tab#'+selectedOptionValue).style.display = 'block';

}

tabs.open = open;
tabs.openSelect = openSelect;
window.tabs = tabs;
})();