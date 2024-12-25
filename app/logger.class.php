<?php

class Logger {
    protected $fn_info;
    protected $fn_error;
    protected $logs_folder_name;
    protected $path_to_logs_folder;

    public static $instance;

    public static function getInstance($params = []){
		if(self::$instance === null){
			self::$instance = new self($params);
		}
		return self::$instance;
	}

    // public function __construct($logs_folder_name = 'logs', $fn_info = 'log.txt', $fn_error = 'error.txt'){
    public function __construct($params = []){
        // init
        $log_folder_name = 'logger';
        $log_info = 'info.log';
        $log_error = 'error.log';

        if(count($params)>0){
            extract($params, EXTR_OVERWRITE, $prefix='log_');
        }

        $this->logs_folder_name = $log_folder_name;
        $this->fn_info = $log_info;
        $this->fn_error = $log_error;

        $this->path_to_logs_folder = ROOT_DIR."/".$this->logs_folder_name;
        if(!file_exists($this->path_to_logs_folder)){
            mkdir($this->path_to_logs_folder, 0755);
        }
    }

    static public function error($data){
        $arr = debug_backtrace();
        if(gettype($data) == 'string' || gettype($data) == 'boolean'){
            self::strlog($data, $arr, self::$instance->fn_error);
        }else{
            self::arrlog($data, $arr, self::$instance->fn_error);
        }
    }

    static public function info($data){
        $arr = debug_backtrace();
        if(gettype($data) == 'string' || gettype($data) == 'boolean'){
            self::strlog($data, $arr, self::$instance->fn_info);
        }else{
            self::arrlog($data, $arr, self::$instance->fn_info);
        }
    }

    static public function strlog($data = '', $arr, $filename){
        $str_to_file = '';
        $path_to_file = self::$instance->path_to_logs_folder."/".$filename;
        $fh = fopen($path_to_file, "a+") or die("File ($path_to_file) does not exist!");
        $str_to_file.= date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: ".$data."\n\n";
    
        fwrite($fh, $str_to_file);
        fclose($fh);
    }
    
    public function arrlog($arrData = [], $arr, $filename){
    
        $data = print_r($arrData, true);
    
        $str_to_file = '';
        $path_to_file = self::$instance->path_to_logs_folder."/".$filename;
        $fh = fopen($path_to_file, "a+") or die("File ($path_to_file) does not exist!");
        if($data == 'cls'){
            //$str_to_file = '';
            ftruncate($fh, 0);//remove file content
            //$str_to_file = date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: Empty string \n\n";
        }else{
            $str_to_file.= date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: ".$data."\n\n";
        }
        //$str_to_file.=serialize($arr);
    
        fwrite($fh, $str_to_file);
        fclose($fh);
    }
    
    
    
    public function out($data){
    
        $arr = debug_backtrace();
        $str = "";
        //$str.= date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: ".$data."\n\n";
        $str.= "[".basename($arr[0]['file']).":".$arr[0]['line']."]: ".$data."\n\n";
        echo $str;
    }
    
    
    static public function clear($params=[]){
        $log_info = self::$instance->fn_info;
        $log_error = self::$instance->fn_error;

        //extract($params, EXTR_OVERWRITE, $prefix='log_');

        $arr_logs = [];
        if(count($params) == 0){
            $arr_logs = [
                self::$instance->path_to_logs_folder."/".$log_info,
                self::$instance->path_to_logs_folder."/".$log_error,
            ];
        }else{
            for($i=0; $i<count($params); $i++){
                array_push($arr_logs, self::$instance->path_to_logs_folder."/".${"log_$params[$i]"});
            }
        }


        // $str_to_file = '';
        $arr = debug_backtrace();
        $str_to_file = date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: log has been cleared\n\n";

        foreach($arr_logs as $path_to_file){
            $fh = fopen($path_to_file, "a+") or die("File ($path_to_file) does not exist!");
    
            ftruncate($fh, 0);//remove file content
            // $str_to_file = date("d.m.Y,H:i:s#")." [".basename($arr[0]['file']).":".$arr[0]['line']."]: Log was cleared \n\n";
        
            fwrite($fh, $str_to_file);
            fclose($fh);
        }

    }
}





