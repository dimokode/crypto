class Exchange {

    static getExchangePairsForAsset(asset){
        let exchangeAssets = cloneObject(config['exchangeAssets']);
        // console.log('exchangeAssets before', exchangeAssets);
        exchangeAssets = exchangeAssets.removeItemByValue(asset);
        // console.log('exchangeAssets after', exchangeAssets);

        return exchangeAssets;

    }
}