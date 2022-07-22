//点击头像跳转上传头像界面
var camera = document.getElementById('camera');
camera.onclick = function () {

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
//注册&&设置用户信息接口
window.onload = function () {
    var submit = document.getElementById('submit');
    submit.onclick = function () {
        //注册接口
        var username = document.getElementById('username');
        var password = document.getElementById('password');
        var xhr = new XMLHttpRequest();
        xhr.open("post", "https://forum.wyy.ink/user/register");
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            username: username.value,
            password: password.value
        }))
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(1);
                var local = window.localStorage;
                local.username = username.value;
                local.password = password.value;
            }
        }
        setTimeout(function () {
            //设置用户信息接口
            var signature = document.getElementById('motto');

            function getRadioValue(arg) {
                var role = document.getElementsByName(arg);
                var value = "";
                for (var i = 0, len = role.length; i < len; i++) {
                    if (role[0].checked) {
                        value = 'seller';
                    }
                    if (role[1].checked) {
                        value = 'buyer';
                    }
                }
                return value;
            }
            var rolevalue = getRadioValue('role');
            var xhr1 = new XMLHttpRequest();
            xhr1.open("post", "https://forum.wyy.ink/user/setUserInfo");
            xhr1.withCredentials = true;
            xhr1.setRequestHeader('Content-Type', 'application/json');
            xhr1.send(JSON.stringify({
                signature: signature.value,
                role: rolevalue
            }))
            xhr1.onreadystatechange = function () {
                if (xhr1.readyState == 4 && xhr1.status == 200) {
                    var storage = JSON.parse(xhr.responseText);
                    var storage1 = JSON.parse(xhr1.responseText);
                    console.log(storage1.status);
                    if (storage.status == '0' || storage1.status == '0') {
                        alert(storage.errMsg + '\n\n' + storage1.errMsg);
                    } else {
                        window.localStorage.signature = signature.value;
                        window.localStorage.role = rolevalue;
                        location.href = ("login.html");
                    }
                }
            }
        }, 1000);


        return false;
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