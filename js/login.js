//点击头像跳转头像上传界面
var camera = document.getElementById('camera');
camera.onclick = function () {
    location.href = "uploadPic.html";
    return false;
}
//点击我的通知到通知界面
var notice = document.getElementById('notice');
notice.onclick = function () {
    location.href = "notice.html";
    return false;
}
//点击我的订单跳转订单界面
var order = document.getElementById('order');
order.onclick = function () {
    location.href = ("queryOrderList.html");
    return false;
}
//点击修改密码跳转修改密码界面
var newpswd = document.getElementById('newpswd');
newpswd.onclick = function () {
    console.log(1234);
    location.href = ("changePswd.html");
    return false;
}

var domain = "https://forum.wyy.ink"

//登录接口
window.onload = function () {
    var login = document.getElementById('login');
    login.onclick = function () {
        var username = document.getElementById('username');
        var password = document.getElementById('password');
        var xhr = new XMLHttpRequest();
        xhr.open("post", "https://forum.wyy.ink/user/login");
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            username: username.value,
            password: password.value
        }))
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var storage = JSON.parse(xhr.responseText);
                var local = window.localStorage;
                localStorageUpdate();
                //报错页面
                if (storage.status == 0) {
                    local.ifLogin = '0';
                    location.href = ("errMsg.html");
                }
                if (storage.status == 1) {
                    local.ifLogin = '1';
                    if(local.level != 1){
                        location.href = "administrator/home.html";
                    }
                    else{
                        location.href = "homePage.html";
                    }
                }
            }
        }
        return false;
    }
}
// //登录接口
// window.onload = function(){
//     var login =document.getElementById('login');
//     login.onclick = function(){
//         var username = document.getElementById('username');
//         var password = document.getElementById('password');
//         var xhr = new XMLHttpRequest();
//         var url = 'https://forum.wyy.ink/user/login';
//         var str = "username="+username.value+"&password="+password.value;
//         xhr.open("POST",url,true);
//         xhr.withCredentials = true;
//         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//         xhr.send(str);
//         xhr.onreadystatechange = function(){
//             if(xhr.readyState == 4 && xhr.status == 200){
//                 console.log(xhr.responseText);
//                 var storage = JSON.parse(xhr.responseText);
//                 console.log(storage.status);
//                 var local = window.localStorage;
//                 local.username = username.value;
//                 local.password = password.value;
//                 local.status = storage.status;
//                 local.errMsg = storage.errMsg;
//                 //报错页面
//                 if(storage.status == 0){
//                     location.href = ("errMsg.html");
//                 }
//                 if(storage.status == 1){
//                     location.href = ("homePage.html");
//                 }
//             }
//         }
//         return false;
//     }
// }

function localStorageUpdate() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", `${domain}/user/getUserInfo`, false);
    xhr.withCredentials = true;
    xhr.send();
    if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText);
        var local = window.localStorage;
        local.username = res.username;
        local.userId = res.id
        local.level = res.level;
        local.avatarUri = res.avatar_uri;
    }
}


//点击二级菜单的退出登录实现登出，登出接口
var logout = document.getElementById('logout');
logout.onclick = function () {
    var xhr1 = new XMLHttpRequest();
    var url = 'https://forum.wyy.ink/user/logout';
    xhr1.open("GET", url, true);
    xhr1.withCredentials = true;
    xhr1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr1.send();
    xhr1.onreadystatechange = function () {
        if (xhr1.readyState === 4 && xhr1.status === 200) {
            var storage = JSON.parse(xhr1.responseText);
            console.log("已经成功登出");
            window.localStorage.ifLogin = '0';
            location.href = "homePage.html";
        }
    }
    return false;
}
// var http = new XMLHttpRequest();
// var url = 'get_data.php';
// var params = 'orem=ipsum&name=binny';
// http.open('POST', url, true);

// //Send the proper header information along with the request
// http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

// http.onreadystatechange = function() {//Call a function when the state changes.
//     if(http.readyState == 4 && http.status == 200) {
//         alert(http.responseText);
//     }
// }
// http.send(params);