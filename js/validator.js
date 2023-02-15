;(function(){

function validator(){}


function getFormValidationRules(formValidationRules){
    formValidation = {};

    for(let elId in formValidationRules){
        let validateString = formValidationRules[elId]['elRules'],
            elValue = formValidationRules[elId]['elValue'];
        if(validateString){
            let validateFunctions = validateString.split(';');
            let validFuncNr = 0;
            formValidation[elId] = {};
            validateFunctions.forEach(function(validFunc){
            
                if(validFunc != ''){//isFunc(arg)
                    //console.log(validFuncNr);
                    
                    let matches = /(.*)\((.*)\)/.exec(validFunc);
                    let validFunctionName = matches[1];
                    let validFunctionArgs = matches[2].indexOf(',') ? matches[2].split(',') : matches[2];
                    console.log(validFunctionName + '=>' + validFunctionArgs);
                    let validatorObj = new Validator(elValue);
                    let validResult = validatorObj[validFunctionName](...validFunctionArgs);
                    if(validResult === true){
                        //console.log('Validation ok');
                        //formValidation[elId][validFuncNr] = true;
                    }else{
                        formValidation[elId][validFuncNr] = validResult;
                        //console.log(validResult);
                    }
                    validFuncNr++;
                }
            });

            if(isObjectEmpty(formValidation[elId])){                
                delete formValidation[elId];
            }
            //console.log(formValidation);
        }
    }

    return formValidation;
/*
    if(formValidation == {}){
        return true;
    }else{
        return formValidation;
    }
*/    
}

validator.getFormValidationRules = getFormValidationRules;
window.validator = validator;

})();