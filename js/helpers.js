function isObjectEmpty(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false;
        }
    }
    return true;
}

function cloneObject(obj){
  return JSON.parse(JSON.stringify(obj));
}

function implode (glue, pieces) {
    //  discuss at: https://locutus.io/php/implode/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Waldo Malqui Silva (https://waldo.malqui.info)
    // improved by: Itsacon (https://www.itsacon.net/)
    // bugfixed by: Brett Zamir (https://brett-zamir.me)
    //   example 1: implode(' ', ['Kevin', 'van', 'Zonneveld'])
    //   returns 1: 'Kevin van Zonneveld'
    //   example 2: implode(' ', {first:'Kevin', last: 'van Zonneveld'})
    //   returns 2: 'Kevin van Zonneveld'
  
    var i = ''
    var retVal = ''
    var tGlue = ''
  
    if (arguments.length === 1) {
      pieces = glue
      glue = ''
    }
  
    if (typeof pieces === 'object') {
      if (Object.prototype.toString.call(pieces) === '[object Array]') {
        return pieces.join(glue)
      }
      for (i in pieces) {
        retVal += tGlue + pieces[i]
        tGlue = glue
      }
      return retVal
    }
  
    return pieces
  }

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


HTMLElement.prototype.getDirectChild = function(selector){
	let child = this.querySelector(selector);
	if(child !== null && child.parentNode == this){
		return child;
	}else{
		return false;
	}
}

function formatDate(timestamp, formatString){
	let dateT = formatString.split('T');
	//console.log(dateT);
	dateParts = dateT[0].split('-');
	dateParts = dateParts.concat(dateT[1].split(':'));

	//console.log(dateParts);
	let date = new Date(timestamp);
	//console.log(date);

	let dateObj = {
		yyyy : date.getFullYear(),
		MM : (date.getMonth()+1<10) ? '0' + (date.getMonth()+1) : (date.getMonth()+1),
		dd : (date.getDate()<10) ? '0' + date.getDate() : date.getDate(),
		hh : (date.getHours()<10) ? '0' + date.getHours() : date.getHours(),
		mm : (date.getMinutes()<10) ? '0' + date.getMinutes() : date.getMinutes(),
		ss : (date.getSeconds()<10) ? '0' + date.getSeconds() : date.getSeconds(),
	}

	let formatedDate = formatString;
	dateParts.forEach(function(item){
		//console.log(item);
		formatedDate = formatedDate.replace(item, dateObj[item]);
	});
	return formatedDate;
	//console.log(dateObj);
	//console.log(formatedDate);
}


function convertTimestampToDatetime(timestamp){
  var d = new Date(timestamp);
  //var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  let objDate = {
    year : d.getFullYear(),
    month : d.getMonth()+1,
    date : d.getDate(),
    hour : d.getHours(),
    min : d.getMinutes(),
    sec : d.getSeconds(),
  }

  let dFormat = 'date.month.year hour:min:sec';
  
  for(let item in objDate){
    if(objDate[item]<10){
      objDate[item] = '0'+objDate[item];
    }

    dFormat = dFormat.replace(item, objDate[item]);
  }

  return dFormat;

}




function formatFloat(floatValue){
    floatValue = Number(floatValue)
    if(floatValue > 1){
        floatValue = floatValue.toFixed(2)
    }else if(floatValue < 1 && floatValue > 0.01){
        floatValue = floatValue.toFixed(4)
    }else if(floatValue > 0.01 && floatValue > 0.0001){
        floatValue = floatValue.toFixed(8)
    }
    return Number(floatValue);
}

function openLink(link, blank = true){
  window.open(link, (blank) ? 'blank' : '');
}

async function importObjectFromFile(path_to_file){
  return import(path_to_file + '?'+Date.now()).then( (module) => {
      return module.obj;
  });
}


HTMLElement.prototype.findParentElementByTagname = function(targetElementTagname){
  let currentElement = this;
  targetElementTagname = targetElementTagname.toUpperCase();
  let parentElement = currentElement.parentElement;
  //console.log(parentElement, parentElement.tagName);
  if(parentElement.tagName == targetElementTagname){
      return parentElement;
  }else{
      return parentElement.findParentElementByTagname(targetElementTagname);
  }
}


function timeToLocal(originalTime) {
  const d = new Date(originalTime * 1000);
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()) / 1000;
}

// Array.prototype.removeItemByValue = function(value){
//     var index = this.indexOf(value);
//     if (index >= 0) {
//         this.splice( index, 1 );
//     }
//     return this;
// }

Object.defineProperty(Array.prototype, 'removeItemByValue', {
    value: function(value) {
        var index = this.indexOf(value);
        if (index >= 0) {
            this.splice( index, 1 );
        }
        return this;
    }
});