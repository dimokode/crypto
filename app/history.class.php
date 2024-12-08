<?

class History {

    static public function getHistoricalDataForSymbol($params){
        $params = json_decode($params, true);
        $symbol = $params['symbol'];
        $timeframe = $params['timeframe'];
        $startTime = $params['startTime'];
        $ans['success'] = false;

        try{
            // $ans['data'] = Binance::getHistoricalDataForSymbol($symbol, $timeframe, $startTime);
            $response = Binance::getHistoricalDataForSymbol($symbol, $timeframe, $startTime);
            $ans['data'] = $response['data'];
            // $ans['xMbxUsedWeight'] = $response['xMbxUsedWeight'];
            // $ans['getXMbxUsedWeight1m'] = $response['getXMbxUsedWeight1m'];
            $ans['success'] = true;
        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }
        
        return $ans;


    }

    static public function getServerTime(){
        $ans['success'] = false;
        try{
            $response = Binance::getServerTime();
            $ans['server_time'] = $response['serverTime'];
            $ans['success'] = true;
        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }

}

?>