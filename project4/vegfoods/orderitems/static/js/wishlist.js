function addAndDeleteTheItem(event,name,id){
    addOrRemoveItemToCart(event,name,'Add',1);
    addOrRemoveToWishlist(event,id,'remove',"addtocart");
}