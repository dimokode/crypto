<?

class Pairs {
    public static function getPairs(){
        //$ans['success'] = false;

        //$path_to_folder = PATH_TO_DB."/pairs.tdb";
        //$ans = fs::getJSONFromFile(PATH_TO_DB, "pairs.tdb");
        //$sql = "SELECT symbol1, symbol2, SUM(qty) as sum_qty, operation, AVG(price) as avg_price FROM operations GROUP BY symbol1, symbol2, operation";
        $sql = "SELECT symbol1, symbol2, qty, operation, price FROM operations";
        $sth = DB::query($sql);
        $r = DB::fetchAll($sth);
        if(sizeof($r) > 0){
            $ans['data'] = $r;
        }else{
            $ans['data'] = [];
        }
        
        $ans['success'] = true;
        //$ans['data'] = "{some shit}";
        return $ans;
    }

    public static function savePairs($params){
        $params = json_decode($params, true);
        $jsonData = $params['jsonData'];
        $ans = fs::saveJSONToFile(PATH_TO_DB, "pairs.tdb", $jsonData);
        
        //$ans['success'] = true;
        //$ans['data'] = "{some shit}";
        return $ans;
    }

    public static function getPrice($params){
        $ans['success'] = false;
        $params = json_decode($params, true);
        $pair = $params['pair'];

        $data = file_get_contents('https://api.binance.com/api/v3/ticker/price?symbol='.$pair);
        if($data){
            $ans['success'] = true;
            $ans['data'] = $data;
        }else{
            $ans['error'] = "Error by fetching price by API";
        }
        return $ans;
    }
}

?>