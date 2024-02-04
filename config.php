<?
require __DIR__ . '/vendor/autoload.php';
session_start();
//error_reporting(-1);
error_reporting(E_ALL);
use DevCoder\DotEnv;
$absolutePathToEnvFile = __DIR__ . '/.env';
(new DotEnv($absolutePathToEnvFile))->load();

//define("DOMAINNAME", getenv('DOMAINNAME'));
define("API_KEY", getenv('API_KEY'));
define("SECRET_KEY", getenv('SECRET_KEY'));

define("ROOT_DIR", dirname (__FILE__));
define("TPL_DIR", ROOT_DIR.'/tpl');
define("APP_DIR", ROOT_DIR.'/app');
define("PATH_TO_LOGS", ROOT_DIR.'/logs');
define("PATH_TO_DB", ROOT_DIR.'/db/');
define("PATH_TO_CONFIG", ROOT_DIR.'/config');
//define("FORMS_DIR", ROOT_DIR.'/forms');
define("PATH_TO_SQLITE_FILE", ROOT_DIR.'/db/db.sqlite');
define("SITE_URL", "http://".$_SERVER['HTTP_HOST']);

define("FROM_FILE", false);


include_once('dev_functions.php');
include_once(APP_DIR.'/functions.php');

spl_autoload_register(function ($classname) {
	$path_to_class_file = ROOT_DIR."/app/".strtolower($classname) . ".class.php";
	try{
		if(file_exists( $path_to_class_file ) ){
			include_once( $path_to_class_file );
		}else{
			wrlog("File $path_to_class_file does not exist", 'php_errors.txt');
			throw new Exception("File ". $path_to_class_file ." doesn't exist");
		}
		
	} catch(Exception $e){
		//echo $e->getMessage();
		wrlog($e->getMessage(), 'php_errors.txt');
	}
    //throw new Exception("Невозможно загрузить $classname.");
});

//создаем объект БД
DB::getInstance();
//echo TPL_DIR;
Template::setTemplateFolder(TPL_DIR);


?>