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
window.onload = function(){
    //分页
    var defaultPager = {
        currentPage: 1,
        limit: 10,
        divNumber: 5,
        order: "time",
        unread: false,
        pageNumber: 0
    }
    createPager({
        currentPage: 1,
        limit: 2,
        divNumber: 5,
        order: "username",
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
        var xhr2 = new XMLHttpRequest()
        xhr2.open("get", `${domain}/user/getUserList?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}`)
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
        var lev = '';
        for (let item of arg.users) {
            if(item.level == 1){
                lev = "消费者"
            }
            if(item.level == 2){
                lev = "商家"
            }
            if(item.level == 3){
                lev = "管理员"
            }
            dataHtml += `<div class="user_data">
            <img class="user_pic" src="${domain+item.avatarUri}"></img>
            <div class="user_level">身份${lev}</div>
            <div class="user_id">用户id为${item.id}</div>
            <div class="user_username">用户名${item.username}</div>
            <span class="user_signature">用户的签名${item.signature}</span>
            <button class="user_delete">删除此通知</button>
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
        // document.getElementById("data").addEventListener("click", function (e) {
        //     var classlist = e.target.getAttribute('class')
        //     console.log(classlist);
        //     if (classlist.search("read_notice") !== -1) {
        //         let noticeId = e.target.id
        //         requestRead(noticeId)
        //         setTimeout(() => {
        //             request(pager)
        //         }, 200);
        //     } else if (classlist.search("delete_notice") !== -1) {
        //         let noticeId = e.target.id
        //         requestDelete(noticeId)
        //         setTimeout(() => {
        //             request(pager)
        //         }, 200);
        //     } else if (classlist.search("order_detail") !== -1) {
        //         let orderId = e.target.id;
        //         location.href = "orderDetail.html?id=" + orderId;
        //     }
        // }, false)
        // var read = document.getElementById('read');
        // read.onclick = function () {
        //     pager.unread = false;
        //     request(pager);
        //     return false;
        // }
        // var unread = document.getElementById('unread');
        // unread.onclick = function () {
        //     pager.unread = true;
        //     request(pager);
        //     return false;
        // }
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