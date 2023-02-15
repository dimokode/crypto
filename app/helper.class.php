<?
class Helper {
    function __construct(){

    }

    static function getGlobalConstant($constant_name){
        return constant($constant_name);
    }
}
?>