<?

class Symbols {
    public static function getSymbols(){
        //$ans['success'] = false;

        //$path_to_folder = PATH_TO_DB."/pairs.tdb";
        $ans = fs::getJSONFromFile(PATH_TO_DB, "symbols.tdb");
        
        //$ans['success'] = true;
        //$ans['data'] = "{some shit}";
        return $ans;
    }

    public static function saveSymbols($params){
        $params = json_decode($params, true);
        $jsonData = $params['jsonData'];
        $ans = fs::saveJSONToFile(PATH_TO_DB, "symbols.tdb", $jsonData);
        
        //$ans['success'] = true;
        //$ans['data'] = "{some shit}";
        return $ans;
    }
}

?>