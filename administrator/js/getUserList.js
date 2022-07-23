var domain = 'https://forum.wyy.ink';
var manage1 = document.getElementById('manage1');
var hidden1 = document.getElementById('hidden1');
manage1.onclick = function () {
    hidden1.style.display = (hidden1.style.display == 'none' ? 'block' : 'none');
    return false;
}
var manage2 = document.getElementById('manage2');
var hidden2 = document.getElementById('hidden2');
manage2.onclick = function () {
    hidden2.style.display = (hidden2.style.display == 'none' ? 'block' : 'none');
    return false;
}
var back = document.getElementById('back');
back.onclick = function(){
    var shade = document.getElementById('shade');
    shade.style.display = 'none';
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
var idarr = [];
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
                document.getElementById('camera').innerHTML = `<img src="${cameraUri}" style="width: 120px;height:120px;border-radius: 60px;"></img>`;
                document.getElementById('log').innerText = userName;
            } else {
                alert("很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg);
                location.href = "../login.html";
            }
        }
    }

    // 清空userSelect数组
    window.localStorage.setItem("userSelect", "[]");

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
        var local = window.localStorage;
        let array = JSON.parse(local.getItem("userSelect"));
        if (array == null) array = [];
        let numOfSelect = 0;
        for (let item of arg.users) {
            if (item.level == 1) {
                lev = "消费者"
            }
            if (item.level == 2) {
                lev = "商家"
            }
            if (item.level == 3) {
                lev = "管理员"
            }
            let flag = "";
            for (let i = 0; i < array.length; i++) {
                if (array[i] == item.id) {
                    flag = "checked";
                    break;
                }
            }
            if (flag != "") numOfSelect++;
            dataHtml += `<div class="user_data">
            <div class="Check"><input type="checkbox" name="checkUser" id=${item.id} ${flag} class="input"></input></div>
            <div class="picBox"><img class="user_pic" src="${domain+item.avatar_uri}"></img></div>
            <div class="contentBox"><div class="user_level">身份为：${lev}</div>
            <div class="user_username">用户名为：${item.username}</div>
            <button class="user_detail" id=${item.id}>查看用户详情</button></div>
            </div>`
        }
        if (numOfSelect == arg.users.length) {
            document.getElementById("selectAll").innerHTML = "取消全选";
        } else {
            document.getElementById("selectAll").innerHTML = "全选此页";
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
        document.getElementById('data').addEventListener("click", function (e) {
            var classlist = e.target.getAttribute('class');
            var nameList = e.target.getAttribute("name");
            if (classlist.search("user_detail") !== -1) {
                var shade = document.getElementById('shade');
                shade.style.display = 'block';
                var xhr = new XMLHttpRequest();
                xhr.open("get",`${domain}/user/getUser?id=${e.target.id}`,false);
                xhr.withCredentials = true;
                xhr.send();
                if(xhr.status === 200){
                    var res = JSON.parse(xhr.responseText);
                    if(res.status == 0){
                        alert(res.errMsg);
                    }
                    else{
                        var Level = '';
                        if(res.level == 1){
                            Level = '消费者';
                        }
                        if(res.level == 2){
                            Level = '商家';
                        }
                        if(res.level == 3){
                            Level = '管理员';
                        }
                        var html = `<div class="pop">
                        <div class="imgBox">
                            <img src=${domain+res.avatar_uri} class="img">
                        </div>
                        用户名为：<input type="text" class="userName" value="${res.username}"></input><br>
                        身份为：<input type="text" class="userLevel" value="${Level}"></input><br>
                        签名为：<input type="text" class="userSignature" value="${res.signature}"></input><br>
                        <div class="userTime">创建时间为：${res.create_date}</div><br>
                        <button class="user_delete" id="back">返回</button>
                        <button class="user_delete" id="modifi">确认修改</button>
                    </div>`;
                        document.getElementById('shade').innerHTML=html;
                    }
                }
            } else if (classlist.search("user_delete") !== -1) {
                let userid = e.target.id;
                requestDelete(userid);
                setTimeout(() => {
                    request(pager)
                }, 200);
            }
            else if (nameList.search("checkUser") !== -1) {
                let userId = e.target.id;
                let isCheck = e.target.checked;
                clickSelect(userId, isCheck);
            }
            // else if(Class.search("check")!== -1){
            //     if()
            //     idarr.push(e.target.id);
            //     console.log(idarr);
            // }
            var back = document.getElementById('back');
            back.onclick = function(){
                var shade = document.getElementById('shade');
                shade.style.display = 'none';
            }
        },false)

        var all = document.getElementById('selectAll');
        var inputs = document.getElementById('data').getElementsByTagName('input');
        all.onclick = function () {
            if (all.innerHTML == "全选此页") {
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].checked = true;
                    clickSelect(inputs[i].id, true);
                }
                all.innerHTML = "取消全选";
            } else {
                for (var i = 0; i < inputs.length; i++) {
                    inputs[i].checked = false;
                    clickSelect(inputs[i].id, false);
                }
                all.innerHTML = "全选此页";
            }
        }

        var unselectAll = document.getElementById("unselectAll");
        unselectAll.onclick = function () {
            window.localStorage.setItem("userSelect", "[]");
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].checked = false;
                clickSelect(inputs[i].id, false);
            }
        }
    }

    // 选择被点击
    function clickSelect(userId, isCheck) {
        let local = window.localStorage;
        var array = JSON.parse(local.getItem("userSelect"));
        if (array == null) array = [];
        let flag = true;
        for (let i = 0; i < array.length; i++) {
            if (array[i] == userId) {
                if (!isCheck) {
                    array.splice(i, 1);
                }
                flag = false;
                break;
            }
        }
        if (flag && isCheck) array.push(parseInt(userId));
        local.setItem("userSelect", JSON.stringify(array));
        let inputs = document.getElementById('data').getElementsByTagName('input');
        flag = true;
        for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].checked) {
                flag = false;
                break;
            }
        }
        if (flag) {
            document.getElementById("selectAll").innerHTML = "取消全选";
        } else {
            document.getElementById("selectAll").innerHTML = "全选此页";
        }
    }

    //删除通知
    // function requestDelete(userid) {
    //     var xhr4 = new XMLHttpRequest()
    //     xhr4.open("post", `${domain}/admin/deleteUser`)
    //     xhr4.withCredentials = true
    //     xhr4.send(JSON.stringify({
    //         id: userid
    //     }))
    //     xhr4.onreadystatechange = function () {
    //         if (xhr4.readyState === 4 && xhr4.status === 200) {
    //             var res4 = JSON.parse(xhr4.responseText)
    //             if (res4.status == 0) {
    //                 alert(res4.errMsg)
    //             }
    //         }
    //     }
    // }
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