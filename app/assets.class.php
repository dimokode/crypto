<?
class Assets {

    static public function getAssetName($params){
        $params = json_decode($params, true);
        $asset = $params['asset'];

        return fs::getJSONFromFile(PATH_TO_LOGS, "symbols.json", $asset);
    }

}
?>