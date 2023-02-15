<?

class tpl{
	public function loadTemplateByName($params){
  		$params = json_decode($params, true);
  		//wrlog(print_r($params, true));
  		$tplName = $params['tplName'];
		$arrTags = $params['arrTags'];
		$status = isset($params['status']) ? $params['status'] : '';
		//wrlog('status:' . $status);
  		//wrlog(print_r($arrTags, true));
		Template::setStatus('status', $status);
  		Template::loadTplFromFile($tplName);
  		
  		if(is_array($arrTags)){	
			if(sizeof($arrTags)>0){
				foreach($arrTags as $k=>$v){
					Template::assign($k, $v);
				}
			}
		}
		
		//wrlog('status:' . $status);
		
		$ans['html'] = Template::generate();
		//wrlog($ans['html']);
		return $ans;
	}



	public function loadRawTemplateByName($params){
		$params = json_decode($params, true);
		$tplName = $params['tplName'];
		return Template::loadRawTplFromFile($tplName);	
  	}


	  public function loadRawTemplateFromFile($params){
		$params = json_decode($params, true);
		$tplName = $params['tplName'];
		$tplHTML = Template::loadRawTplFromFile($tplName);
		if($tplHTML){
			return $tplHTML;
		}else{
			return false;
		}	
  	}

}

?>