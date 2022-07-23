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
var idarr=[];
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
            <div class="Check"><input type="checkbox" name="check" id=${item.id} class="input">删除该用户</input></div>
            <div class="picBox"><img class="user_pic" src="${domain+item.avatar_uri}"></img></div>
            <div class="contentBox"><div class="user_level">身份为：${lev}</div>
            <div class="user_username">用户名为：${item.username}</div>
            <button class="user_detail" id=${item.id}>查看用户详情</button></div>
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
        document.getElementById('data').addEventListener("click",function(e){
            var classlist = e.target.getAttribute('class');
            if(classlist.search("user_detail")!== -1){
                var shade = document.getElementById('shade');
                shade.style.display = 'block';
            }
            else if(classlist.search("user_delete")!== -1){
                let userid = e.target.id;
                requestDelete(userid);
                setTimeout(() => {
                    request(pager)
                }, 200);
            }
            // else if(Class.search("check")!== -1){
            //     if()
            //     idarr.push(e.target.id);
            //     console.log(idarr);
            // }
        },false)
        var all = document.getElementById('all');
        var inputs = document.getElementById('data').getElementsByTagName('input');
        all.onclick = function(){
            for(var i=0 ; i<inputs.length ; i++){
                inputs[i].checked = this.checked;
            }
        }
        for(var i=0; i< inputs.length ; i++){
            inputs[i].onclick = function(){
                var flag = true;
                for(var j=0; j<inputs.length ;j++){
                    if(!inputs[j].checked){
                        flag = false;
                        break;
                    }
                }
                all.checked = flag;
            }
        }
    }
    //删除通知
    function requestDelete(userid) {
        var xhr4 = new XMLHttpRequest()
        xhr4.open("post", `${domain}/admin/deleteUser`)
        xhr4.withCredentials = true
        xhr4.send(JSON.stringify({
            id: userid
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
