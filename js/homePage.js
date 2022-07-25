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
    xhr0.onreadystatechange = function () {
        if (xhr0.readyState === 4 && xhr0.status === 200) {
            var res0 = JSON.parse(xhr0.responseText);
            if (res0.status == '1') {
                cameraUri = 'https://forum.wyy.ink' + res0.avatar_uri;
                console.log(cameraUri);
                userName = '你好,' + res0.username;
                document.getElementById('camera').innerHTML = `<img src="${cameraUri}" style="width: 40px;height:40px;border-radius: 20px;"></img>`;
                document.getElementById('log').innerText = userName;
            }
            // else{
            //     alert("很抱歉，登录失败！登录状态为："+res0.status+"\n失败原因是："+res0.errMsg);
            //     location.href="login.html";
            // }
        }
    }
    goodDisplay();

    var lis = document.getElementById('lis');
    var xhr = new XMLHttpRequest();
    xhr.open("get",`${domain}/commodity/get?id=154`);
    xhr.withCredentials = true;
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            var res = JSON.parse(xhr.responseText);
            var picUri = res.pic;
            if (picUri) {
                picUri = picUri.split(",");
            }
            lis.innerHTML = `<li><img src=${domain+picUri[0]}></li>
            <li><img src=${domain+picUri[1]}></li>
            <li><img src=${domain+picUri[2]}></li>
            <li><img src=${domain+picUri[3]}></li>
            <li><img src=${domain+picUri[4]}></li>`
        }
    }
    return false;
}
//hover样式
var leftLi = document.getElementsByClassName('leftLi');
var leftHide = document.getElementsByClassName('leftHide');
leftLi[0].addEventListener("mouseenter", function () {
    leftHide[0].innerHTML = `<img src="img/1.jpg" class="hideImg">`;
}, false)
leftLi[0].addEventListener("mouseleave", function () {
    leftHide[0].innerHTML = ``;
}, false)
leftLi[1].addEventListener("mouseenter", function () {
    leftHide[1].innerHTML = `<img src="img/2.jpg" class="hideImg">`;
}, false)
leftLi[1].addEventListener("mouseleave", function () {
    leftHide[1].innerHTML = ``;
}, false)
leftLi[2].addEventListener("mouseenter", function () {
    leftHide[2].innerHTML = `<img src="img/3.jpg" class="hideImg">`;
}, false)
leftLi[2].addEventListener("mouseleave", function () {
    leftHide[2].innerHTML = ``;
}, false)
leftLi[3].addEventListener("mouseenter", function () {
    leftHide[3].innerHTML = `<img src="img/4.jpg" class="hideImg">`;
}, false)
leftLi[3].addEventListener("mouseleave", function () {
    leftHide[3].innerHTML = ``;
}, false)
leftLi[4].addEventListener("mouseenter", function () {
    leftHide[4].innerHTML = `<img src="img/5.jpg" class="hideImg">`;
}, false)
leftLi[4].addEventListener("mouseleave", function () {
    leftHide[4].innerHTML = ``;
}, false)
leftLi[5].addEventListener("mouseenter", function () {
    leftHide[5].innerHTML = `<img src="img/6.jpg" class="hideImg">`;
}, false)
leftLi[5].addEventListener("mouseleave", function () {
    leftHide[5].innerHTML = ``;
}, false)
leftLi[6].addEventListener("mouseenter", function () {
    leftHide[6].innerHTML = `<img src="img/7.jpg" class="hideImg">`;
}, false)
leftLi[6].addEventListener("mouseleave", function () {
    leftHide[6].innerHTML = ``;
}, false)
leftLi[7].addEventListener("mouseenter", function () {
    leftHide[7].innerHTML = `<img src="img/8.jpg" class="hideImg">`;
}, false)
leftLi[7].addEventListener("mouseleave", function () {
    leftHide[7].innerHTML = ``;
}, false)
// 轮播图
var currentImg = document.getElementsByClassName('lis')[0];
var lis = document.querySelectorAll('.dot>li');
var leftBtn = document.getElementsByClassName('leftBtn')[0];
var rightBtn = document.getElementsByClassName('rightBtn')[0];
var lisLen = lis.length;
var index = 0;

//圆点颜色是深还是浅
function dotStyle() {
    for (var i = 0; i < lisLen; i++) {
        if (lis[i].className == "current") {
            //当前图标颜色变浅
            lis[i].className = "other";
        }
    }
    //下一个图标颜色加深
    lis[index].className = "current";
}

// 左按钮
leftBtn.onclick = function () {
    index--;
    //页面当前是第一张，点击左移按钮，lis盒子向左移到最左边
    if (index < 0) {
        //当前图片索引随之改变
        index = 4;
    }

    var left;
    //页面当前是第一张，点击左移按钮，lis盒子向左移四个盒子的距离到最左边显示最后一张
    //left属性值表示当前左边缘与容器左边缘的距离
    if (currentImg.style.left === "0px") {
        left = -3200;
    }
    //页面当前不是第一张，点击左移按钮，lis盒子向左移一个盒子的距离
    else {
        left = parseInt(currentImg.style.left) + 800;
    }
    currentImg.style.left = left + "px";
    //更新圆点颜色
    dotStyle();
}

//右按钮
rightBtn.onclick = function () {
    index++;
    //页面当前是最后一张，点击右移按钮，lis盒子向右移到最右边
    if (index > 4) {
        //当前图片索引随之改变
        index = 0;
    }

    var right;
    //页面当前是最后一张，点击右移按钮，lis盒子向右移四个盒子的距离到最右边显示第一张
    //left属性值表示当前左边缘与容器左边缘的距离
    if (currentImg.style.left === "-3200px") {
        right = 0;
    }
    //页面当前不是最后一张，点击右移按钮，lis盒子向右移一个盒子的距离
    else {
        right = parseInt(currentImg.style.left) - 800;
    }
    currentImg.style.left = right + "px";
    //更新圆点颜色
    dotStyle();
}

// 自动轮播
var timer;

function autoPlay() {
    timer = setInterval(function () {
        index++;
        //页面当前是最后一张，点击右移按钮，lis盒子向右移到最右边
        if (index > 4) {
            //当前图片索引随之改变
            index = 0;
        }

        var right;
        var imgLeft = currentImg.style.left;
        if (imgLeft === "-3200px") {
            right = 0;
        } else {
            right = parseInt(imgLeft) - 800;
        }
        currentImg.style.left = right + "px";
        dotStyle();
    }, 5000)
}
autoPlay();

//点击圆点实现跳转
for (var i = 0; i < lisLen; i++) {
    (function (i) {
        lis[i].onclick = function () {
            var dis = index - i; //当前位置和点击的距离
            currentImg.style.left = (parseInt(currentImg.style.left) + dis * 800) + "px";
            index = i; //显示当前位置的圆点
            dotStyle();
        }
    })(i);
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
var search = document.getElementById('searchBtn');
search.onclick = function () {
    var keyWord = document.getElementById('keyWord').value;
    console.log(keyWord);
    var url = "goodsDisplay.html?key=" + document.getElementById('keyWord').value;
    location.href = url;
    return false;
}

// 销量冠军显示
function goodDisplay() {
    console.log("request执行了")
    var xhr = new XMLHttpRequest()
    xhr.open("get", `${domain}/commodity/list?page=1&page_size=12&order=sales&desc=true`, false);
    xhr.withCredentials = true;
    xhr.send();
    if (xhr.status === 200) {
        var res = JSON.parse(xhr.responseText)
        var commodities = res.commodities;
        var num = commodities.length;
        if (num >= 12) num = 12;
        var html = `<p class="title">&or;————销量王牌商品TOP${num}————&or;</p>`;
        for (let i = 0; i < commodities.length; i++) {
            let url = domain + commodities[i].pic.split(",")[0];
            // var xhr1 = new XMLHttpRequest();
            // xhr1.open("get", url, false);
            // xhr1.withCredentials = true;
            // xhr1.send();
            // if (xhr1.status !== 200) {
            //     url = `img/${Math.floor(Math.random()*8)+1}.jpg`
            // }
            html += `<a href="goodDetails.html?id=${commodities[i].id}">
            <img class="goods" src="${url}">
            </a>`;
        }
        html += `<a class="enter" href="goodsDisplay.html">点击此处进入商品详情展示</a>`
        document.getElementById("goodDisplay").innerHTML = html;
    }
}