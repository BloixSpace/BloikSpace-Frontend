//隐藏菜单
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
//点击头像跳转到上传头像界面
var camera = document.getElementById('camera');
camera.onclick = function () {
    location.href = "../uploadPic.html";
    return false;
}

var search = document.getElementById('searchBtn');
search.onclick = function () {
    var keyWord = document.getElementById('keyWord').value;
    console.log(keyWord);
    var url = "manageCommodity.html?key=" + document.getElementById('keyWord').value;
    location.href = (`${url}`);
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
//点击添加新商品弹出框
var add = document.getElementById('add');
var shade = document.getElementById('shade');
add.onclick = function(){
    shade.style.display = 'block';
    return false;
}
//取消弹出
var cancel = document.getElementById('cancel');
cancel.onclick = function(){
    shade.style.display = 'none';
    return false;
}

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
                document.getElementById('camera').innerHTML = `<img src="${cameraUri}" class="cameraImg"></img>`;
                document.getElementById('log').innerText = userName;
            } else {
                alert("很抱歉，登录失败！登录状态为：" + res0.status + "\n失败原因是：" + res0.errMsg);
                location.href = "../login.html";
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
        var local = window.localStorage;
        var desc = "";
        if (pager.desc) {
            desc = "&desc=true";
        }
        var userId = "";
        if (local.level != 3) {
            userId = local.userId;
        }
        var category = "";
        if (pager.category != null) category = "&category=" + pager.category;
        xhr.open("get", `${domain}/commodity/list?page=${pager.currentPage}&page_size=${pager.limit}&order=${pager.order}&key=${pager.key}&user_id=${userId}${desc}${category}`)
        xhr.withCredentials = true
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText)
                pager.pageNumber = res.page_num
                loadCategory(pager);
                adddata(res)
                show(pager)
            }
        }
    }

    function loadCategory(pager) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", `${domain}/commodity/getCategoryList`);
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                var html = `<option value="allSelect">所有</option>`;
                for (let i = 0; i < res.length; i++) {
                    let selected = "";
                    if (pager.category == res[i]) selected = "selected";
                    html += `<option value="${res[i]}" ${selected}>${res[i]}</option>`
                }
                document.getElementById("categoryForm").innerHTML = html;
                document.getElementById("categoryFormInAdd").innerHTML = `<option value="addNew">添加新的</option>` + html;
            }
        };
    }

    function adddata(res) {
        var dataHtml = ""
        for (let item of res.commodities) {
            var picUri = item.pic
            // 多个图片用,隔开
            picUri = picUri.split(",")[0]
            dataHtml += `<div class="commodity_data" id=${item.id}>
            <span class="imgBox"><img src=${domain+picUri} style="width: 200px;height:200px;z-index:1;"></span>
            <span class="contentBox">
            <div class="itemTitle">${item.title}</div>
            <div class="itemCategory">${item.category}类商品</div>
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
        }, false);
        document.getElementById("data").addEventListener("click", function (e) {
            var classlist = e.target.parentNode.parentNode.getAttribute('class')
            console.log(classlist)
            if (classlist.search("commodity_data") !== -1) {
                var id = e.target.parentNode.parentNode.getAttribute("id")
                console.log(id)
                location.href = (`updateCommodity.html?id=${id}`)
            }
        }, false);

        var btn = document.getElementById("orderBtn");
        btn.onclick = function () {
            var orderForm = document.getElementById("orderForm");
            for (var i = 0; i < orderForm.length; i++) {
                if (orderForm[i].selected == true) {
                    var selectedValue = orderForm[i].value;
                }
            }
            console.log(selectedValue);
            pager.desc = false;
            pager.order = selectedValue;
            request(pager);
            return false;
        }
        var btn1 = document.getElementById("orderBtnDesc");
        btn1.onclick = function () {
            var orderForm = document.getElementById("orderForm");
            for (var i = 0; i < orderForm.length; i++) {
                if (orderForm[i].selected == true) {
                    var selectedValue = orderForm[i].value;
                }
            }
            console.log(selectedValue);
            pager.desc = true;
            pager.order = selectedValue;
            request(pager);
            return false;
        }

        var category = document.getElementById("categoryForm");
        category.onchange = function() {
            let nowCategory = null;
            for (let i = 0; i < category.length; i++) {
                if (category[i].selected) {
                    nowCategory = category[i].value;
                }
            }
            if (nowCategory == "allSelect") {
                pager.category = null;
                request(pager);
            } else {
                pager.category = nowCategory;
                request(pager);
            }
        }

        var categoryInAdd = document.getElementById("categoryFormInAdd");
        categoryInAdd.onchange = function() {
            let nowCategory = null;
            for (let i = 0; i < categoryInAdd.length; i++) {
                if (categoryInAdd[i].selected) {
                    nowCategory = categoryInAdd[i].value;
                }
            }
            if (nowCategory == "addNew") {
                document.getElementById("category").style.display = "block";
                document.getElementById("category").value = nowCategory;
            } else {
                document.getElementById("category").style.display = "none";
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

    // 点击提交按钮
    var submitButton = document.getElementById("submit");
    submitButton.onclick = function () {
        var picUris = uploadPictures();
        if (picUris == null) {
            console.log("失败");
            return;
        }
        var title = document.getElementById("title").value;
        var content = document.getElementById("content").value;
        var category = document.getElementById("category").value;
        var price = document.getElementById("price").value;
        var stock = document.getElementById("stock").value;
        var xhr = new XMLHttpRequest();
        xhr.open("post", `${domain}/commodity/add`);
        xhr.withCredentials = true;
        xhr.send(JSON.stringify({
            title: title,
            content: content,
            category: category,
            pic: picUris,
            price: price,
            stock: stock
        }));
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                if (res.status == 1) {
                    alert("添加成功，商品id：" + res.id);
                    // TODO
                    window.location.href = "updateCommodity.html?id=" + res.id;
                } else {
                    alert(res.errMsg);
                }
            }
        }
    }

    // 上传图片们
    function uploadPictures() {
        var templates = document.getElementById("files").files;
        if (templates.length > 5) {
            alert("图片上传数量不能大于5！");
            return null;
        }
        var uri = "";
        for (let i = 0; i < templates.length; i++) {
            var formData = new FormData();
            formData.append("file", templates[i]);
            var xhr = new XMLHttpRequest();
            xhr.open("post", `${domain}/file/upload`, false);
            xhr.withCredentials = true;
            xhr.send(formData);
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.responseText);
                if (res.status == 1) {
                    if (uri != "") uri += ",";
                    uri += res.uri;
                }
            } else {
                console.log(xhr.responseText);
                return null;
            }
        }
        console.log(uri);
        return uri;
    }

    // 选择图片后预览
    var fileChange = document.getElementById("files");
    fileChange.onchange = function () {
        var files = fileChange.files;
        var html = "";
        for (let i = 0; i < files.length; i++) {
            var url = window.URL.createObjectURL(files[i]);
            html += `<img src=${url} style="width:120px;height:120px;overflow: hidden;" class="pic">`;
        }
        document.getElementById("preview").innerHTML = html;
    }

    return false;
}