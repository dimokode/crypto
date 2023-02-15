;(function(){

function users(){}

function show(){
    template.loadTemplateByName('users.html').then(function(tpl){
        $('#content').html(tpl);
    }).then(function(){
        users.getUsers().then(function(json){
            //console.log('aaa: ' + aaa);
            let obj = {
                tpl: `<div><a href="javascript:void(0);" onclick="forma.checkElement($(this)); users.getUserByName('{%user_id%}');">{%user_id%}</a></div>`,
                data: json['data']
            }
            $('#users').html(template.generateList(obj));
        });
    });
}


function getUsers(){
    var obj = {
        'controller' : 'dbf',
        'action' : 'getUsers',
    }
    return common.sendAjax(obj).then(function(json){
        console.log(json);
        if(json['success'] === true){
            return json;

        }else{
            alert(json['error']);
            return;
        }
    });
}

function getUserByName(user_id){
    var objData = {
        'user' : user_id
    }

    var objConfig = {
        'user' : 'user',
        //'contract' : 'config/contract.php'
    }

    forma.loadDataFile(objData, objConfig).then(function(json){
        console.log(json);
        //return false;
        if(json !== false){
              //var jsonData = json['jsonData'];
              //var jsonForm = json['jsonForm'];
              //console.log(jsonData);
              //console.log(jsonForm);
            var objForm = {
                'type': 'user',
                //'id': userId,
                'action': 'update'
            }

            forma.generateForm2(json, objForm).then(function(formHTML){
                var tags = {
                    'callback' : 'users.cbUpdateUser'
                }
                
                template.loadTemplateByName('forma_wo_transfer.html', tags).then(function(tpl){
                    $('#user').html(tpl);
                    $('#form').html(formHTML);
                    forma.selectInit('#form');
                    if(json['msg'] != undefined){
                        alert(json['msg']);
                    }
                });
            });
        }
    });
}


function addUser(){
    let objConfig = {
        'user' : 'user'
    }

    forma.loadDataFile(null, objConfig).then(function(json){
        console.log(json);
        //return false;
          if(json !== false){
              //var jsonData = json['jsonData'];
              //var jsonForm = json['jsonForm'];
              //console.log(jsonData);
              //console.log(jsonForm);
            var objForm = {
                'type': 'user',
                //'id': '',
                'action': 'add'
            }

            forma.generateForm2(json, objForm).then(function(formHTML){
                var tags = {
                    'callback' : 'users.cbAddUser'
                }
                
                template.loadTemplateByName('forma_wo_transfer.html', tags).then(function(tpl){
                    $('#user').html(tpl);
                    $('#form').html(formHTML);
                    if(json['msg'] != undefined){
                        alert(json['msg']);
                    }
                });
            });

            }
        });
}



/** callbacks */
function cbAddUser(){
    show();
    alert('User was successfully added');
}

function cbUpdateUser(){
    alert('User was successfully updated');
}

users.show = show;
users.getUsers = getUsers;
users.addUser = addUser;
users.getUserByName = getUserByName;
users.cbAddUser = cbAddUser;
users.cbUpdateUser = cbUpdateUser;
window.users = users;
})();