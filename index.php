<?
//session_start();
require_once("config.php");

//print_r($_COOKIE);
//echo "<hr>";
//print_r($_SESSION);
//echo "_COOKIE:" . $_COOKIE['loged'];

if(isset($_COOKIE['logged']) && $_COOKIE['logged'] == true){
	$router = new Router();
	$router->run();
	$html_content = $router->html;
}else{
  Template::loadTplFromFile('login-page.html');
	$html_content = Template::generate();
}

Template::loadTplFromFile('common.html');
Template::assign('content', $html_content);

$fp = fopen('php://output', 'w');
fwrite($fp, Template::generate());
fclose($fp);
// echo Template::generate();

?>