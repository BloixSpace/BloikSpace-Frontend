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
//点击我的订单跳转订单界面
var order = document.getElementById('order');
order.onclick = function () {
    location.href = ("queryOrderList.html");
    return false;
}
//点击取消重置
var cancel = document.getElementById('cancel');
cancel.onclick = function () {
    location.reload();
    return false;
}
//点击修改密码跳转修改密码界面
var newpswd = document.getElementById('newpswd');
newpswd.onclick = function () {
    console.log(1234);
    location.href = ("changePswd.html");
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
            } else {
                alert("很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg);
                location.href = "login.html";
            }
        }
    }
    var params = new URLSearchParams(window.location.search)
    // var domain = "https://forum.wyy.ink"
    var defaultPager = {
        currentPage: 1,
        limit: 10,
        divNumber: 7,
        order: "update_time",
        pageNumber: 0,
        category: null,
        key: null
    }
    createPager({
        currentPage: 1,
        limit: 10,
        divNumber: 7,
        order: params.get("order") == undefined ? "update_time" : params.get("order"),
        category: params.get("category") == undefined ? "" : params.get("category"),
        pageNumber: 0,
        key: params.get("key") == undefined ? "" : params.get("key")
    })

    function createPager(pager) {
        var pager = Object.assign(defaultPager, pager)
        request(pager)
        bindEvent(pager)
    }

    function request(pager) {
        console.log("request执行了")
        var xhr = new XMLHttpRequest()
        console.log(pager.limit)
        var id = params.get("id")
        xhr.open("get", `${domain}/review/getList?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}&commodity_id=${id}&desc=true`)
        xhr.withCredentials = true
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText)
                pager.pageNumber = res.page_num
                if (res.num == 0) {
                    var emptyHtml = `<div id="emptyComment">
                    <p class="emptyComment">这里空空如也</p>
                    <p class="emptyComment">没有找到任何评价</p>
                    </div>`
                    document.getElementById("comment").innerHTML = emptyHtml;
                    return;
                }
                adddata(res)
                show(pager)
            }
        }
    }

    function adddata(res) {
        var dataHtml = ""
        for (let item of res.reviews) {
            dataHtml +=
                `<div class="comment">
                <div id="stars">
                    <img src="img/star${item.star >= 1 ? "_full" : ""}.png" id="1" class="star" >
                    <img src="img/star${item.star >= 2 ? "_full" : ""}.png" id="2" class="star" >
                    <img src="img/star${item.star >= 3 ? "_full" : ""}.png" id="3" class="star" >
                    <img src="img/star${item.star >= 4 ? "_full" : ""}.png" id="4" class="star" >
                    <img src="img/star${item.star >= 5 ? "_full" : ""}.png" id="5" class="star" >
                </div>`
            dataHtml += `<div class="comment_content">${item.content}</div>
                        <div class="comment_time">${item.update_time}</div>
                        </div>`
        }
        document.getElementById("comment").innerHTML = dataHtml
    }

    function show(pager) {
        var min, max
        min = pager.currentPage - Math.floor(pager.divNumber / 2)
        if (min < 1) {
            min = 1
        }
        max = min + pager.divNumber - 1
        if (max > pager.pageNumber) {
            max = pager.pageNumber
            min = max - pager.divNumber + 1
        }
        if (pager.divNumber >= pager.pageNumber) {
            min = 1
            max = pager.pageNumber
        }
        var item = ""
        if (pager.currentPage != 1) {
            item += `<span class="first">首页</span>
           <span class="prev">上一页</span>`
        }
        if (min != 1) {
            item += ` <span class="omit">...</span>`
        }
        for (var i = min; i <= max; i++) {
            var flag = ''
            if (i == pager.currentPage) {
                flag = 'selected'
            }
            item += `<span class="number${flag}">${i}</span>`
        }
        if (max != pager.pageNumber) {
            item += `<span class="omit">...</span>`
        }
        if (pager.currentPage != pager.pageNumber) {
            item += `<span class="next">下一页</span>
           <span class="last">尾页</span>`
        }
        item += `<span class="total"> 共  <span class="numberselected">${pager.pageNumber}</span>页 </span>`
        document.getElementById("pager").innerHTML = item
    }

    function bindEvent(pager) {
        document.getElementById("pager").addEventListener("click", function (e) {
            var classlist = e.target.getAttribute('class')
            if (classlist.search("first") !== -1) {
                topage(1, pager)
            } else if (classlist.search("prev") !== -1) {
                topage(pager.currentPage - 1, pager)
            } else if (classlist.search("next") !== -1) {
                topage(pager.currentPage + 1, pager)
            } else if (classlist.search("last") !== -1) {
                topage(pager.pageNumber, pager)
            } else if (classlist.search("number") !== -1) {
                var targetPage = Number(e.target.innerText)
                topage(targetPage, pager)
            }
        }, false)
    }

    function topage(page, pager) {
        console.log("topage执行了")
        if (page < 1) {
            page = 1
        }
        if (page > pager.pageNumber) {
            page = pager.pageNumber
        }
        pager.currentPage = page
        request(pager)
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
var params = new URLSearchParams(window.location.search);
var id = params.get("id");

var stock = 0;

var xhr2 = new XMLHttpRequest();
xhr2.open("get", `${domain}/commodity/get?id=${id}`);
xhr2.withCredentials = true;
xhr2.send();
xhr2.onreadystatechange = function () {
    if (xhr2.readyState === 4 && xhr2.status === 200) {
        var res2 = JSON.parse(xhr2.responseText);
        console.log(res2);
        var Html = "";
        var picUri = res2.pic;
        console.log(picUri);
        if (picUri) {
            picUri = picUri.split(",");
        }
        stock = res2.stock;
        Html += `<div class="goodImg">
        <div class="mainPic"><img src=${domain+picUri[0]} id="mainPicImg"></div>
        <div class="minorBox">`
        for (let i = 0; i < picUri.length; i++) {
            Html += `<li><img src=${domain+picUri[i]}></li>`
        }
        Html += `</div>
    </div>
    <div class="goodDetails" id="goodDetails">
        <div class="goodName">${res2.title}</div>
        <div class="goodInform">${res2.content}</div>
        <div class="box">
            <div class="price">￥${res2.price}</div>
        </div>
        <div class="box">
            <div class="text">库存有${res2.stock}件 我想要</div>
            <button class="add" id="add"> + </button>
            <input type="text" class="amount" value="0" id="amount">
            <button class="minus" id="minus"> - </button>
        </div>
        <div class="buyBtnBox">
            <button class="buyBtn" id="join">立即购买</button>
            <button class="addToCart" id="join">加入购物车</button>
        </div>
    </div>`;
        document.getElementById("centerBox").innerHTML = Html;

        var cc = document.getElementById("amount");
        cc.value = 1;
        cc.onblur = function () {
            if (cc.value > stock) {
                cc.value = stock;
            }
        };
    }
}
// var add = document.getElementById('add')
// var minus = document.getElementById('minus')

document.getElementById("centerBox").addEventListener("click", function (e) {
    var c = e.target.getAttribute('class')
    if (c == null) return;
    var cc = document.getElementById('amount')
    console.log(cc.value)
    if (c == "add") {
        if (cc.value < stock) cc.value++;
    } else if (c == "minus") {
        if (cc.value != "0") cc.value--;
    }
}, false)

// 监听图片点击事件（切换大图）
document.getElementById("centerBox").addEventListener("click", function (e) {
    var c = e.target.getAttribute('src')
    if (c == null) return;
    document.getElementById("mainPicImg").setAttribute("src", c);
}, false)

var search = document.getElementById('searchBtn');
search.onclick = function () {
    var keyWord = document.getElementById('keyWord').value;
    console.log(keyWord);
    var url = "goodsDisplay.html?key=" + document.getElementById('keyWord').value;
    location.href = url;
    return false;
}
document.getElementById("centerBox").addEventListener("click", function (e) {
    var clas = e.target.getAttribute('class')
    if (clas == null) return;
    if (clas.search("buyBtn") !== -1) {
        var buyNumber = document.getElementById('amount')
        // console.log(buyNumber.value)
        // console.log("join");
        location.href = `orderNow.html?id=${id}&buy_num=${buyNumber.value}`;
    } else if (clas.search("addToCart") != -1) {
        var buyNumber = document.getElementById('amount')
        console.log(buyNumber.value)
        console.log("join");
        var xhr = new XMLHttpRequest();
        xhr.open("post", "https://forum.wyy.ink/cart/add")
        xhr.withCredentials = true;
        xhr.send(JSON.stringify({
            commodity_id: id,
            buy_num: buyNumber.value
        }))
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                if (res.status != 1) {
                    alert(res.errMsg);
                    return;
                }
                location.href = "cart.html"
                console.log(res);
            }
        }
    }
}, false)