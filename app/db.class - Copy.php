<?

//namespace App;

class DB {

	public static $instance;
	public $pdo;


	public static function getInstance(){
		if(self::$instance === null){
			self::$instance = new self;
		}
		return self::$instance;
	}


	public function test(){
		return self::$instance;
	}

	public function __construct(){
		$obj = self::$instance;
		//if($this->pdo == null) {

			//$this->pdo = new \PDO("sqlite:" . Config::PATH_TO_SQLITE_FILE);
		try{
			$this->pdo = new \PDO("sqlite:" . PATH_TO_SQLITE_FILE);
		}catch(\PDOException $e){

		}
			
		//}
		//return $this->pdo;
	}

	public function createTables($commands){
		foreach($commands as $command){
			$this->pdo->exec($command);
		}
	}

	static public function exec($command){
		/* returns count of rows */
		$obj = self::$instance;
		return $obj->pdo->exec($command);//count of rows
	}


	static public function query($sql) {
		$obj = self::$instance;
		//$sth = $obj->pdo->query($sql);
		/*
		if(!$sth){
			wrlog(print_r($obj->pdo->errorInfo(), true), 'pdo.txt');
			//return;
		}*/
		try{
			$sth = $obj->pdo->query($sql);
			if(!$sth){
				throw new Exception($obj->pdo->errorInfo()[2]);
			}
		}catch(Exception $e){
			//echo $e->getMessage();
			error_log($e->getMessage(), 0);//save error message in php.log
			return;
		}

		return $sth;
	}





	static public function queryPDO($sql, $data = []) {
			$obj = self::$instance;
			$sth = $obj->pdo->prepare($sql);

			$sth->execute($data);
			//var_dump($sth);
			
			return $sth;
				
			//return $r;
	}

	static public function insertPDO($sql, $data) {
		//echo "insertPDO";
		$obj = self::$instance;
		$sth = $obj->pdo->prepare($sql);


		try{
			$sth = $obj->pdo->prepare($sql);
			if(!$sth){
				throw new Exception($obj->pdo->errorInfo()[2]);
			}
		}catch(Exception $e){
			//echo $e->getMessage();
			error_log($e->getMessage(), 0);//save error message in php.log
			return;
		}

		try {
			$r = $sth->execute($data);
			if(!$r){
				throw new Exception($obj->pdo->errorInfo()[2]);
			}
		}catch(Exception $e){
			error_log($e->getMessage(), 0);
			//echo 'Поймано исключение: ',  $e->getMessage(), "\n";
			//echo 'Поймано исключение: ',  $sth->errorInfo(), "\n";
		}		
		return $obj->pdo->lastInsertId();
}


	static public function deletePDO($sql, $data = []){
		$obj = self::$instance;
		$sth = $obj->pdo->prepare($sql);

		try{
			$sth = $obj->pdo->prepare($sql);
			if(!$sth){
				throw new Exception($obj->pdo->errorInfo()[2]);
			}
		}catch(Exception $e){
			//echo $e->getMessage();
			error_log($e->getMessage(), 0);//save error message in php.log
			return;
		}

		try {
			$r = $sth->execute($data);
			if(!$r){
				throw new Exception($obj->pdo->errorInfo()[2]);
			}
		}catch(Exception $e){
			error_log($e->getMessage(), 0);
			//echo 'Поймано исключение: ',  $e->getMessage(), "\n";
			//echo 'Поймано исключение: ',  $sth->errorInfo(), "\n";
		}		
		return $sth->rowCount();
	}

	static public function fetch($sth) {
		$obj = self::$instance;
		$r = $sth->fetch(\PDO::FETCH_ASSOC);
		/*
		if(!$r){
			wrlog(print_r($obj->pdo->errorInfo(), true), 'pdo.txt');
			return;
		}
		*/
		return $r;
	}

	static public function prepareArray($dbdata, $formData){
		$newArr = [];
		foreach($dbdata as $k=>$v){
			$newArr[':'.$v] = isset($formData[$v]) ? $formData[$v] : '';
		}
		return $newArr;
	}

	static public function prepareArray2($dbdata){
		$newArr = [];
		foreach($dbdata as $k => $v){
			$newArr[':'.$k] = $v;
		}
		return $newArr;
	}
/*
	public function prepareArray($arr){
		$newArr = [];
		$setArr = [];
		foreach($arr as $k=>$v){
			$newArr[':'.$k] = $v;
			$setArr[$k] = "$k=:$k";
		}
		$setDb = implode(", ", $setArr);
		//$setDb = substr($setDb, 0, 0);
		return [
			'arr' => $newArr,
			'set' => $setDb,
		];
	}
*/
	public function fetchFirst($sth){
		return $sth->fetchAll(\PDO::FETCH_ASSOC)[0];
	}

	static public function fetchAll($sth){
		return $sth->fetchAll(\PDO::FETCH_ASSOC);
	}

	public function prepareData3($operationType, $data){
/*
	group main element => group sub element => group item => group item [property]
*/
		//wrlog(print_r($data, true));
		$sql = [];
		//wrlog(print_r($data, true));
		$preparedData = [];
		forEach($data as $k=>$elementData){
			//wrlog($k . ' => ' . print_r($elementData, true));
			if(isset($elementData['db'])){
				$db_field = $elementData['db'];
				unset($elementData['db']);
				//the group has another structure
				if(isset($elementData['type']) && $elementData['type'] == 'group' ){
					//group main element
					unset($elementData['type']);
					$preparedGroup = [];
					foreach($elementData as $groupSubElementName=>$groupSubElements){
						//group sub element
						$groupElement = [];
						foreach($groupSubElements as $groupItemName=>$groupItem){
							//group item
							$groupElement[$groupItemName] = $groupItem['value'];
						}
						$preparedGroup[$groupSubElementName] = $groupElement;
					}

					$prepareData[$db_field][$k] = $preparedGroup;

				}else{
					if(strpos($db_field, ",")!== false){
						//if element data must be saved in more than one db field
						$arr_db_field = explode(",", $db_field);
						foreach($arr_db_field as $db_fieldName){
							$prepareData[trim($db_fieldName)][$k] = $elementData['value'];
						}
					}else{
						$prepareData[$db_field][$k] = $elementData['value'];
					}
				}
			}
			
			if(isset($elementData['where'])){
				$sql['where'] = $k."=:".$k;
				$sql['data'][$k] = $elementData['value'];
			}
			
		}
		//wrlog(print_r($sql['data'], true));
		//wrlog("prepareData3=>prepareData:" . print_r($prepareData, true));
		//$sqlData = [];


		if($operationType == 'update'){
			forEach($prepareData as $k=>$fieldData){
				//wrlog($k . ' => ' . print_r($fieldData, true));
				if(sizeof($prepareData[$k])>1){
					//wrlog('>1');
					//$sqlData['set'][$k] = $k."=:".$k;
					$sql['data'][$k] = json_encode($prepareData[$k], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
				}else{
					//wrlog('<1');
					//$sqlData[$k] = $k."='".$fieldData[$k]."'";
					//wrlog('$k:' . $k . '  ' . print_r($preparedData[$k], true) . print_r($fieldData, true));
					if(isset($fieldData[$k])){
						$sql['data'][$k] = $fieldData[$k];
					}else{
						$sql['data'][$k] = json_encode($prepareData[$k], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
					}
				}
				$sqlData['set'][$k] = $k."=:".$k;
			}
			//wrlog(print_r($sql['data'], true));
			$sql['set'] = implode(', ', $sqlData['set']);

		}elseif($operationType == 'insert'){

			forEach($prepareData as $k=>$fieldData){
				if(sizeof($prepareData[$k])>1){
					//$sqlData['set'][$k] = $k."=:".$k;
					$sql['data'][$k] = json_encode($prepareData[$k], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
				}else{
					//$sqlData[$k] = $k."='".$fieldData[$k]."'";
					if(isset($fieldData[$k])){
						$sql['data'][$k] = $fieldData[$k];
					}else{
						$sql['data'][$k] = json_encode($prepareData[$k], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
					}
				}
				$sqlData['insert'][$k] = $k;
				$sqlData['values'][$k] = ':'.$k;
			}

			$sql['insert'] = implode(', ', $sqlData['insert']);
			$sql['values'] = implode(', ', $sqlData['values']);

		}
		//$sql['where'] = $data""
		//$sqlset = implode(', ', $sqlData);
		return $sql;
	}



/*
	public function fetchAll($sql){
		$obj = self::$instance;
		$data = [];
		$r = $obj->query($sql);
		if($r){
			while($row = $obj->fetch($r)){
				$data[] = $row;
			}
			return $data;
		}else{
			return false;
		}

		
	}
*/
	
	public function casesens(){
		$sql = "PRAGMA case_sensitive_like=OFF;";
		self::exec($sql);
	}

}


?>