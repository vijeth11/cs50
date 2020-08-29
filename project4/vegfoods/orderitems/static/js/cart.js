function quantityChanged(event,id,price){
    document.getElementById(id).querySelectorAll(".total")[0].innerHTML = "$"+(Number(event.currentTarget.value)*price).toString();
}