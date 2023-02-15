<?
class dbf {


/** USERS ************************************************************* */
public function login($params){
    $params = json_decode($params, true);
    //wrlog(print_r($params, true));
    $user_id = isset($params['username']) ? $params['username'] : '';
    $password = isset($params['password']) ? $params['password'] : '';
    $ans['success'] = false;

    if( $user_id != '' && $password != ''){
        $data = [
            ':user_id' => $user_id,
            ':password' => $password,
        ];
        $sql = 'SELECT * FROM users WHERE user_id=:user_id AND password=:password';
        $sth = DB::queryPDO($sql, $data);
        //$row = $sth->fetchAll(\PDO::FETCH_ASSOC);
        $arrResult = DB::fetchAll($sth);
        wrlog(print_r($arrResult, true));
        if(count($arrResult) == 1){
            $row = $arrResult[0];
            //wrlog(print_r($row, true));
            $ans['success'] = true;
            $ans['data'] = [];
            $ans['data']['user_id'] = $row['user_id'];
            $_SESSION['user_id'] = $row['user_id'];
            $ans['data']['userrole'] = $row['userrole'];
            $_SESSION['userrole'] = $row['userrole'];

            $path_to_file =  PATH_TO_DB.'/users/'.$user_id.'.php';
            $response = fs::getArrayFromFile($path_to_file);
            if($response['success']){
                if( is_array($response['array']) ){
                    $arrUserData = $response['array']['data'];
                    $customer_id = $arrUserData['customer_id'];
                }
            }

            $ans['data']['customer_id'] = isset($customer_id) ? $customer_id : '';
            $_SESSION['customer_id'] = $ans['data']['customer_id'];
            //$ans['data']['customer'] = '';
        }else{
            $ans['error'] = 'Username or password is wrong';
        }
        
        //print_r($row);
    }else{
        $ans['error'] = "Check username or/and password once more";
    }
    return $ans;

}


public function getUsers(){
    
    $sql = 'SELECT user_id FROM users';
    $sth = DB::query($sql);
    $rows = DB::fetchAll($sth);
    wrlog();
    wrlog(print_r($rows, true));
    //$arrUsers = [];
    if($rows !== false){
        /*
        for($i=0; $i<sizeof($rows); $i++){
            //array_push($arrUsernames, $rows[$i]['username']);
            $arrUsers[$rows[$i]['user_id']] = $rows[$i]['user_id'];
        }
        */
        $ans['success'] = true;
        $ans['data'] = $rows;
    }else{
        $ans['success'] = false;
        $ans['error'] = 'errrr';
    }
    
    return $ans;
}

public function updateUser($params){
    $db = $GLOBALS['db'];
    $type = $params['formAction']['type'];
    $action = $params['formAction']['action'];
    $rule = $action.ucfirst($type);

    $formData = $params['formData'];

    $user_id = $formData['user_id'];
    //$formDb = $params['formDb'];
    //$formDb['id'] = $id;
    $arrStatus = $params['status'];
    
    wrlog();
    //return;
    
    if($_SESSION['userrole'] == 'admin' || user::hasPemission('updateUser')){

    }else{
        $ans['success'] = false;
        $ans['error'] = "No permission";
        return $ans;
    }


    $path = PATH_TO_CONFIG."/user.php";
    $dbrules = fs::getArrayFromFile($path, "db")['array'];
    $dbdata = DB::prepareArray($dbrules[$rule]['data'], $formData);
    //$dbdata[':status'] = 'transfer';
    /*
    if(isset($arrStatus['submit'])){
        $dbdata[':submit'] = $arrStatus['submit'];
    }else{
        $dbdata[':submit'] = false;
    }
*/
    $sql = $dbrules[$rule]['sql'];
    wrlog($sql);
    wrlog(print_r($dbdata, true));
    $r = DB::queryPDO($sql, $dbdata);
    //wrlog(print_r($r, true));
    if($r){
        wrlog('Success!');
        $path_to_file = files::checkFileExistence(PATH_TO_DB."/".$db[$type]."/".$user_id);
        wrlog($path_to_file);
        if($path_to_file !== false){
            $arrData = [
                'status' => $arrStatus,
                'data' => $formData,
            ];
            $ans = files::writeArrayInFile($path_to_file, $arrData);
        }else{
            $ans['success'] = false;
            $ans['error'] = "Data file doesn't exist";
        }
    }else{
        $ans['success'] = false;
        $ans['error'] = "DB error";
    }


    return $ans;
}

public function addUser($params){
    $db = $GLOBALS['db'];
    $type = $params['formAction']['type'];
    $action = $params['formAction']['action'];
    $rule = $action.ucfirst($type);

    $formData = $params['formData'];
    $user_id = $formData['user_id'];
    //$formDb = $params['formDb'];
    //$formDb['id'] = $id;
    $arrStatus = $params['status'];
    
    wrlog();
    //return;
    
    if($_SESSION['userrole'] == 'admin' || user::hasPemission('addUser')){

    }else{
        $ans['success'] = false;
        $ans['error'] = "No permission";
        return $ans;
    }


    if(user::userExists($user_id)){
        $ans['success'] = false;
        $ans['error'] = "User $user_id already exists in DB";
        return $ans;
    }

    $path = PATH_TO_CONFIG."/user.php";
    $dbrules = fs::getArrayFromFile($path, "db")['array'];
    $dbdata = DB::prepareArray($dbrules[$rule]['data'], $formData);

    $sql = $dbrules[$rule]['sql'];
    $lastInsert = DB::insertPDO($sql, $dbdata);
    if($lastInsert){
        wrlog('Success!');
        $path_to_file = PATH_TO_DB."/".$db[$type]."/".$user_id.".php";
        wrlog($path_to_file);

        $arrData = [
            'status' => $arrStatus,
            'data' => $formData,
        ];
        $ans = files::writeArrayInFile($path_to_file, $arrData);

    }else{
        $ans['success'] = false;
        $ans['error'] = "DB error";
    }

    return $ans;
}

/** COMMON ************************************************************ */
public function saveForm($params){
    $params = json_decode($params, true);
    $type = $params['formAction']['type'];
    //$customerId = $params['formAction']['customerId'];
    $action = $params['formAction']['action'];
    //$formData = $params['formData'];
    //$arrStatus = $params['status'];
    $rule = $action.ucfirst($type);

    return self::$rule($params);
}



static public function getFilesInFolder($params){
    $params = json_decode($params, true);
    $foldername = $params['foldername'];
    $options = isset($params['options']) ? $params['options'] : [];
    $path_to_folder = PATH_TO_CONFIG."/".$foldername."/";
    return fs::getFilesInFolder($path_to_folder, $options);
}






// DB ========================

static public function putDataInDB($params){
    clearlog();
    $params = json_decode($params, true);
    $operation = $params['operation'];
    $formData = $params['formData'];
    $ans['success'] = false;
    
    //clearlog();
    //wrlog($operation);
    //wrlog($formData);

    $data = [];

    foreach($formData as $tableName => $tableData){

        $sql_into = '';
        $sql_values = '';
        $sql_set = '';
        $sql_where = '';
        $sql_data = [];


        foreach($tableData as $fieldName => $fieldData){

            $arrIndexedTags = [];
            if($fieldName == 'tags' && $fieldData['value'] != ''){
                //wrlog($fieldData);
                $arrTags = explode(",", $fieldData['value']);
                
                foreach($arrTags as $k => $tagName){
                    //wrlog("$k=>$v");
                    $tagId = Links::isTagExist($tagName);
                    if(!$tagId){
                        $tagId = Links::insertTagInDB($tagName); 
                    }

                    //wrlog("$tagName : $tagId");
                    $arrIndexedTags[$tagId] = $tagName;
                }
            }

            wrlog($arrIndexedTags);


            if(isset($fieldData['unique'])){
                $uniqueFieldName = $fieldName;
                //$sql_unique_field = $fieldName;
                $sql_where = $fieldName."=:".$fieldName;
            }else{
                $sql_into.=$fieldName . ",";
                //$sql_values.= "`" . $fieldValue . "`,";
                $sql_values.= ":" . $fieldName . ",";
                //$sql_set.="$fieldName=`$fieldValue`,";
                $sql_set.="$fieldName=:$fieldName,";
            }
            $sql_data[':'.$fieldName] = $fieldData['value'];
        }

        $sql_into = substr($sql_into, 0, -1);
        $sql_values = substr($sql_values, 0, -1);
        $sql_set = substr($sql_set, 0, -1);


        $data = array_merge($data, $tableData);
    }

    foreach($data as $k => $v){
        $data[$k] = $data[$k]['value'];
    }
    
    wrlog($sql_into);
    wrlog($sql_values);
    wrlog($sql_data);


    if($operation == 'insert'){
        unset($sql_data[":$uniqueFieldName"]);
        $sql = "INSERT INTO $tableName($sql_into) VALUES($sql_values)";
        $lastInsertId = DB::insertPDO($sql, $sql_data);
        if($lastInsertId){
            $linkId = $lastInsertId;
            $data[$uniqueFieldName] = $lastInsertId;
            $ans['success'] = true;
            $ans['lastInsertId'] = $lastInsertId;
            $ans['data'] = $data;
        }else{
            $ans['response'] = $lastInsertId;
            $ans['error'] = __METHOD__." : ERROR: $sql";
        }
    }else if($operation == 'update'){
        $sql = "UPDATE $tableName SET $sql_set WHERE $sql_where";
        $sth = DB::queryPDO($sql, $sql_data);
        $linkId = $data[$uniqueFieldName];
        if($sth){
            $ans['success'] = true;
            $ans['sql'] = $sql;
            $ans['data'] = $data;
        }else{
            //$ans['error'] = __METHOD__." : ERROR: $sql";
            $ans['error'] = $sth['error'];
        }
    }


    
    
    //$ans['sql'] = $sql;
    //$ans['data'] = $sql_data;


    return $ans;

}


static public function getScalps(){
    //return Scalps::getScalps();
    $sql = "SELECT * FROM scalp";
    $r = DB::query($sql);
    if($r){

        $ans['data'] = DB::fetchAll($r);
        $ans['success'] = true;
    }else{
        $ans['success'] = false;
        $ans['error'] = "Error: ".__METHOD__;
    }

    return $ans;
}

// FILES --------------------------------

static public function saveDataToFile($params){
    $params = json_decode($params, true);
    $folder = $params['folder'];
    $filename = $params['filename'];
    $data = $params['data'];

    $ans['success'] = false;
    try{
        $path_to_folder = PATH_TO_LOGS."/$folder/";

        $path_to_file = $path_to_folder.$filename;
        $ans = fs::saveContentToFile($path_to_file, json_encode($data));

    }catch(Exception $e){
        $data = false;
        $ans['error'] = $e->getMessage();
    }

    return $ans;
}


static public function readDataFromFile($params){
    $params = json_decode($params, true);
    $folder = $params['folder'];
    $filename = $params['filename'];


    $ans['success'] = false;
    try{
        $path_to_folder = PATH_TO_LOGS."/$folder/";

        //$path_to_file = $path_to_folder.$filename;
        //$ans = fs::getContentFromFile($path_to_file);
        $ans = fs::getJSONFromFile($path_to_folder, $filename);

    }catch(Exception $e){
        $data = false;
        $ans['error'] = $e->getMessage();
    }

    return $ans;
}



}
?>