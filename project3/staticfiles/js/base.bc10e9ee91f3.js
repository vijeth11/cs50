window.onload = function(){
    loadBookingTables();
    menuOnLoad();
}

function showToast(message){
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = message;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}