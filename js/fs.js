;(function(){

function fs(){}

function getFilesInFolder(foldername){
    return common.sendAjax({
        controller : 'dbf',
        action : 'getFilesInFolder',
        foldername : foldername,
        /*
        options : {
            'fileExtension' : 'txt',
        }
        */
    }).then(response => {
        if(response.success){
            return response.arrFiles
        }else{
            console.log(response.error)
            return false
        }
    })
}


function saveDataToFile(obj){
    /*
    folder: str = /history/xxx
    filenema: str
    data: object
    */
    obj.controller = 'dbf';
    obj.action = 'saveDataToFile';
    return common.sendAjax(obj).then( response => {
        //console.log( response );
        return response;
    })
}


function readDataFromFile(obj){
    /*
    folder: str = /history/xxx
    filenema: str
    */
    obj.controller = 'dbf';
    obj.action = 'readDataFromFile';
    return common.sendAjax(obj).then( response => {
        //console.log( response );
        return response;
    })
}


function saveJSONToFile(filename, obj){
    
}

fs.getFilesInFolder = getFilesInFolder;
fs.saveJSONToFile = saveJSONToFile;
fs.saveDataToFile = saveDataToFile;
fs.readDataFromFile = readDataFromFile;
window.fs = fs;
})();