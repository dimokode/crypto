<?

class Orders {
    static public function getOrders(){
        $ans['success'] = false;
        //$ans['data'] = [];

        $path_to_folder = PATH_TO_LOGS."/orders/";
        $response = fs::getFilesInFolder($path_to_folder);
        if($response['success']){
            $ans['success'] = true;
            $ans['arrFiles'] = $response['arrFiles'];
        }

        return $ans;
    }
}


?>