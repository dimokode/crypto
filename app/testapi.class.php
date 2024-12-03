<?

class TestApi {

    static public function retrieveOrdersForPair($params){
        $params = json_decode($params, true);
        $pair = $params['pair'];
        $ans['success'] = false;
        $ans['pair'] = $pair;

        $path_to_folder = PATH_TO_LOGS."/orders/";
        $filename = $pair.".txt";

        try{
            $data = fs::getJSONFromFile($path_to_folder, $filename)['data'];
            $ans['data'] = $data;
            $ans['success'] = true;

        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }


    static public function getLastOrdersForPair($params){
        $params = json_decode($params, true);
        $pair = $params['pair'];
        $ans['success'] = false;
        $ans['pair'] = $pair;

        $path_to_folder = PATH_TO_FAKEDATA."/orders/";
        $filename = $pair.".txt";

        try{
            $data = Binance::getOrdersByPair($pair);
            // $data = fs::getJSONFromFile($path_to_folder, $filename)['data'];
            $ans['data'] = $data;
            $ans['success'] = true;

        }catch(Exception $e){
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }

    static public function backupFile($params){
        $params = json_decode($params, true);
        $pair = $params['pair'];
        $ans['success'] = false;
        $ans['pair'] = $pair;

        $path_to_source_folder = PATH_TO_FAKEDATA."/orders/";
        $path_to_backup_folder = PATH_TO_FAKEDATA."/orders/backup/";
        $filename = $pair.".txt";
        
        if(!file_exists($path_to_backup_folder)){
            fs::mkdir($path_to_backup_folder);
        }

        $result = fs::backupFile($path_to_source_folder, $filename, $path_to_backup_folder);
        $ans['success'] = $result;

        return $ans;
    }

    static public function saveOrdersForPair($params){
        $ans['success'] = false;

        $params = json_decode($params, true);
        $pair = $params['pair'];
        $data = $params['data'];
        // $ans['pair'] = $pair;

        $path_to_folder = PATH_TO_FAKEDATA."/orders/";
        $path_to_file = $path_to_folder.$pair."_saved.txt";
        $filename = $pair."_saved.txt";

        try{
            fs::saveJSONToFile($path_to_folder, $filename, json_encode($data));
            $ans['success'] = true;

        }catch(Throwable $e){
            $ans['error'] = $e->getMessage();
        }

        return $ans;
    }

}

?>