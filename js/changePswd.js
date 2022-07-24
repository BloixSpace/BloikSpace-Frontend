var domain = 'https://forum.wyy.ink';
//检查登录状态，更新头像及用户名
var cameraUri, userName;
window.onload = function () {
    var xhr0 = new XMLHttpRequest();
    xhr0.open("get", "https://forum.wyy.ink/user/getUserInfo");
    xhr0.withCredentials = true;
    xhr0.setRequestHeader('Content-Type', 'application/json');
    xhr0.send();
    xhr0.onreadystatechange = function () {
        if (xhr0.readyState === 4 && xhr0.status === 200) {
            var res0 = JSON.parse(xhr0.responseText);
            if (res0.status == '1') {
                cameraUri = 'https://forum.wyy.ink' + res0.avatar_uri;
                console.log(cameraUri);
                userName = '你好,' + res0.username;
                document.getElementById('camera').innerHTML = `<img src="${cameraUri}" style="width: 40px;height:40px;border-radius: 20px;"></img>`;
                document.getElementById('log').innerText = userName;
            } else {
                alert("很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg);
                location.href = "login.html";
            }
        }
    }
    return false;
}
//点击头像跳转上传头像界面
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
//点击我的收藏到收藏界面
var collect = document.getElementById('collect');
collect.onclick = function () {
    location.href = "myCollect.html";
    return false;
}
//点击我的订单跳转订单界面
var order = document.getElementById('order');
order.onclick = function () {
    location.href = ("queryOrderList.html");
    return false;
}
//点击更改密码跳转更改密码页面
var newpswd = document.getElementById('newpswd');
newpswd.onclick = function () {
    console.log(1234);
    location.href = ("setUserInfo.html");
    return false;
}

//更改密码接口
var submit = document.getElementById('submit');
submit.onclick = function () {
    var oldpswd = document.getElementById('oldpswd');
    var newPswd = document.getElementById('newPswd');
    var xhr = new XMLHttpRequest();
    xhr.open("post", "https://forum.wyy.ink/user/updatePassword");
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        old_password: oldpswd.value,
        new_password: newPswd.value
    }))
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var storage = JSON.parse(xhr.responseText);
            window.localStorage.password = newPswd.value;
            //报错页面
            if (storage.status == '0') {
                alert(storage.errMsg);
            }
            if (storage.status == '1') {
                alert('您已重置密码，请重新登录')
                location.href = ("login.html");
            }
        }
    }
    return false;
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