function quantityChanged(event,id,name,price){
    document.getElementById(id).querySelectorAll(".total")[0].innerHTML = "$"+(Number(event.currentTarget.value)*price).toString();
    addOrRemoveItemToCart(event,name,'Update',Number(event.currentTarget.value))
    var subtotal = 0
    for(var ele of document.querySelectorAll(".total")){
        subtotal += Number(ele.innerHTML.split("$")[1]);
    }
    document.getElementById("Subtotal").innerHTML = "$"+subtotal.toString();
    document.getElementById("Finaltotal").innerHTML = "$"+(subtotal+Number(document.getElementById("Delivery").innerHTML.split("$")[1])+Number(document.getElementById("Discount").innerHTML.split("$")[1])).toString();
}

function validateEnteredCoupon(event){
  event.preventDefault();
  axios({
      headers: { "X-CSRFToken": Cookies.get('csrftoken')},
      method: 'get',
      url:'/coupon/'+document.getElementById("CouponCode").value
  })
  .then(response => {
      console.log(response.data);
      if (response.data.discountamount > 0)
      document.getElementById("Discount").innerHTML = "$"+response.data.discountamount.toString()
      else if(response.data.discountpercent > 0)
      document.getElementById("Discount").innerHTML = "$"+ (Number(document.getElementById("Subtotal").innerHTML.split("$")[1]) * Number(response.data.discountpercent)/100).toString()
      document.getElementById("Finaltotal").innerHTML = "$"+(Number(document.getElementById("Subtotal").innerHTML.split("$")[1])+Number(document.getElementById("Delivery").innerHTML.split("$")[1])-Number(document.getElementById("Discount").innerHTML.split("$")[1])).toString();
     
  })
  .catch(err => {
      console.log(err);
  })
}