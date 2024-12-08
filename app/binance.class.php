<?

//require APP_DIR.'/php-binance-api/php-binance-api.php';
//require APP_DIR.'/php-binance-api/vendor/autoload.php';

class Binance {
    
    
    static private function getApiConnection(){
        return new Binance\API(API_KEY, SECRET_KEY);
    }

    static public function getServerTime(){
        $api = self::getApiConnection();
        return $api->time();
    }

    //Get current account information.
    static public function getAccount(){
        $api = self::getApiConnection();
        $api->useServerTime();
        $account = $api->account();
        return $account;
    }

    static public function getPrices(){
        $api = self::getApiConnection();
        $api->useServerTime();
        return $api->prices();
    }

    static public function getBalances(){
        $api = self::getApiConnection();
        $api->useServerTime();
        return $api->balances();
    }

    // in my case PAIR and SYMBOL is the same meaning!!!
    static public function getOrdersByPair($pair){
        $api = self::getApiConnection();
        $api->useServerTime();
        //return $api->orders($pair);
        //return $api->aggTrades($pair);
        return $api->history($pair);
    }
    
    static public function getOpenOrdersByPair($pair){
        $api = self::getApiConnection();
        $api->useServerTime();
        return $api->openOrders($pair);
    }

    //EXPERIMENTAL
    static public function myTrades($symbol){
        $api = self::getApiConnection();
        $api->useServerTime();
        //return $api->orders($pair);
        //return $api->aggTrades($pair);
        return $api->history($symbol);
    }

    static public function exchangeInfo(){
        $api = self::getApiConnection();
        $api->useServerTime();
        return $api->exchangeInfo();
    }


    static public function withdrawHistory(){
        $api = self::getApiConnection();
        $api->useServerTime();
        return $api->withdrawHistory();
        /*
        if($symbol != null){
            return $api->withdrawHistory($symbol);    
        }else{
            return $api->withdrawHistory();
        }
        */
        
    }

    static public function depositHistory(){
        $api = self::getApiConnection();
        $api->useServerTime();
        return $api->depositHistory();
    }

    static public function getHistoricalDataForSymbol($symbol, $timeframe, $startTime){
        $api = self::getApiConnection();
        $api->useServerTime();
        // return $api->candlesticks($symbol, $timeframe, 1000, 1502928000000);
        return [
            'data' => $api->candlesticks($symbol, $timeframe, 1000, $startTime),
            // 'xMbxUsedWeight' => $api->getXMbxUsedWeight(),
            // 'getXMbxUsedWeight1m' => $api->getXMbxUsedWeight1m()
        ];
    }

}


?>