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

function itemsFilter(event,type){
    event.preventDefault();
    var productElements = document.getElementsByClassName("shopItems");
    if(type === "All"){
        for(var product of productElements){
            product.classList.remove('filteredCards')
        }
    }
    else if(type === "Vegetables"){
        for(var product of productElements){
            product.classList.remove('filteredCards');
            if(!product.classList.contains(type))
                product.classList.add('filteredCards');
        }
    }
    else if(type === "Fruits"){
        for(var product of productElements){
            product.classList.remove('filteredCards');
            if(!product.classList.contains(type))
                product.classList.add('filteredCards');
        }
    }
    else if(type === "Juice"){
        for(var product of productElements){
            product.classList.remove('filteredCards');
            if(!product.classList.contains(type))
                product.classList.add('filteredCards');
        }
    }
    else if(type === "DriedFruits"){
        for(var product of productElements){
            product.classList.remove('filteredCards');
            if(!product.classList.contains(type))
                product.classList.add('filteredCards');
        }
    }
}

