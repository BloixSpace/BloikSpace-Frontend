var domain = 'https://forum.wyy.ink';
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
                document.getElementById('camera').innerHTML = `<img src="${cameraUri}" style="width: 120px;height:120px;border-radius: 60px;"></img>`;
                document.getElementById('log').innerText = userName;
            } else {
                alert("很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg);
                location.href = "../login.html";
            }
        }
    }
    var defaultPager = {
        currentPage: 1,
        limit: 10,
        divNumber: 7,
        order: "order_time",
        unread: false,
        pageNumber: 0,
        isShip: null
    }
    createPager({
        currentPage: 1,
        limit: 10,
        divNumber: 7,
        order: "order_time",
        unread: false,
        pageNumber: 0,
        isShip: null
    })

    function createPager(pager) {
        var pager = Object.assign(defaultPager, pager)
        request(pager)
        bindEvent(pager)
    }

    function request(pager) {
        console.log("request执行了")
        var xhr2 = new XMLHttpRequest()
        console.log(pager.limit)
        var url = `${domain}/order/sellerQueryList?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}`
        if (pager.isShip != null) {
            url += `&is_ship=${pager.isShip}`
        }
        xhr2.open("get", url)
        xhr2.withCredentials = true
        xhr2.send()
        xhr2.onreadystatechange = function () {
            if (xhr2.readyState === 4 && xhr2.status === 200) {
                var res2 = JSON.parse(xhr2.responseText)
                pager.pageNumber = res2.page_num
                adddata(res2)
                show(pager)
            }
        }
    }

    function adddata(res2) {
        var dataHtml = ""
        for (let item of res2.orders) {
            dataHtml += `<div class="order_data" id=${item.id}>
            <div class="item_id">商品编号为：${item.commodity_id}</div>
            <div class="item_address">收货地址：${item.address}</div>
            <div class="item_phone">收件人手机：+86 ${item.phone}</div>
            <div class="item_nickname">收件人昵称：${item.nickname}</div>
            <span class="item_ship">${item.is_ship == true ? "已发货" : "未发货"}</span>
            <span class="item_ship">${item.receipt_time != undefined ? "已确认收货" : "未确认收货"}</span>
            <button class="order_detail" id=${item.id}>查看订单详情</button>
            <button class="delete_order" id=${item.id}>删除订单</button>
            </div>`
        }
        document.getElementById("data").innerHTML = dataHtml
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
        //点击查看详情实现跳转
        document.getElementById("data").addEventListener("click", function (e) {
            var classlist = e.target.getAttribute('class')
            if (classlist.search("delete_order") !== -1) {
                let noticeId = e.target.id
                console.log(e.target);
                console.log(noticeId);
                requestDelete(noticeId)
                setTimeout(() => {
                    request(pager)
                }, 200);
            } else if (classlist.search("order_detail") !== -1) {
                let orderId = e.target.id
                window.location.href = "orderDetail.html?id=" + orderId
            }
        }, false)
        document.getElementById("operate").addEventListener("click", function (e) {
            var clickId = e.target.getAttribute('id')
            if (clickId == "ship") {
                pager.isShip = true;
                request(pager);
            } else if (clickId == "unship") {
                pager.isShip = false;
                request(pager);
            } else if (clickId == "cancel") {
                location.reload();
            }
        }, false)
    }
    //删除订单
    function requestDelete(noticeId) {
        var xhr3 = new XMLHttpRequest()
        xhr3.open("post", `${domain}/order/delete`)
        xhr3.withCredentials = true
        xhr3.send(JSON.stringify({
            id: noticeId
        }))
        xhr3.onreadystatechange = function () {
            if (xhr3.readyState === 4 && xhr3.status === 200) {
                var res3 = JSON.parse(xhr3.responseText)
                if (res3.status == 0) {
                    alert(res3.errMsg)
                }
            }
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
    return false;
}