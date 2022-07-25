//管理员左侧菜单栏隐藏
var manage1 = document.getElementById('manage1');
var hidden1 = document.getElementById('hidden1');
manage1.onclick = function(){
    hidden1.style.display = (hidden1.style.display == 'none'? 'block':'none');
    return false;
}
var manage2 = document.getElementById('manage2');
var hidden2 = document.getElementById('hidden2');
manage2.onclick = function(){
    hidden2.style.display = (hidden2.style.display == 'none'? 'block':'none');
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
            location.href = "../homePage.html";
        }
    }
    return false;
}
window.onload = function(){
     //检查登录状态，更新头像及用户名
     var cameraUri, userName;
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
                 document.getElementById('camera').innerHTML = `<img src="${cameraUri}" class="cameraImg"></img>`;
                 document.getElementById('log').innerText = userName;
             } else {
                 var shade = document.getElementById('shade');
                 shade.style.display = 'block';
                 var alertContent = document.getElementById('alertContent');
                 alertContent.innerText = "很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg;
                 setTimeout(function(){
                    shade.style.display = 'none';
                 },2000)
                 location.href = "../login.html";
             }
         }
     }
     return false;
}
//上传头像&&设置用户信息（传图片uri）
var uri;
document.getElementById("file").onchange = function () {
    var file = document.getElementById("file").files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
        document.getElementById("user_pic").innerHTML = `<img src="${reader.result}" style="width:200px;height:200px;overflow: hidden;border-radius:100px;"></img>`;
    }, false)
    if (file) {
        reader.readAsDataURL(file); //读取file信息将读取到的内容存储到result中
    }
    url = reader.result;
    console.log((url));
    var formData = new FormData();
    formData.append('file', file);
    var xhr = new XMLHttpRequest();
    xhr.open('post', 'https://forum.wyy.ink/file/upload',false);
    xhr.withCredentials = true;
    xhr.send(formData);
    if (xhr.status === 200) {
        res = JSON.parse(xhr.responseText); //json转js对象，res是对象
        uri = res.uri;
        console.log(uri);
    }
    

}

//获取角色函数
function getRadioValue(arg) {
    var role = document.getElementsByName(arg);
    var value = "";
    for (var i = 0, len = role.length; i < len; i++) {
        if (role[0].checked) {
            value = 2;
        }
        if (role[1].checked) {
            value = 1;
        }
        if (role[2].checked){
            value = 3;
        }
    }
    return value;
}

//点击确定按钮，设置用户信息的头像
var btn = document.getElementById('submit');
btn.onclick = function () {
    var rolevalue = getRadioValue('role');
    var username = document.getElementById('username');
    var password = document.getElementById('password');
    var signature = document.getElementById('motto');
    var xhr = new XMLHttpRequest();
    xhr.open("post", "https://forum.wyy.ink/admin/addUser");
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ //js对象转字符串
        username:username.value,
        password:password.value,
        avatar_uri:uri,
        signature:signature.value,
        level:rolevalue
    }))
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            res = JSON.parse(xhr.responseText); //json转js对象，res1是对象
            console.log(res.errMsg);
            if (res.status == '0') {
                var shade = document.getElementById('shade');
                shade.style.display = 'block';
                var alertContent = document.getElementById('alertContent');
                alertContent.innerText = res.errMsg;
                setTimeout(function(){
                   shade.style.display = 'none';
                },2000)
                window.onload();
            } else {
                location.href = ("home.html");
            }
        }
    }
    return false;
}