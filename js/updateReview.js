var starNum = 0;
var domain = "https://forum.wyy.ink";

window.onload = function () {
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
                setTimeout(function(){
                    location.href = "login.html";
                },2000)
                
            }
        }
    }

    var params = new URLSearchParams(window.location.search);
    var orderId = params.get("order_id");

    var id = loadInfo(orderId);
    console.log(id);

    var submitButton = document.getElementById("submit");
    submitButton.onclick = function () {
        var content = document.getElementById("content").value;
        var xhr = new XMLHttpRequest();
        xhr.open("post", `${domain}/review/update`);
        xhr.withCredentials = true;
        xhr.send(JSON.stringify({
            id: id,
            star: starNum,
            content: content
        }))
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                if (res.status == 1) {
                    var shade = document.getElementById('shade');
                    shade.style.display = 'block';
                    var alertContent = document.getElementById('alertContent');
                    alertContent.innerText = "修改评论成功！";
                    setTimeout(function(){
                    shade.style.display = 'none';
                    },2000)
                } else {
                    var shade = document.getElementById('shade');
                    shade.style.display = 'block';
                    var alertContent = document.getElementById('alertContent');
                    alertContent.innerText = res.errMsg;
                    setTimeout(function(){
                    shade.style.display = 'none';
                    },2000)
                }
            }
        };
    };

    var deleteButton = document.getElementById("delete");
    deleteButton.onclick = function () {
        var xhr = new XMLHttpRequest();
        xhr.open("post", `${domain}/review/delete`);
        xhr.withCredentials = true;
        xhr.send(JSON.stringify({
            id: id
        }))
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                if (res.status == 1) {
                    location.href = "orderDetail.html?id=" + orderId;
                } else {
                    var shade = document.getElementById('shade');
                    shade.style.display = 'block';
                    var alertContent = document.getElementById('alertContent');
                    alertContent.innerText = res.errMsg;
                    setTimeout(function(){
                    shade.style.display = 'none';
                    },2000)
                }
            }
        };
    };
};

function starListener(flag) {
    var stars = document.getElementsByClassName("star");
    for (var i = 0; i <= flag; i++) {
        stars[i].setAttribute("src", "img/star_full.png");
    }
    for (var j = flag + 1; j < 5; j++) {
        stars[j].setAttribute("src", "img/star.png");
    }
    for (var i = 0; i < stars.length; i++) {
        stars[i].onmouseover = function () {
            var id = parseInt(this.id) - 1;
            if (flag >= 0 && flag <= 4) {
                id = id > flag ? id : flag
            }
            for (var i = 0; i <= id; i++) {
                stars[i].setAttribute("src", "img/star_full.png");
            }
            for (var j = id + 1; j < 5; j++) {
                stars[j].setAttribute("src", "img/star.png");
            }
        };
    }
    for (var i = 0; i < stars.length; i++) {
        stars[i].onclick = function () {
            var id = parseInt(this.id);
            flag = id - 1;
            starNum = id;
            console.log(flag);
            for (var i = 0; i < id; i++) {
                stars[i].setAttribute("src", "img/star_full.png");
            }
            for (var i = id; i < 5; i++) {
                stars[i].setAttribute("src", "img/star.png");
            }
        };
    }
    //载入鼠标离开div事件
    document.getElementById("stars").onmouseout = function () {
        if (flag >= 0 && flag <= 4) {
            for (var i = 0; i <= flag; i++) {
                stars[i].setAttribute("src", "img/star_full.png");
            }
            for (var j = flag + 1; j < 5; j++) {
                stars[j].setAttribute("src", "img/star.png");
            }
        } else {
            for (var i = 0; i < stars.length; i++) {
                stars[i].setAttribute("src", "img/star.png");
            }
        }
    };
}

function loadInfo(orderId) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", `${domain}/review/getList?order_id=${orderId}`, false);
    xhr.withCredentials = true;
    xhr.send();
    var local = window.localStorage;
    if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText);
        if (res.num == 0) {
            var shade = document.getElementById('shade');
            shade.style.display = 'block';
            var alertContent = document.getElementById('alertContent');
            alertContent.innerText = "评价不存在！";
            setTimeout(function(){
                shade.style.display = 'none';
            },2000)
            starListener(5);
            return;
        }
        // if (res.user_id != local.user_id) {
        //     alert("无操作权限");
        //     return;
        // }
        var review = res.reviews[0];
        starListener(review.star - 1);
        starNum = review.star;
        document.getElementById("content").value = review.content;
        return review.id;
    }
}

//点击头像实现跳转到上传头像界面
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
    window.open("queryOrderList.html", "_blank");
    return false;
}
//点击修改密码跳转修改密码界面
var newpswd = document.getElementById('newpswd');
newpswd.onclick = function () {
    console.log(1234);
    window.open("changePswd.html", "_blank");
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
            if (storage.status == '0' && storage.errMsg == '未登录') {
                console.log("已经成功登出");
                window.localStorage.ifLogin = '0';
                window.open("homePage.html", "_blank");
            }
        }
    }
    return false;
}