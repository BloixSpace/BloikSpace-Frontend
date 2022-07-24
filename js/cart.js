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
    var domain = "https://forum.wyy.ink"
    //分页
    var defaultPager = {
        currentPage: 1,
        limit: 20,
        divNumber: 5,
        order: "time",
        pageNumber: 0
    }
    createPager({
        currentPage: 1,
        limit: 20,
        divNumber: 5,
        order: "time",
        pageNumber: 0
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
        xhr.open("get", `${domain}/cart/getList?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}`)
        xhr.withCredentials = true
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText)
                pager.pageNumber = res.page_num
                adddata(res)
                show(pager)
            }
        }
    }

    function adddata(arg) {
        var dataHtml = ""
        var totalPrice = 0;
        for (let item of arg.commodities) {
            totalPrice += item.price*item.buy_num;
            dataHtml += `<div class="cart" id="cart_data">`;
            if (item.buy_num > item.stock) {
                dataHtml += `<div class="commodity_title">无效（购买量大于库存量）</div>`
            }
            dataHtml += `<span class="picBox">
            <img class="pic" src=${domain+item.pic.split(",")[0]}></span>
            <div class="contentBox">
            <div class="commodity_title"><span>${item.title}</span>
            <span class="commodity_price">¥${item.price.toFixed(2)}</span>
            </div>
            <div class="num" id=${item.buy_num}>购买数量：<button class="minus" id=${item.id}> - </button> <span>${item.buy_num}</span> <button class="add" id=${item.id}> + </button>
            <span class="commodity_price">总价 ¥${item.price*item.buy_num.toFixed(2)}</span></div>
            <div class="commodity_stock">库存：${item.stock}</div>
            <button class="delete" id="${item.id}">删除该商品</button>
            </div>
        </div>`
        }
        document.getElementById("totalPrice").innerHTML = `¥${totalPrice.toFixed(2)}`;
        document.getElementById("totalPrice").style.fontSize = "23px"
        document.getElementById("cartBox").innerHTML = dataHtml
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

        document.getElementById("cartBox").addEventListener("click", function (e) {
            var c = e.target.getAttribute('class')
            console.log(c);
            if (c.search("delete") !== -1) {
                let delete_id = e.target.id
                Delete(delete_id)
                setTimeout(() => {
                    request(pager)
                }, 200);
            }
        }, false)

        document.getElementById('cartBox').addEventListener("click",function(e){
            var btnClass = e.target.getAttribute('class');
            if(btnClass.search('add')!== -1){
                let btnid = e.target.id;
                let buyNumber = e.target.parentNode.id;
                e.target.previousElementSibling.innerText = buyNumber++;
                var xhr = new XMLHttpRequest();
                xhr.open("post",`${domain}/cart/update`);
                xhr.withCredentials = true;
                xhr.send(JSON.stringify({
                    id:btnid,
                    buy_num:buyNumber++
                }))
                if(xhr.readyState === 4 && xhr.status === 200){
                    var res = JSON.parse(xhr.responseText);
                    if(res.status == 1){
                        window.onload();
                    }
                }
            }
        },false)

        var empty = document.getElementById('empty');
        empty.onclick = function () {
            var xhr = new XMLHttpRequest()
            xhr.open("get", `${domain}/cart/empty`)
            xhr.withCredentials = true
            xhr.send()
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var res = JSON.parse(xhr.responseText)
                    if (res.status == 0) {
                        alert(res.errMsg)
                    } else if (res.status == 1) {
                        alert("确认清空？")
                        request(pager);
                    }
                }
            }

            return false;
        }
    }
    //删除购物车
    function Delete(delete_id) {
        var xhr = new XMLHttpRequest()
        xhr.open("post", `${domain}/cart/delete`)
        xhr.withCredentials = true
        xhr.send(JSON.stringify({
            id: delete_id
        }))
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText)
                if (res.status == 0) {
                    alert(res.errMsg)
                }
            }
        }
    }
    //跳转页码
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
//点击我的订单跳转订单界面
var order = document.getElementById('order');
order.onclick = function () {
    window.open("queryOrderList.html", "_self");
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
    window.open("changePswd.html", "_self");
    return false;
}
//点击我的通知到通知界面
var notice = document.getElementById('notice');
notice.onclick = function () {
    location.href = "notice.html";
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
var settle = document.getElementById('settle');
settle.onclick = function () {
    location.href = "settle.html";
    return false;
}