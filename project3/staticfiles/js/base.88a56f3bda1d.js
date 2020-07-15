window.onload = function(){
    loadBookingTables();
    menuOnLoad();
}

function showToast(message,type=""){
    var x = document.getElementById("snackbar");
    x.innerHTML = message;
    if(type=="error"){
        x.className = "error"
        setTimeout(function(){ x.className = x.className.replace("error", ""); }, 4000);
    }else{
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
    }   
}