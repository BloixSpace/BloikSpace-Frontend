window.onload = function () {
    var domain = "https://forum.wyy.ink";
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

    var params = new URLSearchParams(window.location.search);
    var commodityId = params.get("id");

    var xhr = new XMLHttpRequest();
    xhr.open("get", `${domain}/commodity/get?id=${commodityId}`);
    xhr.withCredentials = true;
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            if (res.status != 1) {
                alert(res.errMsg);
                return;
            }
            document.getElementById("title").value = res.title;
            document.getElementById("content").value = res.content;
            document.getElementById("category").value = res.category;
            document.getElementById("price").value = res.price;
            document.getElementById("stock").value = res.stock;
            var uris = res.pic.split(",");
            var html = "";
            for (let i = 0; i < uris.length; i++) {
                html += `<img src=${domain + uris[i]} style="width:100px;height:100px;overflow: hidden;">`;
            }
            document.getElementById("preview").innerHTML = html;
        }
    }
    var Price = document.getElementById('price');
    Price.onblur = function(){
        if(Price.value == 0){
            Price.value = 0;
            Price.style.color = 'red';
        }
        else if(Price.value <= 0){
            Price.value = 0;
            Price.style.color = 'red';
        }
        return false;
    }
    Price.onclick = function(){
        Price.style.color = 'black';
    }
    var Stock = document.getElementById('stock');
    Stock.onblur = function(){
        if(Stock.value<=0){
            Stock.value = 0;
            Stock.style.color = 'red';
        }
        else {
            Stock.value = Math.floor(Stock.value);
            Stock.style.color = 'red';
        }
        return false;
    }
    Stock.onclick = function(){
        Stock.style.color = 'black';
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
        xhr.open("post", `${domain}/commodity/update`);
        xhr.withCredentials = true;
        xhr.send(JSON.stringify({
            id: commodityId,
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
                    alert("修改成功");
                    // TODO
                    location.href = "manageCommodity.html"
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
            html += `<img src=${url} style="width:100px;height:100px;overflow: hidden;"><br>`;
        }
        document.getElementById("preview").innerHTML = html;
    }
    return false;
}
//点击头像跳转到上传头像界面
var camera = document.getElementById('camera');
camera.onclick = function () {
    location.href = "../uploadPic.html";
    return false;
}
//点击修改密码跳转修改密码界面
var newpswd = document.getElementById('newpswd');
newpswd.onclick = function () {
    window.open("../changePswd.html");
    return false;
}
//点击我的通知到通知界面
var notice = document.getElementById('notice');
notice.onclick = function () {
    location.href = "../notice.html";
    return false;
}
//点击我的订单跳转订单界面
var order = document.getElementById('order');
order.onclick = function () {
    window.open("../queryOrderList.html");
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
            var storage1 = JSON.parse(xhr1.responseText);
            if (storage1.status == '0' && storage1.errMsg == '未登录') {
                alert('您已退出登录');
                console.log("已经成功登出");
                window.localStorage.ifLogin = '0';
                window.open("../homePage.html");
            }
        }
    }
    return false;
}