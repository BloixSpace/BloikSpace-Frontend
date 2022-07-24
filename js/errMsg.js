//点击头像实现跳转
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
//点击修改密码跳转修改密码界面
var newpswd = document.getElementById('newpswd');
newpswd.onclick = function () {
    console.log(1234);
    location.href = ("changePswd.html");
    return false;
}

var Close = document.getElementById('Close');
Close.onclick = function () {
    location.href = "login.html";
    return false;
}
var errMsg = localStorage.getItem('errMsg');
var check = document.getElementById('check');
check.onclick = function () {
    if (errMsg == '已登录') {
        text.innerText = '您已登录，不能重复登录';
    }
    if (errMsg == '用户名或密码错误') {
        text.innerText = '用户名或密码错误';
    }
}
//点击二级菜单的退出登录实现登出，登出接口
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
// var text = document.getElementById('text');
// var usnm = localStorage.getItem('username');
// var errMsg = localStorage.getItem('errMsg');
// var sta = localStorage.getItem('status');