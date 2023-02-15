;(function(){

	function common(){}


	function test(){
		alert('test');
	}



	function sendAjax(ajaxObj){
		//var action = ajaxObj['action'];
		//alert(action);
		var json = JSON.stringify(ajaxObj);
		//alert('sendAjax:' + json);
		return fetch('/ajax.php', {
				method: "POST",
				body: json,
				credentials: 'same-origin',
				headers: {
					"Content-Type": "application/json"
				}
			}).then(function(response){
				//console.log('hallo');
				//alert(JSON.stringify(response));
				//console.log(response);
				//var data = response.json();
				//alert(response.json());
				//console.log(JSON.stringify(response.json()));
				return response.json();	
			});
	}



common.test = test;
common.sendAjax = sendAjax;
window.common = common;

})();