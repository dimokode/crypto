;(function(){

function template(){}


function loadTemplateByName(tplName, arrTags = null, status = ''){
	/*
	let status = '';
	if(jsonStatus !== ''){
		let status = JSON.parse(jsonStatus)['status'];
		console.log('status:' + status);
	}else{
		//let status = '';
	}
	*/

	var obj = {
		'controller' : 'tpl',
		'action' : 'loadTemplateByName',
		'arrTags' : arrTags,
		'tplName' : tplName,
		'status' : status
	}


		return common.sendAjax(obj).then(function(json){
			//console.log(json['jsonData']);
			return json['html'];
		})
	//return "Template " + tplName + " was successfully loaded";
}
/*
function generateList(obj){
    if(obj['arrList'].length == 0){
        return 'There is no items';
    }else{
		let html = '';
        for(let key in obj['arrList']){
			let item = obj['arrList'][key];
			html+=obj['tpl'].replace(/{{item}}/g, item).replace(/{{key}}/g, key);
		}
		return html;
    }
}
*/
function generateList(obj){
	let tplHtml = obj['tpl'];
	let data = obj['data'];
	let html = '';
	data.forEach(row => {
		//console.log(element);\
		let rowHtml = tplHtml;
		for(field in row){
			if(/\d{4}-\d{2}-\d{2}/.test(row[field])){
				value = row[field].replace(/(\d{4})-(\d{2})-(\d{2})/, (...m) => `${m[3]}.${m[2]}.${m[1]}`);
			}else{
				value = row[field];
			}
			let regexp = new RegExp(`{%${field}%}`, "g");
			//console.log(field);
			rowHtml = rowHtml.replace(regexp, value);

		}
		html+=rowHtml;
	});
	//console.log(html);
	return html;
}


function generateByTemplate(obj, type='placeholder'){
	//console.log(obj);
	let tpl = obj.tpl,
		tags = obj.tags;
	
	for(let tag in tags){
		if(type == 'placeholder'){
			let regexp = new RegExp(`{%${tag}%}`, "g");
			tpl = tpl.replace(regexp, tags[tag]);
		}else{
			let regexp = new RegExp(`<${tag}>(.?)</${tag}>`);
			//console.log(field);
			tpl = tpl.replace(regexp, `<${tag}>${tags[tag]}</${tag}>`);
		}
	}
	return tpl;
}


function loadRawTemplateByName(tplName){
	const obj = {
		'controller' : 'tpl',
		'action' : 'loadRawTemplateByName',
		'tplName' : tplName,
	}

	return common.sendAjax(obj).then(function(response){
		if(response.success){
			return response.content;
		}else{
			console.error(response.error);
			return false;
		}
	})
}


function loadRawTemplateFromFile(tplName){
	const obj = {
		'controller' : 'tpl',
		'action' : 'loadRawTemplateFromFile',
		'tplName' : tplName,
	}

	return common.sendAjax(obj).then(function( response){
		if(response.success){
			return response.content;
		}else{
			console.error(response.error);
			return false;
		}
		
	})
}

function changeTagContent(domElement, tagname, value){
	const tagElement = domElement.querySelector(tagname);
	console.log(tagElement);
	tagElement.innerHTML = value;
}


template.loadTemplateByName = loadTemplateByName;
template.generateList = generateList;
template.generateByTemplate = generateByTemplate;
template.loadRawTemplateByName = loadRawTemplateByName;
template.loadRawTemplateFromFile = loadRawTemplateFromFile;
template.changeTagContent = changeTagContent;
window.template = template;
})();