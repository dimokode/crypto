<?

class Symbols2 {

    /*
    static public function getAccount(){
        
        $data = Binance::getAccount();
        $ans = fs::saveContentToFile(PATH_TO_LOGS, "account.txt", json_encode($data));
        if($ans['success']){
            $ans = fs::getJSONFromFile(PATH_TO_LOGS, "account.txt");
        }
        
        return $ans;
    }
    */
    static public function getBalances(){
        if(!FROM_FILE){
            $data = Binance::getBalances();
            $ans = fs::saveContentToFile(PATH_TO_LOGS, "balances.txt", json_encode($data));
            if($ans['success']){
                $ans = fs::getJSONFromFile(PATH_TO_LOGS, "balances.txt");
            }
        }else{
            $ans = fs::getJSONFromFile(PATH_TO_LOGS, "balances.txt");
        }

        return $ans;
    }


    static public function getPrices(){
        if(!FROM_FILE){
            $data = Binance::getPrices();
            $ans = fs::saveContentToFile(PATH_TO_LOGS, "prices.txt", json_encode($data));
            if($ans['success']){
                $ans = fs::getJSONFromFile(PATH_TO_LOGS, "prices.txt");
            }
        }else{
            $ans = fs::getJSONFromFile(PATH_TO_LOGS, "prices.txt");
        }
        
        return $ans;
    }

    static public function getOrdersByPair($params){
        
        $params = json_decode($params, true);
        $pair = $params['pair'];

        if(!FROM_FILE){
            $data = Binance::getOrdersByPair($pair);
            $ans = fs::saveContentToFile(PATH_TO_LOGS, $pair.".txt", json_encode($data));
            if($ans['success']){
                $ans = fs::getJSONFromFile(PATH_TO_LOGS, $pair.".txt");
            }
        }else{
            $ans = fs::getJSONFromFile(PATH_TO_LOGS, $pair.".txt");
        }
    /*
        $data = Binance::getOrdersByPair($pair);
        $ans = fs::saveContentToFile(PATH_TO_LOGS, $pair.".txt", json_encode($data));
        if($ans['success']){
            $ans = fs::getJSONFromFile(PATH_TO_LOGS, $pair.".txt");
        }
    */
        

        return $ans;
    }

}

?>