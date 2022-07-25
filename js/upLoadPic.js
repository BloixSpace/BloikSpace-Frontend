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
//点击修改密码跳转修改密码界面
var newpswd = document.getElementById('newpswd');
newpswd.onclick = function () {
    console.log(1234);
    location.href = ("changePswd.html");
    return false;
}

//判断是否登录，从而更新头像
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
                var shade = document.getElementById('shade');
                shade.style.display = 'block';
                var alertContent = document.getElementById('alertContent');
                alertContent.innerText = "很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg;
                setTimeout(function(){
                   shade.style.display = 'none';
                },2000)
                location.href = "login.html";
            }
        }
    }
    return false;
}
//上传头像&&设置用户信息（传图片uri）
var res, res1;
document.getElementById("file").onchange = function () {
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        document.getElementById("pic").innerHTML = `<img src="${reader.result}" style="width:200px;height:200px;overflow: hidden;"></img>`;
        document.getElementById('camera').innerHTML = `<img src="${reader.result}" style="width: 40px;height:40px;border-radius: 20px;"></img>`;
        window.localStorage.cameraPath = reader.result;
    }, false)
    if (file) {
        reader.readAsDataURL(file); ///读取file信息将读取到的内容存储到result中
    }
    var formData = new FormData();
    formData.append('file', file);
    var xhr = new XMLHttpRequest();
    xhr.open('post', 'https://forum.wyy.ink/file/upload');
    xhr.withCredentials = true;
    // xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(formData);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            res = JSON.parse(xhr.responseText); //json转js对象，res是对象
            console.log(res);
        }
    }
    //点击确定按钮，设置用户信息的头像
    var btn = document.getElementById('btn');
    btn.onclick = function () {
        console.log(res);
        var xhr1 = new XMLHttpRequest();
        xhr1.open("post", "https://forum.wyy.ink/user/setUserInfo");
        xhr1.withCredentials = true;
        xhr1.setRequestHeader('Content-Type', 'application/json');
        xhr1.send(JSON.stringify({ //js对象转字符串
            avatar_uri: res.uri
        }))
        xhr1.onreadystatechange = function () {
            if (xhr1.readyState == 4 && xhr1.status == 200) {
                res1 = JSON.parse(xhr1.responseText); //json转js对象，res1是对象
                console.log(res1.errMsg);
                if (res1.status == '-1') {
                    var shade = document.getElementById('shade');
                    shade.style.display = 'block';
                    var alertContent = document.getElementById('alertContent');
                    alertContent.innerText = res1.errMsg;
                    setTimeout(function(){
                    shade.style.display = 'none';
                    },2000)
                    location.href = ("login.html");
                } else {
                    location.href = ("homePage.html");
                }
            }
        }
        return false;
    }


}
//点击二级菜单的退出登录实现登出，登出接口
var logout = document.getElementById('logout');
logout.onclick = function () {
    var xhr2 = new XMLHttpRequest();
    var url = 'https://forum.wyy.ink/user/logout';
    xhr2.open("GET", url, true);
    xhr2.withCredentials = true;
    xhr2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr2.send();
    xhr2.onreadystatechange = function () {
        if (xhr2.readyState === 4 && xhr2.status === 200) {
            var storage2 = JSON.parse(xhr2.responseText);
            if (storage2.status == 1) {
                console.log("已经成功登出");
                window.localStorage.ifLogin = '0';
                location.href = ("homePage.html");
            }
        }
    }
    return false;
}