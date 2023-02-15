<?

//namespace App;

class DB {

	public $pdo;
	public static $instance;


	public static function getInstance(){
		if(self::$instance === null){
			self::$instance = new self;
		}
		//errlog(self::$instance);
		return self::$instance;
	}


	public static function test(){
		errlog('test');
		errlog(self::$instance);
		errlog(gettype(self::$instance->pdo));
	}




	public function __construct(){
		try{
			$this->pdo = new \PDO("sqlite:" . PATH_TO_SQLITE_FILE);
			//$this->pdo->exec("PRAGMA case_sensitive_like=ON;");
			$this->pdo->sqliteCreateFunction('u_lower', 'u_strtolower', 1);//register function for case insensitive search

		}catch(Exception $e){
			errlog($e->getMessage());
		}
	}



	public function createTables($commands){
		foreach($commands as $command){
			$this->pdo->exec($command);
		}
	}

	public function exec($sql){
		try{
			$r = self::$instance->pdo->exec($sql);
			return $r;
		}catch(PDOException $e){
			errlog($e->getMessage());
		}
	}


	static public function query($sql) {
		//errlog($sql);
		//$sql = "PRAGMA case_sensitive_like=ON;".$sql;
		try{

			$r = self::$instance->pdo->query($sql);
			if(!$r){
				$error = self::$instance->pdo->errorInfo();
				throw new PDOException($error[2]);
				errlog($error);
			}else{
				return $r;
			}
			
		}catch(PDOException $e){
			errlog($e->getMessage());
		}
	}


	static public function queryPDO($sql, $data = []){
		try{
			//arrlog($sql);
			//arrlog($data);
			//errlog(self::$instance);
			//errlog(self::$instance->pdo);
			//errlog(gettype(self::$instance->pdo));
			$sth = self::$instance->pdo->prepare($sql);
			//errlog($sth);

			if(!$sth){
				$error = self::$instance->pdo->errorInfo();
				throw new PDOException($error[2]);
			}

			$sth->execute($data);
			if(!$sth){
				throw new PDOException("query PDO error");
			}
			return $sth;
		}catch(PDOException $e){
			errlog($e->getMessage());
			/*
			return [
				'success' => false,
				'error' => $e->getMessage()
			];
			*/
		}
	}


	static public function insertPDO($sql, $data) {
		try{
			$sth = self::$instance->pdo->prepare($sql);
			$sth->execute($data);
			return self::$instance->pdo->lastInsertId();
		}catch(PDOException $e){
			errlog($e->getMessage());
			return false;
		}
	}



	public function insert($sql) {
		//errlog($sql);
		try{
			$r = self::$instance->pdo->exec($sql);
			return self::$instance->pdo->lastInsertId();
		}catch(PDOException $e){
			errlog($e->getMessage());
		}
	}


	public function fetch($r) {
		try{
			return $r->fetch(\PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			errlog($e->getMessage());
		}
	}

	static public function fetchAll($sth){
		return $sth->fetchAll(\PDO::FETCH_ASSOC);
	}


}


?>