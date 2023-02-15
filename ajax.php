<?
require_once('config.php');
$json = file_get_contents('php://input');
$arrData = json_decode($json, true);
//wrlog(print_r($arrData, true));

//wrlog();
//$ans = [];
$controllerName = $arrData['controller'];
$actionName = $arrData['action'];

$ans['success'] = false;
if(class_exists($controllerName, true)){
    $controller = new $controllerName;
    if(method_exists($controller, $actionName)){
        
        $jsonData = json_encode($arrData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $ans = call_user_func_array( array($controller, $actionName), array($jsonData) );

    }else{
        $ans['error'] = "Method $actionName in class $controllerName doesn't exist";    
    }
}else{
    $ans['error'] = "Class $controllerName doesn't exist";
}




//wrlog('Controller:' . $controller);
//wrlog('Action:' . $action);



//wrlog(print_r($ans, true), 'files.txt');


$out = json_encode($ans);
//wrlog('out:' . $out, 'files.txt');
//wrlog(json_last_error_msg(), 'files.txt');
$fp = fopen('php://output', 'w');
fwrite($fp, $out); //User will see Hello World!
fclose($fp);
?>