class DummyApi {

    async retrieveOrdersForPair(pair){
        // throw new Error('aaa');
        const savedOrders = await this.getSavedOrdersForPair(pair);
        let lastOrders = await this.getLastOrdersForPair(pair);
        // if(lastOrders == []){
        //     lastOrders = false;
        // } 
        
        let actualOrders;
        let result = 'equal';
        let saveResult = false;

        if(savedOrders && lastOrders){
            actualOrders = _.uniq(savedOrders.concat(lastOrders), false, 'id');

            if(savedOrders.length != actualOrders.length){
                result = 'not equal';
                if(await this.backupFile(pair)){
                    console.log('File has been successfully backuped!');
                }else{
                    console.error('Something gone wrong by file backup!');
                }
            }
            
        }else if(!savedOrders && lastOrders){
            actualOrders = lastOrders;
        }

        if(actualOrders){
            saveResult = await this.saveOrders(pair, actualOrders);
            // debugger
            if(saveResult.success){
                console.log('Data has been successfully saved!');
            }else{
                console.log('Error: ' + saveResult.error);
            }
        }else{
            console.log('Nothing to save');
        }

        return {
            pair,
            result,
            saveResult,
            savedOrders,
            lastOrders,
            actualOrders
        };
    }

    saveOrders(pair, data){
        const objRequest = {
            controller : 'testapi',
            action : 'saveOrdersForPair',
            pair,
            data
        }

        return common.sendAjax(objRequest).then(response => {
            return response;
        });  
    }

    backupFile(pair){
        const objRequest = {
            controller : 'testapi',
            action : 'backupFile',
            pair : pair,
        }

        return common.sendAjax(objRequest).then(response => {
            return response.success;
        });       
    }

    getSavedOrdersForPair(pair){
        const objRequest = {
            controller : 'testapi',
            action : 'retrieveOrdersForPair',
            pair : pair
        }

        return common.sendAjax(objRequest).then(response => {
            if(response.success){
                return response.data;
            }else{
                console.error(response.error);
                return false;
            }
        });
    }

    getLastOrdersForPair(pair){
        const objRequest = {
            controller : 'testapi',
            action : 'getLastOrdersForPair',
            pair : pair
        }

        return common.sendAjax(objRequest).then(response => {
            if(response.success){
                return response.data.length > 0 ? response.data : false;
            }else{
                console.error(response.error);
                return false;
            }
        });
    }

}