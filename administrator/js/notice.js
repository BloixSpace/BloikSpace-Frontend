var domain = 'https://forum.wyy.ink';
window.onload = function () {
    // //检查登录状态，更新头像及用户名
    // var cameraUri, userName;
    // var xhr0 = new XMLHttpRequest();
    // xhr0.open("get", "https://forum.wyy.ink/user/getUserInfo");
    // xhr0.withCredentials = true;
    // xhr0.setRequestHeader('Content-Type', 'application/json');
    // xhr0.send();
    // xhr0.onreadystatechange = function () {
    //     if (xhr0.readyState === 4 && xhr0.status === 200) {
    //         var res0 = JSON.parse(xhr0.responseText);
    //         if (res0.status == '1') {
    //             cameraUri = 'https://forum.wyy.ink' + res0.avatar_uri;
    //             console.log(cameraUri);
    //             userName = '你好,' + res0.username;
    //             document.getElementById('camera').innerHTML = `<img src="${cameraUri}" style="width: 40px;height:40px;border-radius: 20px;"></img>`;
    //             document.getElementById('log').innerText = userName;
    //         } else {
    //             alert("很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg);
    //             location.href = "login.html";
    //         }
    //     }
    // }
    // //点击头像跳转到上传头像界面
    // var camera = document.getElementById('camera');
    // camera.onclick = function () {
    //     location.href = "uploadPic.html";
    //     return false;
    // }
    // //点击我的通知到通知界面
    // var notice = document.getElementById('notice');
    // notice.onclick = function () {
    //     location.href = "notice.html";
    //     return false;
    // }
    // //点击我的订单跳转订单界面
    // var order = document.getElementById('order');
    // order.onclick = function () {
    //     location.href = ("queryOrderList.html");
    //     return false;
    // }
    // //点击修改密码跳转修改密码界面
    // var newpswd = document.getElementById('newpswd');
    // newpswd.onclick = function () {
    //     location.href = ("changePswd.html");
    //     return false;
    // }
    // //点击取消重置
    // var cancel = document.getElementById('cancel');
    // cancel.onclick = function () {
    //     location.reload();
    //     return false;
    // }
    // //点击二级菜单的退出登录实现登出，登出接口
    // var logout = document.getElementById('logout');
    // logout.onclick = function () {
    //     var xhr1 = new XMLHttpRequest();
    //     var url = 'https://forum.wyy.ink/user/logout';
    //     xhr1.open("GET", url, true);
    //     xhr1.withCredentials = true;
    //     xhr1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //     xhr1.send();
    //     xhr1.onreadystatechange = function () {
    //         if (xhr1.readyState === 4 && xhr1.status === 200) {
    //             var storage = JSON.parse(xhr1.responseText);
    //             console.log("已经成功登出");
    //             window.localStorage.ifLogin = '0';
    //             location.href = "homePage.html";
    //         }
    //     }
    //     return false;
    // }

    //分页
    var defaultPager = {
        currentPage: 1,
        limit: 20,
        divNumber: 7,
        order: "time",
        unread: false,
        pageNumber: 0
    }
    createPager({
        currentPage: 1,
        limit: 20,
        divNumber: 7,
        order: "time",
        unread: null,
        pageNumber: 0
    })

    function createPager(pager) {
        var pager = Object.assign(defaultPager, pager)
        request(pager)
        bindEvent(pager)
    }
    // get通知列表
    function request(pager) {
        console.log("request执行了")
        console.log(`${domain}/notice/getList?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}`)
        var xhr2 = new XMLHttpRequest()
        console.log(pager.limit)
        var unread = '';
        if (pager.unread !== null) {
            unread = pager.unread ? "true" : "false"
        }
        xhr2.open("get", `${domain}/notice/getList?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}&unread=${unread}`)
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

    // 动态渲染
    function adddata(arg) {
        var dataHtml = ""
        for (let item of arg.notices) {
            switch (item.class) {
                case "order add":
                    item.class = "消息类别：订单添加"
                    break
                case "order delete":
                    item.class = "消息类别：订单删除"
                    break
                case "order update":
                    item.class = "消息类别：订单更改"
                    break
                case "commodity stock":
                    item.class = "消息类别：商品补货"
                    break
                case "order receipt":
                    item.class = "消息类别：订单签收"
                    break
                case "order ship":
                    item.class = "消息类别：订单发货"
                    break
            }
            var unreadstr = ""
            if (item.unread) {
                unreadstr = `<button class="read_notice" id=${item.id}>标为已读</button>`
            }
            var detail = "";
            if (item.class != "消息类别：订单删除") {
                detail = `<button class="order_detail" id=${item.order_id}>订单详情</button>`
            }
            dataHtml += `<div class="notice_data">
            <div class="class">${item.class}</div>
            <div class="content">${item.content}</div>
            <span class="time">${item.time}</span>
            <span class="ifread">${item.unread == true ? "状态：未读" : "状态：已读"}</span>
            <button class="delete_notice" id=${item.id}>删除此通知</button>
            ${unreadstr}
            ${detail}
            </div>`
        }
        document.getElementById("data").innerHTML = dataHtml
    }
    //多页展示
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
            item += `<span class="first"> 首页 </span>
           <span class="prev"> 上一页 </span>`
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
            item += `<span class="next"> 下一页 </span>
           <span class="last"> 尾页 </span>`
        }
        item += `<span class="total"> 共  <span class="numberselected">${pager.pageNumber}</span>页 </span>`
        document.getElementById("pager").innerHTML = item
    }
    //点击页码跳转
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
            var classlist = e.target.getAttribute('class')
            console.log(classlist);
            if (classlist.search("read_notice") !== -1) {
                let noticeId = e.target.id
                requestRead(noticeId)
                setTimeout(() => {
                    request(pager)
                }, 200);
            } else if (classlist.search("delete_notice") !== -1) {
                let noticeId = e.target.id
                requestDelete(noticeId)
                setTimeout(() => {
                    request(pager)
                }, 200);
            } else if (classlist.search("order_detail") !== -1) {
                let orderId = e.target.id;
                location.href = "orderDetail.html?id=" + orderId;
            }
        }, false)
        var read = document.getElementById('read');
        read.onclick = function () {
            pager.unread = false;
            request(pager);
            return false;
        }
        var unread = document.getElementById('unread');
        unread.onclick = function () {
            pager.unread = true;
            request(pager);
            return false;
        }
    }
    //已读未读
    function requestRead(noticeId) {
        var xhr3 = new XMLHttpRequest()
        xhr3.open("post", `${domain}/notice/read`)
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
    //删除通知
    function requestDelete(noticeId) {
        var xhr4 = new XMLHttpRequest()
        xhr4.open("post", `${domain}/notice/delete`)
        xhr4.withCredentials = true
        xhr4.send(JSON.stringify({
            id: noticeId
        }))
        xhr4.onreadystatechange = function () {
            if (xhr4.readyState === 4 && xhr4.status === 200) {
                var res4 = JSON.parse(xhr4.responseText)
                if (res4.status == 0) {
                    alert(res4.errMsg)
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