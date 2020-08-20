load();

function load(){
    var headerOptions = document.querySelector(".product-category").getElementsByTagName("li");
    for(var element of headerOptions){
        element.firstElementChild.addEventListener('click',function(event){       
            for(var el of headerOptions)  {
                el.firstElementChild.className = "";
            }  
            event.target.className = "active";
            event.preventDefault();
        });
    }
}