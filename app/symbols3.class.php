<?

class Symbols3 {
    const BALANCES_FILENAME = "balances.txt";
    const PRICES_FILENAME = "prices.txt";

    /*
    static public function getAccount(){
        
        $data = Binance::getAccount();
        $ans = fs::saveContentToFile(PATH_TO_LOGS, "account.txt", json_encode($data));
        if($ans['success']){
            $ans = fs::getJSONFromFile(PATH_TO_LOGS, "account.txt");
        }
        
        return $ans;
    }
    
    static public function getBalances($params){
        $params = json_decode($params, true);
        $fromfile = $params['fromfile'];
        //if(!FROM_FILE){
        if(!$fromfile){
            $data = Binance::getBalances();
            $ans = fs::saveContentToFile(PATH_TO_LOGS, self::BALANCES_FILENAME, json_encode($data));
            if($ans['success']){
                $ans = fs::getJSONFromFile(PATH_TO_LOGS, self::BALANCES_FILENAME);
            }
        }else{
            $ans = fs::getJSONFromFile(PATH_TO_LOGS, self::BALANCES_FILENAME);
        }

        return $ans;
    }
*/


    static public function getBalances(){
        $ans['success'] = true;
        $ans['data'] = [];

        $path_to_folder = PATH_TO_LOGS."/balances/";
        $response = fs::getFilesInFolder($path_to_folder);
        if($response['success']){
            $arrFiles = $response['arrFiles'];
            //wrlog($arrFiles);
            $filesCount = sizeof($arrFiles);
            if($filesCount > 1){
                $actualFile = $arrFiles[$filesCount-1];
                $previousFile = $arrFiles[$filesCount-2];
            }elseif($filesCount == 1){
                $actualFile = $arrFiles[$filesCount-1];
                $previousFile = false;
            }else{
                $actualFile = false;
                $previousFile = false;
                return $ans;
            }

            if($actualFile){
                $filename = $actualFile['filename'];
                $ans['actual'] = self::getBalance($filename);
                $ans['actual']['timestamp'] = $actualFile['timestamp'];
                $ans['data']['actual'] = $ans['actual'];
                unset($ans['actual']);
            }
            if($previousFile){
                $filename = $previousFile['filename'];
                $ans['previous'] = self::getBalance($filename);
                $ans['previous']['timestamp'] = $actualFile['timestamp'];
                $ans['data']['previous'] = $ans['previous'];
                unset($ans['previous']);
            }
        }
        return $ans;
    }
    

    static public function getBalance($filename){
        $path_to_folder = PATH_TO_LOGS."/balances/";

        try{
            $ans = fs::getJSONFromFile($path_to_folder, $filename);
        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }

    static public function getPrices(){
        $ans['success'] = true;
        $ans['data'] = [];

        $path_to_folder = PATH_TO_LOGS."/prices/";
        $response = fs::getFilesInFolder($path_to_folder);
        if($response['success']){
            $arrFiles = $response['arrFiles'];
            $filesCount = sizeof($arrFiles);
            if($filesCount > 1){
                $actualFile = $arrFiles[$filesCount-1];
                $previousFile = $arrFiles[$filesCount-2];
            }elseif($filesCount == 1){
                $actualFile = $arrFiles[$filesCount-1];
                $previousFile = false;
            }else{
                $actualFile = false;
                $previousFile = false;
                return $ans;
            }

            if($actualFile){
                $filename = $actualFile['filename'];
                $ans['actual'] = self::getPrice($filename);
                $ans['actual']['timestamp'] = $actualFile['timestamp'];
                $ans['data']['actual'] = $ans['actual'];
                unset($ans['actual']);
            }
            if($previousFile){
                $filename = $previousFile['filename'];
                $ans['previous'] = self::getPrice($filename);
                $ans['previous']['timestamp'] = $actualFile['timestamp'];
                $ans['data']['previous'] = $ans['previous'];
                unset($ans['previous']);
            }
        }
        return $ans;
    }


    static public function getPrice($filename){
        $path_to_folder = PATH_TO_LOGS."/prices/";

        try{
            $ans = fs::getJSONFromFile($path_to_folder, $filename);
        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }
        
        return $ans;
    }


    
    static public function getExchangeInfo(){
        $path_to_folder = PATH_TO_LOGS;

        try{
            $ans = fs::getJSONFromFile($path_to_folder, "exchangeInfo.txt");
        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }
        
        return $ans;
    }

    static public function saveExchangePairs($params){
        $params = json_decode($params, true);
        $jsonData = json_encode($params['data']);

        return fs::saveJSONToFile(PATH_TO_LOGS, 'exchangePairs.txt', $jsonData);
    }

    static public function getPairsForSymbol($params){
        $params = json_decode($params, true);
        $symbol = $params['symbol'];

        return fs::getJSONFromFile(PATH_TO_LOGS, "exchangePairs.txt", $symbol);
    }

    static public function getOrdersByPair($params){
        $params = json_decode($params, true);
        $pair = $params['pair'];

        $ans = fs::getJSONFromFile(PATH_TO_LOGS."/orders/", $pair.".txt");
        
        return $ans;
    }

    static public function getOpenOrdersByPair($params){
        $params = json_decode($params, true);
        $pair = $params['pair'];
        $ans = fs::getJSONFromFile(PATH_TO_LOGS."/openOrders/", $pair.".txt");
        return $ans;
    }

    

    static public function test(){
        $ans['success'] = false;

        try{
            //$ans = fs::getJSONFromFile(PATH_TO_LOGS, "balances3.txt");
            throw new Exception('xxxxxxxxxxxxx');
        }catch(Exception $e){
            //$ans['error'] = 'asdasdsdds';
            $ans['error'] = $e->getMessage();
        }finally{
            
        }

        $ans['msg'] = "before end";
        
        return $ans;
        
    }


    static public function retrieveBalancesFromBinance(){
        $ans['success'] = false;

        try{
            $data = Binance::getBalances();
            $path_to_folder = PATH_TO_LOGS."/balances/";
            $filename = time().'.txt';
    
            $path_to_file = $path_to_folder.$filename;
            $ans = fs::saveContentToFile($path_to_file, json_encode($data));

        }catch(Exception $e){
            $data = false;
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }




    static public function retrievePricesFromBinance(){
        $ans['success'] = false;
        try{
            $data = Binance::getPrices();
            $path_to_folder = PATH_TO_LOGS."/prices/";
            $filename = time().'.txt';
    
            $path_to_file = $path_to_folder.$filename;
            $ans = fs::saveContentToFile($path_to_file, json_encode($data));

        }catch(Exception $e){
            $data = false;
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }


    static public function retrieveExchangeInfoFromBinance(){
        $ans['success'] = false;
        try{
            $data = Binance::exchangeInfo();
            $path_to_folder = PATH_TO_LOGS."/exchangeInfo/";
            $filename = time().'.txt';
    
            $path_to_file = $path_to_folder.$filename;
            $ans = fs::saveContentToFile($path_to_file, json_encode($data));

        }catch(Exception $e){
            $data = false;
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }
    


    static public function retrieveOrdersFromBinanceForPair($params){
        $params = json_decode($params, true);
        $pair = $params['pair'];
        $ans['success'] = false;
        $ans['pair'] = $pair;
        
        try {
            $data = Binance::getOrdersByPair($pair);
   
            wrlog($pair, 'aaa.txt');
            wrlog($data, 'aaa.txt');
            $path_to_folder = PATH_TO_LOGS."/orders/";
            $path_to_file = $path_to_folder.$pair.".txt";

            if($data){
                $ans = array_merge( $ans, fs::saveContentToFile($path_to_file, json_encode($data)) );
                wrlog("if data", 'aaa.txt');
                // if($ans['success']){
                    // $ans['success'] = true;
                    // $ans = fs::getJSONFromFile($path_to_folder, $pair.".txt");
                // }
            }
            else{
                // $ans['success'] = false;
                $ans['error'] = "no data for the pair $pair";
            }

        } catch(Exception $e){
            //arrlog($e, 'aaa.txt');
            //wrlog($e->getMessage(), 'bbb.txt');
            $data = false;
            $ans['error'] = $e->getMessage();
        }

        wrlog($ans, 'aaa.txt');
        return $ans;     
    }


    static public function retrieveOpenOrdersFromBinanceForPair($params){
        $params = json_decode($params, true);
        $pair = $params['pair'];
        if(!$pair){
            return [
                'success' => false,
                'error' => "Symbol is missing"
            ];
        }
        $ans['success'] = false;
        
        try{
            $data = Binance::getOpenOrdersByPair($pair);
        }catch(Exception $e){
            //arrlog($e, 'aaa.txt');
            //wrlog($e->getMessage(), 'bbb.txt');
            $data = false;
            $ans['error'] = $e->getMessage();
        }
        
        //arrlog($data, 'aaa.txt');
        //wrlog('aaa', 'aaa.txt');
        $path_to_folder = PATH_TO_LOGS."/openOrders/";
        $path_to_file = $path_to_folder.$pair.".txt";
        if($data){
            $ans = fs::saveContentToFile($path_to_file, json_encode($data));
            if($ans['success']){
                $ans = fs::getJSONFromFile($path_to_folder, $pair.".txt");
            }
        }else{
            //$ans['success'] = false;
            //$ans['error'] = 'Error retrieveOrdersFromBinanceForPair';
        }

        $ans['pair'] = $pair;
        return $ans;     
    }


    static public function retrieveWithdrawHistoryFromBinance($params){
        $params = json_decode($params, true);
        $symbol = isset($params['symbol']) ? $params['symbol'] : null;

        try{
            //$data = Binance::myTrades($symbol);
            $ans['success'] = true;
            $ans['data'] = Binance::withdrawHistory();
        }catch(Exception $e){
            //arrlog($e, 'aaa.txt');
            //wrlog($e->getMessage(), 'bbb.txt');
            $ans['success'] = false;
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }


    static public function retrieveDepositHistoryFromBinance($params){
        $params = json_decode($params, true);
        $symbol = isset($params['symbol']) ? $params['symbol'] : null;

        try{
            //$data = Binance::myTrades($symbol);
            $ans['success'] = true;
            $ans['data'] = Binance::withdrawHistory();
        }catch(Exception $e){
            //arrlog($e, 'aaa.txt');
            //wrlog($e->getMessage(), 'bbb.txt');
            $ans['success'] = false;
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }



    static public function getTrades($params){
        $params = json_decode($params, true);
        $symbol = $params['symbol'];

        try{
            //$data = Binance::myTrades($symbol);
            $ans['success'] = true;
            $ans['data'] = Binance::myTrades($symbol);
        }catch(Exception $e){
            //arrlog($e, 'aaa.txt');
            //wrlog($e->getMessage(), 'bbb.txt');
            $ans['success'] = false;
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }
}

?>