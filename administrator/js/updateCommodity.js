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
                 alert("很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg);
                 location.href = "../login.html";
             }
         }
     }
     return false;
}