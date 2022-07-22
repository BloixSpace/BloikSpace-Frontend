var domain = "https://forum.wyy.ink"
window.onload = function () {
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
    //点击我的订单跳转订单界面
    var order = document.getElementById('order');
    order.onclick = function () {
        location.href = ("queryOrderList.html");
        return false;
    }
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


    var idParams = new URLSearchParams(window.location.search)
    var orderId = idParams.get("id")
    request()

    document.getElementById("orderForm").addEventListener("click", function (e) {
        var classlist = e.target.getAttribute('id')
        if (classlist.search("receiptOrder") !== -1) {
            receiptOrder()
        } else if (classlist.search("updateOrder") !== -1) {
            updateOrder()
        } else if (classlist.search("deleteOrder") !== -1) {
            deleteOrder()
        } else if (classlist.search("addReview") !== -1) {
            location.href = "addReview.html?order_id=" + orderId;
        } else if (classlist.search("updateReview") !== -1) {
            location.href = "updateReview.html?order_id=" + orderId;
        }
    }, false)

    function modifyReview() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", `${domain}/review/getList?order_id=${orderId}`, false);
        xhr.withCredentials = false;
        xhr.send();
        if (xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            console.log(res);
            if (res.num == 0) {
                return false;
            } else {
                return true;
            }
        }
    }

    function updateOrder() {
        var nickname = document.getElementById("nickname").value
        var phone = document.getElementById("phone").value
        var address = document.getElementById("address").value
        var remark = document.getElementById("remark").value

        var xhr2 = new XMLHttpRequest();
        xhr2.open("post", domain + "/order/update")
        xhr2.withCredentials = true
        xhr2.send(JSON.stringify({
            id: orderId,
            nickname: nickname,
            phone: phone,
            address: address,
            remark: remark
        }))
        xhr2.onreadystatechange = function () {
            if (xhr2.readyState === 4 && xhr2.status === 200) {
                var res2 = JSON.parse(xhr2.responseText);
                if (res2.status == 0) {
                    alert(res2.errMsg)
                    return
                } else {
                    alert("订单信息更新成功")
                    request()
                }
            }
        }
        return false
    }

    function deleteOrder() {
        var xhr3 = new XMLHttpRequest();
        xhr3.open("post", domain + "/order/delete")
        xhr3.withCredentials = true
        xhr3.send(JSON.stringify({
            id: orderId
        }))
        xhr3.onreadystatechange = function () {
            if (xhr3.readyState === 4 && xhr3.status === 200) {
                var res3 = JSON.parse(xhr3.responseText);
                if (res3.status == 0) {
                    alert(res3.errMsg)
                    return
                } else {
                    alert("删除成功")
                    window.location.replace("queryOrderList.html")
                }
            }
        }
        return false
    }

    function receiptOrder() {
        var xhr4 = new XMLHttpRequest();
        xhr4.open("post", domain + "/order/receipt")
        xhr4.withCredentials = true
        xhr4.send(JSON.stringify({
            id: orderId
        }))
        xhr4.onreadystatechange = function () {
            if (xhr4.readyState === 4 && xhr4.status === 200) {
                var res4 = JSON.parse(xhr4.responseText);
                if (res4.status == 0) {
                    alert(res4.errMsg)
                    return
                } else {
                    location.reload()
                }
            }
        }
        return false
    }

    function request() {
        var xhr5 = new XMLHttpRequest()
        xhr5.open("get", domain + "/order/query?id=" + orderId)
        xhr5.withCredentials = true;
        xhr5.send()
        xhr5.onreadystatechange = function () {
            console.log(xhr5.responseText)
            if (xhr5.readyState === 4 && xhr5.status === 200) {
                var res5 = JSON.parse(xhr5.responseText)
                if (res5.status == 0) {
                    alert(res5.errMsg)
                    return
                }
                if (res5.receipt_time == undefined && res5.is_ship) {
                    var form = document.getElementById("orderForm").innerHTML
                    form += "<button id='receiptOrder' class='confirm'>确认收货</button>"
                    document.getElementById("orderForm").innerHTML = form
                }
                if (res5.receipt_time != undefined) {
                    var flag = modifyReview();
                    var form = document.getElementById("orderForm").innerHTML
                    if (flag) {
                        form += "<button id='updateReview' class='confirm'>修改/删除评价</button>";
                    } else {
                        form += "<button id='addReview' class='confirm'>添加评价</button>";
                    }
                    document.getElementById("orderForm").innerHTML = form
                }
                document.getElementById("commodityTitle").innerHTML = res5.commodity_title + "<br/>"
                document.getElementById("nickname").value = res5.nickname
                document.getElementById("phone").value = res5.phone
                document.getElementById("address").value = res5.address
                document.getElementById("remark").value = res5.remark
                document.getElementById("orderTime").innerHTML = "下单时间：" + res5.order_time
                document.getElementById("isShip").innerHTML = res5.is_ship ? "已发货" : "未发货"
                if (res5.is_ship) {
                    document.getElementById("shipTime").innerHTML = "发货时间：" + res5.ship_time
                }
                document.getElementById("isReceipt").innerHTML = res5.receipt_time != undefined ? "已确认收货" : "未确认收货"
                if (res5.receipt_time != undefined) {
                    document.getElementById("receiptTime").innerHTML = "收货时间：" + res5.receipt_time
                }
                document.getElementById("commodityPic").innerHTML = `<img src=${domain + res5.commodity_pic.split(",")[0]} style="width: 200px;height:200px;border-radius: 0px;">`
            }
        }
    }
    return false;
}