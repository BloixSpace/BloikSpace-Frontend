// 管理员右上角隐藏菜单跳转
{
    let local = window.localStorage;
    if (local.level >= 2 && local.ifLogin == 1) {
        document.getElementById("rightMenu").style.height = '350px';
        document.getElementById("manageCommodity").style.display = 'block';
        document.getElementById("manageOrder").style.display = 'block';
    } else {
        document.getElementById("rightMenu").style.height = '250px';
        document.getElementById("manageCommodity").style.display = 'none';
        document.getElementById("manageOrder").style.display = 'none';
    }
}
var manageCommodity = document.getElementById('manageCommodity');
manageCommodity.onclick = function () {
    location.href = ("admin/manageCommodity.html");
    return false;
}
var manageOrder = document.getElementById('manageOrder');
manageOrder.onclick = function () {
    location.href = ("admin/manageOrder.html");
    return false;
}