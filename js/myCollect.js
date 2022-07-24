var domain = 'https://forum.wyy.ink';
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
    //点击头像跳转到上传头像界面
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
        location.href = ("queryOrderList.html");
        return false;
    }
    //点击修改密码跳转修改密码界面
    var newpswd = document.getElementById('newpswd');
    newpswd.onclick = function () {
        location.href = ("changePswd.html");
        return false;
    }
    //点击取消重置
    var cancel = document.getElementById('cancel');
    cancel.onclick = function () {
        location.reload();
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

    //分页
    var defaultPager = {
        currentPage: 1,
        limit: 20,
        divNumber: 7,
        order: "time",
        pageNumber: 0
    }
    createPager({
        currentPage: 1,
        limit: 20,
        divNumber: 7,
        order: "commodity_id",
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
        console.log(`${domain}/star/list?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}`)
        var xhr2 = new XMLHttpRequest()
        console.log(pager.limit)
        xhr2.open("get", `${domain}/star/list?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}`)
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
        for (let item of arg.stars) {
            var picUri = item.pic
            // 多个图片用,隔开
            picUri = picUri.split(",")[0]
            dataHtml += `<div class="commodity_data" id=${item.commodity_id}>
            <span class="imgBox"><img src=${domain+picUri} style="width: 200px;height:200px;z-index:1;"></span>
            <span class="contentBox">
            <div class="itemTitle">${item.title}</div>
            <div class="itemPrice">售价${item.price}元</div>
            <div class="itemStock">销量${item.sales}件</div>
            <div class="itemStock">库存 ${item.stock >= 100 ? "100+件" : "剩余"+item.stock+"件"}</div>
            <button id=${item.commodity_id} class="detail">查看商品详情</button>
            <button id=${item.commodity_id} class="delete">取消收藏</button>
            </span>
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
            if (classlist.search("detail") !== -1) {
                let commodityId = e.target.id
                location.href = `goodDetails.html?id=${commodityId}`;
            }
            else if(classlist.search("delete")!== -1) {
                let commodityId = e.target.id;
                var xhr = new XMLHttpRequest();
                xhr.open("post",`${domain}/star/delete`);
                xhr.withCredentials = true;
                xhr.send(JSON.stringify({
                    commodity_id:commodityId
                }));
                xhr.onreadystatechange = function(){
                    if(xhr.readyState === 4 && xhr.status === 200){
                        request(pager);
                    }
                }
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