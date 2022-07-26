//点击头像跳转到上传头像界面
var camera = document.getElementById('camera');
camera.onclick = function () {
    location.href = "uploadPic.html";
    return false;
}
//点击修改密码跳转修改密码界面
var newpswd = document.getElementById('newpswd');
newpswd.onclick = function () {
    location.href = ("changePswd.html");
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
var domain = 'https://forum.wyy.ink';
//检查登录状态，更新头像及用户名
var cameraUri, userName;
window.onload = function () {
    var xhr0 = new XMLHttpRequest();
    xhr0.open("get", "https://forum.wyy.ink/user/getUserInfo");
    xhr0.withCredentials = true;
    xhr0.setRequestHeader('Content-Type', 'application/json');
    xhr0.send();
    var telNumber;
    xhr0.onreadystatechange = function () {
        if (xhr0.readyState === 4 && xhr0.status === 200) {
            var res0 = JSON.parse(xhr0.responseText);
            if (res0.status == '1') {
                telNumber = res0.phone;
                if (telNumber != undefined) document.getElementById("tel").value = telNumber;
                cameraUri = 'https://forum.wyy.ink' + res0.avatar_uri;
                console.log(cameraUri);
                userName = '你好,' + res0.username;
                document.getElementById('camera').innerHTML = `<img src="${cameraUri}" style="width: 40px;height:40px;border-radius: 20px;"></img>`;
                document.getElementById('log').innerText = userName;
            }
            else{
                var shade = document.getElementById('shade');
                shade.style.display = 'block';
                var alertContent = document.getElementById('alertContent');
                alertContent.innerText = "很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg;
                setTimeout(function(){
                   shade.style.display = 'none';
                },2000)
                setTimeout(function(){
                    location.href="login.html";
                },2000)
                
            }
        }
    }

    return false;
}
//结算购物车
var nickname = document.getElementById('nickname');
var tel = document.getElementById('tel');
var num = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

var address = document.getElementById('address');
var remark = document.getElementById('remark');
var settleBtn = document.getElementById('settle');
tel.onblur = function(){
    if (tel.value =="") {
        tel.value = "您未输入手机号码";
        tel.style.color = "red";
    }
    else if(!num.test(tel.value)){
        tel.value = "请输入正确的手机号码";
        tel.style.color = "red";
    }
    return false;
}
settleBtn.onclick = function () {
    if (!num.test(tel.value)) {
        var shade = document.getElementById('shade');
        shade.style.display = 'block';
        var alertContent = document.getElementById('alertContent');
        alertContent.innerText = "请输入手机号！";
        setTimeout(function(){
            shade.style.display = 'none';
        },2000)
        return;
    }
    if (address.value == "") {
        var shade = document.getElementById('shade');
        shade.style.display = 'block';
        var alertContent = document.getElementById('alertContent');
        alertContent.innerText = "请输入地址！";
        setTimeout(function(){
            shade.style.display = 'none';
        },2000)
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open("post", `${domain}/cart/settle`);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    let array = JSON.parse(window.localStorage.getItem("cartSelect"));
    xhr.send(JSON.stringify({
        phone: tel.value,
        address: address.value,
        remark: remark.value,
        nickname: nickname.value,
        id: array
    }));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            if (res.status == '1') {
                if (res.errMsg != "" && res.errMsg != null) {
                    var shade = document.getElementById('shade');
                    shade.style.display = 'block';
                    var alertContent = document.getElementById('alertContent');
                    alertContent.innerText = res.errMsg;
                    setTimeout(function(){
                    shade.style.display = 'none';
                    },2000)
                    return;
                }
                else{
                    var shade = document.getElementById('shade');
                    shade.style.display = 'block';
                    var alertContent = document.getElementById('alertContent');
                    alertContent.innerText = "下单成功";
                    setTimeout(function(){
                    shade.style.display = 'none';
                    },2000)
                    setTimeout(function(){
                        location.href = "goodsDisplay.html";
                    },2000)
                    
                }
            }
        }
    }
    return false;
}