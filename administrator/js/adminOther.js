{
    let local = window.localStorage;
    if (local.getItem("level") != 3) {
        document.getElementById("manage1").style.display = "none";
    }
    if (local.getItem("ifLogin") == 1) {
        document.getElementById("login").style.display = "none";
    }
}