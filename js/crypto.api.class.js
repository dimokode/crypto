class CryptoAPI {
    constructor(BaseObject){
        this.BaseObject = BaseObject;
    }

    retrieveOrdersForPair(pair){
        const obj = this.BaseObject;
        console.log('CryptoAPI', 'retrieveOrdersForPair');
        // return new Promise(function(resolve, reject){
        //     resolve(obj.retrieveOrdersForPair(pair));
        // });
        return obj.retrieveOrdersForPair(pair);
        // obj.retrieveOrdersForPair(pair).then(response => {
        //     console.log(response);
        // }).catch(error => {
        //     console.log(error);
        // })
    }
}