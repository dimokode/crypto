<?

class files{

	public function getFileInFolder($params){
		$params = json_decode($params, true);
		$fldname = $params['folder'];
		$filename = $params['filename'];
		$path_to_file =  ROOT_DIR."/".$fldname."/".$filename;
		$fcont = file_get_contents($path_to_file);
		if($fcont !== false){
			$ans['success'] = true;
			$ans['fcont'] = $fcont;
		}else{
			$ans['success'] = false;
			$ans['error'] = 'Error by reading the file';
		}
		return $ans;
	}

	public function getFilesInFolder($params){
		//$params = json_decode($params, true);
		//wrlog(print_r($params, true));
		$path = $params['path'];

	  //$path =  ROOT_DIR."/".$fldname;
	  //wrlog($path);
	  $ans = [];
		  $arrFiles = [];
		  if(file_exists($path)){
			  //wrlog("Folder $path exists");
			  if ($handle = opendir($path)) {
				  while (false !== ($file = readdir($handle))) { 
					  if ($file != "." && $file != ".." && is_file($path."/".$file)) {
						  $fileInfo = new SplFileInfo($file);
						  //array_push($arrFiles, $fileInfo->getFilename());//remove extension
						  
						  //$arrFilename = explode(".", $file);
						  //unset($arrFilename[sizeof($arrFilename)-1]);
						  //$filename = implode('.', $arrFilename);
						  //wrlog(mb_detect_encoding($filename), 'files.txt');
						  //$filename = $file;
						  //array_push($arrFiles, mb_convert_encoding($file, 'ASCII'));//remove extension
						  array_push($arrFiles, mb_convert_encoding($fileInfo->getBasename('.php'), 'ASCII'));//remove extension
					  } 
				  }
				  closedir($handle);
			  }
		  
			  $ans['success'] = true;
			  $ans['files'] = $arrFiles;
		  }else{
			  //wrlog("Folder $path doesn't  exist");
			  $ans['success'] = false;
			  $ans['error'] = "Folder $path doesn't exist";
			  //$ans['success'] = true;
			  //$ans['files'] = $arrFiles;
		  }
		  //wrlog(print_r($arrFiles, true), 'files.txt');

	return $ans;
}
	
	public function saveContentToFile($params){
		$params = json_decode($params, true);
		$fldname = $params['folder'];
		$filename = $params['filename'];
		$cont = $params['cont'];
		$path_to_file =  ROOT_DIR."/".$fldname."/".$filename;
		if(file_put_contents($path_to_file, $cont)){
			$ans['success'] = true;
			$ans['msg'] = 'File was successfully saved';
		}else{
			$ans['success'] = false;
			$ans['error'] = 'Error by saving the file';	
		}
		return $ans;
	}


  	public function getFolders($params){
  		$params = json_decode($params, true);
  		//wrlog(print_r($params, true));
  		$fldname = $params['fldname'];

		$path =  ROOT_DIR."/".$fldname;
		$arrFolders = [];
		if(file_exists($path)){
			//$arrFiles = scandir($path);
			
			if ($handle = opendir($path)) {
			    while (false !== ($file = readdir($handle))) { 
			        //if ($file != "." && $file != ".." && strpos($file, ".") === false) { 
			        if ($file != "." && $file != "..") { 
			            array_push($arrFolders, $file);
			        } 
			    }
			    closedir($handle); 
			}
			$result = true;
			wrlog(print_r($arrFolders, true));
			//return $arrFiles;		
		}else{
			//Errors::addError("Folder isn't exist");
			//return false;
			$result = false;
		}
		$ans['result'] = $result;
		$ans['folders'] = $arrFolders;
		return $ans;
	}

public function loadConfigDataFile($params){
	$params = json_decode($params, true);
	$configFile = $params['configFile'];
	if(!empty($configFile)){
		$filepath = self::checkFileExistence(ROOT_DIR."/".$configFile);
		if($filepath !== false){
			$arrFields = include_once($filepath);
			//$arrJson = ['forma' => $arrFields];
			//$arrSectionsData = ['forma' => ''];
			$ans['success'] = true;
			$ans['jsonData'] = json_encode($arrFields, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
			//$ans['jsonTemplate'] = '';
			//$ans['jsonSections'] = json_encode($arrSectionsData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT);
			return $ans;
		}
	}else{
		return false;
	}
}


static public function loadDataFile3($params){
	//wrlog();
	//$config = include_once('config/config.php');
	$params = json_decode($params, true);
	$arrDataFiles = $params['objData'];
	$arrConfigFile = $params['objConfig'];
	//wrlog(print_r($arrConfigFile, true));
	$statusConfigFile = array_keys($arrConfigFile)[0];//take a key for the filtration of status data, because it needs the status only for the one base file
	//wrlog($statusConfigFile);
	if($arrDataFiles != ''){
		$arrFromDataFiles = self::parseDataFiles($arrDataFiles);
		//wrlog(print_r($arrFromDataFiles, true));
		if($arrFromDataFiles['success'] === true){
			$arrData = $arrFromDataFiles['data'];
			//wrlog(print_r($arrData, true));
			//wrlog(print_r($arrFromDataFiles, true));
			$arrStatus = $arrFromDataFiles['status'][$statusConfigFile];
			//wrlog(print_r($arrStatus, true));
			//$arrStatus = [];
		}else{
			return [
				'status' => false,
				'errors' => $arrFromDataFiles['errors'],
			];
		}

	}else{
		//$arrFromDataFiles = [];
		$arrData = [];
		$arrStatus = [];
	}
	
	$arrConfig = self::parseConfigFiles($arrConfigFile);
	//wrlog(print_r($arrConfig, true));
	$arrConfigData = $arrConfig['arrConfigData'];
	$arrSectionsData = $arrConfig['arrSectionsData'];
	$arrStatusData = $arrConfig['arrStatusData'];
	//wrlog(print_r($arrData, true));
	//wrlog(print_r($arrSectionsData, true));
	//wrlog(print_r($arrConfigData, true));
	//wrlog(print_r($arrStatusData, true));
	//wrlog(print_r($arrStatus, true));

	//$arrFormData = [];
	$arrTemplateData = [];//config data sets for groups
	$arrFieldnamesInConfig = [];

	foreach($arrConfigData as $sectionName => $arrSection){
		//$arrFormData[$sectionName] = [];
			foreach($arrSection as $fieldName => $arrField){
				//wrlog(print_r($arrField, true));
					//$arrFormData[$sectionName][$fieldName] = $arrField;
					if($arrField['element'] == 'group'){
						$arrTemplateData[$fieldName] = $arrField['groupitem'];
						//wrlog(print_r($arrField['groupitem'], true));
						foreach($arrField['groupitem'] as $fieldNameInGroup => $arrFieldInGroup){
							array_push($arrFieldnamesInConfig, $fieldNameInGroup);
						}
					}else{
						
					}
					array_push($arrFieldnamesInConfig, $fieldName);
					

					//$arrFormData[$sectionName][$fieldName]['attributes']['value'] = $arrData[$fieldName];
			}

	}

	$arrFieldnamesInConfig = array_flip($arrFieldnamesInConfig);
	$arrFieldnamesInData =  array_flip(array_keys($arrData));
	$arrDifferData = array_diff_ukey($arrFieldnamesInData, $arrFieldnamesInConfig, 'self::key_compare_func');
	//wrlog(print_r($arrFieldnamesInConfig, true));
	//wrlog(print_r($arrFieldnamesInData, true));
	//wrlog(print_r($arrFormData, true));
	//wrlog(print_r($arrTemplateData, true));
	//wrlog(print_r($arrSectionsData, true));
	//wrlog(print_r($arrStatusData, true));
	$ans['success'] = true;
	$ans['jsonData'] = json_encode($arrData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT);
	$ans['jsonStatus'] = json_encode($arrStatus, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT);
	$ans['jsonFormData'] = json_encode($arrConfigData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT);
	//$ans['jsonStatus'] = json_encode($arrStatusData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT);

	$ans['jsonTemplate'] = json_encode($arrTemplateData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT);
	$ans['jsonSections'] = json_encode($arrSectionsData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT);
	$ans['jsonDifferData'] = json_encode($arrDifferData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_FORCE_OBJECT);
	return $ans;
}



static public function key_compare_func($key1, $key2){
    if ($key1 == $key2)
        return 0;
    else if ($key1 > $key2)
        return 1;
    else
        return -1;
}

static public function importData($arrData){
	$flag = false;
	foreach($arrData as $sectionName => $arrSection){
		foreach($arrSection as $fieldName => $arrFieldProps){

			if(isset($arrFieldProps['type']) && $arrFieldProps['type'] == 'import'){
				$flag = true;
				$tpl_filepath = self::checkFileExistence(ROOT_DIR."/config/".$arrFieldProps['path']);
				if($tpl_filepath !== false){
					$tempArray = fs::getArrayFromFile($tpl_filepath)['array'];
					//wrlog(print_r($tempArray, true));
					if(isset($tempArray['data'])){
						$tempArray = $tempArray['data'];
					}
					$newArray = [];
					if(isset($arrFieldProps['prefix'])){
						$keyPrefix = $arrFieldProps['prefix'];
						foreach($tempArray as $key=>$value){
							$newArray[$keyPrefix.$key] = $value;
							$newArray[$keyPrefix.$key]['attributes']['id'] = $keyPrefix.$newArray[$keyPrefix.$key]['attributes']['id'];
							$newArray[$keyPrefix.$key]['attributes']['name'] = $keyPrefix.$newArray[$keyPrefix.$key]['attributes']['name'];
						}
						//$arrTemplates[$fieldName] = $newArray;
						$arrData[$fieldName] = $newArray;
					}else{
						//$arrTemplates[$fieldName] = $tempArray;
						$arrData[$fieldName] = $tempArray;
					}
					unset($arrData[$sectionName][$fieldName]);
					//$arrData[$fieldName]['select'] = true;
					//unset($arrData[$sectionName][$fieldName]);
				}
			}

/*
			if(isset($arrFieldProps['element']) && $arrFieldProps['element'] == 'group'){
				$tpl_filepath = self::checkFileExistence(ROOT_DIR."/config/".$arrFieldProps['import']);
				if($tpl_filepath !== false){
					$arrData[$sectionName][$fieldName]['groupitem'] = include_once($tpl_filepath);
					if(isset($arrSection['selectable'])){
						//$arrTemplates[$sectionName][$fieldName]['type'] = 'select';
						
						$arrData[$sectionName] = array_merge($arrData[$sectionName], $arrData[$sectionName][$fieldName]['groupitem']);
						$arrData[$sectionName][$fieldName]['select'] = true;
						//unset($arrSection['select']);
					}
				}
			}

			if(isset($arrData[$sectionName]['select'])){
				//wrlog('select is present');
				unset($arrData[$sectionName]['select']);
			}
*/

		}
	}
	if($flag){
		$arrData = self::importData($arrData);
	}
	return $arrData;
}


static public function importGroups($arrSection){
	$flag = false;

	//foreach($arrData as $sectionName => $arrSection){
		foreach($arrSection as $fieldName => $arrFieldProps){

			if(isset($arrFieldProps['element']) && $arrFieldProps['element'] == 'group' && !isset($arrFieldProps['groupitem'])){
				$flag = true;
				$tpl_filepath = self::checkFileExistence(ROOT_DIR."/config/".$arrFieldProps['import']);
				if($tpl_filepath !== false){
					$arrSection[$fieldName]['groupitem'] = include_once($tpl_filepath);
					/*
					if(isset($arrSection['selectable'])){	
						$arrData[$sectionName] = array_merge($arrData[$sectionName], $arrData[$sectionName][$fieldName]['groupitem']);
						$arrData[$sectionName][$fieldName]['select'] = true;
					}
					*/
				}
				$arrSection[$fieldName]['groupitem'] = self::importGroups($arrSection[$fieldName]['groupitem']);
			}
/*
			if(isset($arrData[$sectionName]['select'])){
				//wrlog('select is present');
				unset($arrData[$sectionName]['select']);
			}
*/
		}
	//}
/*
	if($flag){
		$arrData = self::importGroups($arrData);
	}
	return $arrData;
	*/
	return $arrSection;
}


static public function getSufix($configFile){
	if($_SESSION['userrole'] == 'service'){
		if(self::checkFileExistence(ROOT_DIR."/config/".$configFile."-service")){
			return "-service";
		}else{
			return "";
		}
			
	}elseif($_SESSION['userrole'] == 'admin' || $_SESSION['userrole'] == 'manager'){
		return "-manager";
	}else{
		return "";
	}
}

static public function parseConfigFiles($arrConfigFiles){
	
	//$db = $GLOBALS['db'];
	if(is_array($arrConfigFiles)){
		$arrTemplates = [];
		$arrSections = [];
		$arrStatus = [];
		$arrDb = [];
		$arrData = [];

		foreach($arrConfigFiles as $configName => $configPath){
			$configPath = $configPath.self::getSufix($configPath);

			$tpl_filepath = self::checkFileExistence(ROOT_DIR."/config/".$configPath);
			if($tpl_filepath !== false){
				$arrTemplates[$configName] = include_once($tpl_filepath);

				if(isset($arrTemplates[$configName]['sections'])){
					$arrSections = $arrTemplates[$configName]['sections'];
					unset($arrTemplates[$configName]['sections']);
				}

				if(isset($arrTemplates[$configName]['status'])){
					$arrStatus = $arrTemplates[$configName]['status'];
					unset($arrTemplates[$configName]['status']);
				}

				if(isset($arrTemplates[$configName]['db'])){
					$arrDb = $arrTemplates[$configName]['db'];
					unset($arrTemplates[$configName]['db']);
				}

				if(isset($arrTemplates[$configName]['data'])){
					$arrData[$configName] = $arrTemplates[$configName]['data'];
					unset($arrTemplates[$configName]['data']);
				}
			}
		}
### recursive import of configuration files
		$arrData = self::importData($arrData);
		//$arrData = self::importGroups($arrData);

		//wrlog(print_r($arrData, true));
### group
	foreach($arrData as $sectionName => $arrSection){
		$arrData[$sectionName] = self::importGroups($arrSection);
	}

/*
		foreach($arrData as $sectionName => $arrSection){
			foreach($arrSection as $fieldName => $arrFieldProps){
				if(isset($arrFieldProps['element']) && $arrFieldProps['element'] == 'group'){
					$tpl_filepath = self::checkFileExistence(ROOT_DIR."/config/".$arrFieldProps['import']);
					if($tpl_filepath !== false){
						$arrData[$sectionName][$fieldName]['groupitem'] = include_once($tpl_filepath);
						if(isset($arrSection['selectable'])){
							//$arrTemplates[$sectionName][$fieldName]['type'] = 'select';
							
							$arrData[$sectionName] = array_merge($arrData[$sectionName], $arrData[$sectionName][$fieldName]['groupitem']);
							$arrData[$sectionName][$fieldName]['select'] = true;
							//unset($arrSection['select']);
						}
					}
				}
			}
			if(isset($arrData[$sectionName]['select'])){
				//wrlog('select is present');
				unset($arrData[$sectionName]['select']);
			}
		}

		*/
		wrlog('cls');
		wrlog(print_r($arrData, true));
		//wrlog(print_r($arrTemplates, true));
		//wrlog(print_r($arrSections, true));
		//return ["arrConfigData" => $arrTemplates, "arrSectionsData" => $arrSections, "arrStatusData"=> $arrStatus];
		return ["arrConfigData" => $arrData, "arrSectionsData" => $arrSections, "arrStatusData"=> $arrStatus];
	}		
}


static public function parseDataFiles($arrDataFiles){
	$errors = [];
	$db = $GLOBALS['db'];
  		if(is_array($arrDataFiles)){
			$arrTemplates = [];
			$arrData = [];  
			$arrStatus = [];
  			foreach($arrDataFiles as $k=>$v){
  				$tpl_filepath = self::checkFileExistence(PATH_TO_DB."/".$db[$k]."/".$arrDataFiles[$k]);
  				if($tpl_filepath !== false){
  					//$arrTemplates[$k] = include_once($tpl_filepath);
					$arrTemplates[$k] = include_once($tpl_filepath);
					if(isset($arrTemplates[$k]['data'])){
						$arrData = array_merge($arrData, $arrTemplates[$k]['data']);
					}else{
						array_push($errors, "The section DATA doesn't exist in " . $arrDataFiles[$k]);
					}
					if(isset($arrTemplates[$k]['status'])){
						$arrStatus[$k] = $arrTemplates[$k]['status'];
					}else{
						array_push($errors, "The section STATUS doesn't exist in " . $arrDataFiles[$k]);
					}
					
  				}	
			}
			//remove html entities
			if(sizeof($arrData) > 0){
				foreach($arrData as $k=>$v){
					if(!is_array($arrData[$k])){
						$arrData[$k] = htmlspecialchars_decode(stripslashes($v));
					}
				}
			}

			
			//wrlog(print_r($arrData, true));
  			//return $arrData;
  			//return ['arrData' => $arrData, 'arrStatus' => $arrStatus];
  		}else{
			//return false;
			array_push($errors, 'arrDataFiles is not an array');
		}
		if(sizeof($errors) > 0){
			return [
				'success' => false,
				'errors' => $errors,
			];
		}else{
			return [
				'success' => true,
				'data' => $arrData,
				'status' => $arrStatus,
			];
		}
}


  private function getFieldProps($propsString){
	//$arrFieldProps = explode(";", $propsString);
	$arrFieldProps = [];
	foreach($propsString as $k=>$v){
		$arrFieldProps[$k] = $v;
	}
	/*
	$arrFieldPropExport = [];
	for($i=0; $i<sizeof($arrFieldProps); $i++){
		$arrFieldProp = explode(":", $arrFieldProps[$i]);
		$arrFieldPropExport[$arrFieldProp[0]] = $arrFieldProp[1];
	}*/
	return $arrFieldProps;
  }



static public function checkFileExistence($filepath){
  	if(file_exists($filepath)){
  		return $filepath;
  	}elseif(file_exists($filepath.".php")){
		wrlog($filepath);
  		return $filepath.".php";
  	}else{
  		return false;
  	}
}


static public function writeArrayInFile($path_to_file, $arrData){
	Template::loadTplFromFile('data.tpl');
	Template::assign("data", self::varexport($arrData));
	$fcont = Template::generate();
	$ans['success'] = false;

	if(self::savefile($path_to_file, $fcont)){
		$ans['success'] = true;
		$ans['msg'] = 'File was successfully saved';
	}else{
		//$ans['success'] = false;
		$ans['error'] = 'Problem by saving file';
	}
	return $ans;
}


  /*
  public function writeDataInFile($params){
  		//$params = json_decode($params, true);
  		//wrlog(print_r($_COOKIE, true));
  		$folder = $params['folder'];
  		$filename = $params['filename'];
  		$formAction = $params['formAction'];
  		$formData = $params['formData'];
		$arrStatus = $params['status'];
	/*	  
		if($_COOKIE['userrole'] == 'customer'){
			if($filename != $_COOKIE['customer']){
				$ans['success'] = false;
				$ans['error'] = 'Hackatack!!!';
				return $ans;
			}
		}

  		if(!file_exists(ROOT_DIR.'/'.$folder.'/')){
  			if(!mkdir(ROOT_DIR.'/'.$folder.'/', 0777, true)){
	  			$ans['success'] = false;
	  			$ans['error'] = 'Problem by folder creating';
	  			return $ans;
  			}
  		}

	  	Template::loadTplFromFile('data.tpl');
	  	Template::assign("data", self::varexport($formData));
	  	Template::assign("status", self::varexport($arrStatus));
	  	$fcont = Template::generate();

		$path_to_file = ROOT_DIR.'/'.$folder.'/'.$filename;

		if($formAction == 'add' && file_exists($path_to_file)){
			$ans['success'] = false;
	  		$ans['error'] = "File $filename already exist";
		}else{
	  		if(self::savefile($path_to_file, $fcont)){
	  			$ans['success'] = true;	
	  		}else{
	  			$ans['success'] = false;
	  			$ans['error'] = 'Problem by saving file.';
	  		}
		}
  		return $ans;
  }
*/

	static public function savefile( $path_to_file, $fcont ) {
		
		if(!file_exists($path_to_file)){
			fopen($path_to_file, 'w');
		}

	    if (file_put_contents($path_to_file, $fcont) ){
	      //echo 'File was successfully saved';
	      return true;
	    }else{
	      //echo 'Error by saving of file';
	      return false;
	    }

	}

	public function deleteFiles($params){
		$params = json_decode($params, true);
		wrlog(print_r($params, true));
		$fldname = $params['fldname'];
		$filetype = isset($params['filetype']) ? $params['filetype'] : 'php';
		$arrFiles = isset($params['files']) ? $params['files'] : '';
		$arrFolders = isset($params['folders']) ? $params['folders'] : '';
		$error = false;


		if($filetype == 'folder'){

			for($i=0; $i<sizeof($arrFolders); $i++){

				if(file_exists(ROOT_DIR."/".$fldname."/".$arrFolders[$i]) && is_dir(ROOT_DIR."/".$fldname."/".$arrFolders[$i])){
					//self::rm(ROOT_DIR."/".$fldname."/".$arrFolders[$i]);
					//self::rmRec(ROOT_DIR."/".$fldname."/".$arrFolders[$i]);
					if(!self::rmRec(ROOT_DIR."/".$fldname."/".$arrFolders[$i])){
						$error = true;
						$ans['error'] = 'Cannot unlink the folder ' . ROOT_DIR."/".$fldname."/".$arrFolders[$i];	
					}
					/*
					if(!rmdir(ROOT_DIR."/".$fldname."/".$arrFolders[$i])){
						$error = true;
						$ans['error'] = 'Cannot unlink the folder ' . ROOT_DIR."/".$fldname."/".$arrFolders[$i];	
					}
					*/
				}else{
					$error = true;
					$ans['error'] = 'Folder is not exist ' . ROOT_DIR."/".$fldname."/".$arrFolders[$i];
				}
			}

		}else{

			for($i=0; $i<sizeof($arrFiles); $i++){
				if($filetype == 'php'){
					if(strpos($arrFiles[$i], '.php') === false){
						$arrFiles[$i].=".php";
					}
				}

				if(file_exists(ROOT_DIR."/".$fldname."/".$arrFiles[$i])){
					if(!unlink(ROOT_DIR."/".$fldname."/".$arrFiles[$i])){
						$error = true;
						$ans['error'] = 'Cannot unlink the file ' . ROOT_DIR."/".$fldname."/".$arrFiles[$i];	
					}
				}else{
					$error = true;
					$ans['error'] = 'File is not exist ' . ROOT_DIR."/".$fldname."/".$arrFiles[$i];
				}
			}

		}



		if($error === false){
			$ans['success'] = true;
			$ans['text'] = 'Files were successfully deleted';
		}else{
			$ans['success'] = false;
			//$ans['error'] = 'Some error occured by files deleting';
		}
		return $ans;
	}


	private function rm($dir) {
	    $iterator = new RecursiveIteratorIterator(
	        new RecursiveDirectoryIterator($dir),
	        RecursiveIteratorIterator::CHILD_FIRST
	    );

	    foreach ($iterator as $path) {
	      if ($path->isDir()) {
	         rmdir((string)$path);
	      } else {
	         unlink((string)$path);
	      }
	    }
	    rmdir($dir);
	}



	private function rmRec($path) {
	  if (is_file($path)) return unlink($path);
	  	if (is_dir($path)) {
		    foreach(scandir($path) as $p) if (($p!='.') && ($p!='..'))
		      self::rmRec($path.DIRECTORY_SEPARATOR.$p);
		    return rmdir($path); 
		}
		return false;
	 }


	public function deleteFolders($params){
		$params = json_decode($params, true);
		$srcFolder = $params['folder'];
		$folders = $params['folders'];

		foreach($folders as $k => $folder){
			$path_to_dir = ROOT_DIR."/".$srcFolder."/".$folder;
			if(file_exists($path_to_dir)){
				if(rmdir($path_to_dir)){
					$ans['success'] = true;
				}else{
					$ans['success'] = false;
					$ans['error'] = "deleteFolders error";
				}
			}
			return $ans;
		}
		
	}


	static private function varexport($expression, $return=TRUE) {
	    $export = var_export($expression, TRUE);
	    $export = preg_replace("/^([ ]*)(.*)/m", '$1$1$2', $export);
	    $array = preg_split("/\r\n|\n|\r/", $export);
	    $array = preg_replace(["/\s*array\s\($/", "/\)(,)?$/", "/\s=>\s$/"], [NULL, ']$1', ' => ['], $array);
	    //$array = preg_replace("/'/", "\"", $array);
	    $array = preg_replace("/\"/", "\&quot\;", $array);
	    $export = join(PHP_EOL, array_filter(["["] + $array));
	    if ((bool)$return) return $export; else echo $export;
	}

	public function isFoldersEmpty($params){
		$params = json_decode($params, true);
		$srcFolder = $params['folder'];
		$folders = $params['folders'];
		$msg = '';
		foreach($folders as $k=>$folder){
			$path_to_folder = ROOT_DIR."/".$srcFolder."/".$folder;
			if(file_exists($path_to_folder)){
				//$msg.="Folder $folder exists # ";
				$isDirEmpty = !(new \FilesystemIterator($path_to_folder))->valid();
				if($isDirEmpty === false){
					$msg.="Folder $folder isn't empty # ";
				}
			}
		}

		if(!empty($msg)){
			$ans['success'] = false;
			$ans['error'] = $msg;
		}else{
			$ans['success'] = true;
		}
		return $ans;
	}

	public function isFolderEmpty($path_to_folder){
		//$arrError = [];
		//wrlog($path_to_folder, "test.txt");
		if(file_exists($path_to_folder)){
			//wrlog("Folder $path_to_folder exists", "test.txt");
			$isDirEmpty = !(new \FilesystemIterator($path_to_folder))->valid();
			//$isDirEmpty = self::isDirEmpty($path_to_folder);
			wrlog("isDirEmpty:" . print_r($isDirEmpty, true), "test.txt");
			//wrlog("isDirEmpty:" . $isDirEmpty, "test.txt");
			//return $isDirEmpty;
			if($isDirEmpty === true){
				return true;
			}else{
				return false;
			}
			//return false;
		}else{
			return true;
		}
	}
/*
	public function isDirEmpty($dir){
		$handle = opendir($dir);
		while (false !== ($entry = readdir($handle))) {
		  if ($entry != "." && $entry != "..") {
			closedir($handle);
			return FALSE;
		  }
		}
		closedir($handle);
		return TRUE;
	}
*/

	public function getArrayFromFile($params){
		$params = json_decode($params, true);
		$filename = $params['filename'];
		$path_to_file = $_SERVER['DOCUMENT_ROOT']."/".$filename;
		if(file_exists($path_to_file)){
			$arr = include_once($path_to_file);
			$ans['success'] = true;
			$ans['data'] = $arr;
		}else{
			$ans['success'] = false;
			$ans['error'] = 'Config file does not exist';
		}
		return $ans;
	}

}

?>