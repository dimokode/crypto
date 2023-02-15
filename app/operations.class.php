<?

class Operations {

    static public function getOperations(){
        //$ans = fs::getJSONFromFile(PATH_TO_DB, "operations.tdb");
        $sql = "SELECT * FROM operations ORDER BY timestamp DESC";
        $sth = DB::query($sql);
        $r = DB::fetchAll($sth);
        if(sizeof($r) > 0){
            $ans['data'] = $r;
        }else{
            $ans['data'] = [];
        }
        $ans['success'] = true;
        return $ans;
    }

    static public function addToDB($params){
        $params = json_decode($params, true);
        $jsonData = $params['jsonData'];

        $sql = "INSERT INTO operations(symbol1, symbol2, operation, qty, price, timestamp) VALUES(:symbol1, :symbol2, :operation, :qty, :price, :timestamp)";
        $dbdata = DB::prepareArray2($jsonData);
        $lastInsert = DB::insertPDO($sql, $dbdata);
        if($lastInsert){
            $ans['success'] = true;
            $ans['lastInsert'] = $lastInsert;
        }else{
            $ans['success'] = false;
            $ans['error'] = "Error addTODB";
        }
        return $ans;
    }


}

?>