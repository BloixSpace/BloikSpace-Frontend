window.onload = function () {
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
                document.getElementById('camera').innerHTML = `<img src="${cameraUri}" style="width: 40px;height:40px;border-radius: 20px;"></img>`;
                document.getElementById('log').innerText = userName;
            } else {
                alert("很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg);
                location.href = "login.html";
            }
        }
    }
    var params = new URLSearchParams(window.location.search)
    var domain = "https://forum.wyy.ink"
    var defaultPager = {
        currentPage: 1,
        limit: 20,
        divNumber: 7,
        order: "update_time",
        pageNumber: 0,
        category: null,
        key: null,
        desc: false
    }
    createPager({
        currentPage: 1,
        limit: 20,
        divNumber: 7,
        order: params.get("order") == undefined ? "update_time" : params.get("order"),
        category: params.get("category") == undefined ? "" : params.get("category"),
        pageNumber: 0,
        key: params.get("key") == undefined ? "" : params.get("key"),
        desc: false
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
        var desc = "";
        if (pager.desc) desc = "&desc=true";
        xhr.open("get", `${domain}/commodity/list?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}&key=${pager.key}${desc}`)
        xhr.withCredentials = true
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText)
                pager.pageNumber = res.page_num
                if (res.num == 0) {
                    var emptyHtml = `<div id="emptyComment">
                    <p class="emptyComment">这里空空如也</p>
                    <p class="emptyComment">没有找到任何符合条件商品</p>
                    </div>`
                    document.getElementById("data").innerHTML = emptyHtml;
                    return;
                }
                adddata(res)
                show(pager)
            }
        }
    }

    function adddata(res) {
        var dataHtml = ""
        for (let item of res.commodities) {
            var picUri = item.pic
            // 多个图片用,隔开
            picUri = picUri.split(",")[0]
            dataHtml += `<div class="commodity_data" id=${item.id}>
            <span class="imgBox"><img src=${domain+picUri} style="width: 200px;height:200px;" class="displayImg"></span>
            <span class="contentBox">
            <div class="itemTitle">${item.title}</div>
            <div class="itemCategory">类别：${item.category}</div>
            <div class="itemPrice">售价${item.price}元</div>
            <div class="itemStock">销量${item.sales}件</div>
            <div class="itemStock">库存 ${item.stock >= 100 ? "100+件" : "剩余"+item.stock+"件"}</div>
            </span>
            </div>`
        }
        document.getElementById("data").innerHTML = dataHtml
    }

    function show(pager) {
        document.getElementById("keyWord").value = pager.key
        var orderSelect = document.getElementById("orderForm");
        for (i = 0; i < orderSelect.length; i++) {
            if (orderSelect[i].value == pager.order)
                orderSelect[i].selected = true;
        }
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
        document.getElementById("data").addEventListener("click", function (e) {
            var classlist = e.target.parentNode.parentNode.getAttribute('class')
            console.log(classlist)
            if (classlist.search("commodity_data") !== -1) {
                var id = e.target.parentNode.parentNode.getAttribute("id")
                console.log(id)
                location.href = (`goodDetails.html?id=${id}`)
            }
        }, false)
        var btn = document.getElementById('orderBtn');
        btn.onclick = function () {
            var orderForm = document.getElementById("orderForm");
            for (var i = 0; i < orderForm.length; i++) {
                if (orderForm[i].selected == true) {
                    var selectedValue = orderForm[i].value;
                }
            }
            pager.order = selectedValue;
            pager.desc = false;
            request(pager);
            return false;
        }
        var btn1 = document.getElementById('orderBtnDesc');
        btn1.onclick = function () {
            var orderForm = document.getElementById("orderForm");
            for (var i = 0; i < orderForm.length; i++) {
                if (orderForm[i].selected == true) {
                    var selectedValue = orderForm[i].value;
                }
            }
            pager.order = selectedValue;
            pager.desc = true;
            request(pager);
            return false;
        }
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
    // var btn = document.getElementById('orderBtn');
    // btn.onclick = function(){
    //     var orderForm = document.getElementById("orderForm");
    //     for(var i = 0 ; i < orderForm.length ; i ++){
    //         if(orderForm[i].selected == true){
    //             var selectedValue = orderForm[i].value;
    //         }
    //     }
    //     console.log(selectedValue);
    //     createPager({
    //         currentPage: 1,
    //         limit: 20,
    //         divNumber: 7,
    //         order: selectedValue,
    //         category: params.get("category") == undefined ? "" : params.get("category"),
    //         pageNumber: 0,
    //         key: params.get("key") == undefined ? "" : params.get("key")
    //     })
    //     return false;
    // }
    return false;
}
//点击我的订单跳转订单界面
var order = document.getElementById('order');
order.onclick = function () {
    location.href = ("queryOrderList.html");
    return false;
}
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
    location.href = (`${url}`);
    return false;
}