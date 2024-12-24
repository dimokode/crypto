const stablecoins = [
    'USDT', 'USDC', 'BUSD'
]

// const config = {
//     exchangeAssets : [
//         'USDT', 'USDC', 'BUSD', 'BTC', 'ETH'
//     ]
// }

class Config {

    static exchangeAssets = [
        'USDT', 'USDC', 'BUSD', 'BTC', 'ETH', 'BNB'
    ]

    static crossAssets = ['BTC', 'ETH']

    constructor(){
        this.config = {
            exchangeAssets: this.constructor.exchangeAssets,
            crossAssets: this.constructor.crossAssets
        }
    }

    getConfigurationData(config_id){
        return import('./config.' + config_id + '.js').then( response => {
            console.log(response.default);
            this.config['exchange'] = response.default;
            return this.config;

        });
        // console.log(config_binance.default);
        // this.config['exchange'] = config_binance.default;
    }
}

new Config().getConfigurationData('binance').then(response => {
    console.log(response);
    window.config = response;
})
// console.log(config);