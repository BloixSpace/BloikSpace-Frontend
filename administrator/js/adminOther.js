{
    let local = window.localStorage;
    if (local.getItem("level") != 3) {
        document.getElementById("manage1").style.display = "none";
    }
}