<?

class Tdb {

    public static function getData($params){
        $params = json_decode($params, true);
        $tdbName = $params['tdbName'];
        //$ans = fs::getJSONFromFile(PATH_TO_DB, "$tdbName.tdb");
        return fs::getJSONFromFile(PATH_TO_DB, $tdbName);
    }

}

?>