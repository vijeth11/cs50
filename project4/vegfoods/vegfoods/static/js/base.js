window.onscroll = function(){ scrollFunction();}

function scrollFunction()
{
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        document.getElementById("co-navbar").classList.add("scrolled");
      } else {
        document.getElementById("co-navbar").classList.remove("scrolled");
      }
}

function addOrRemoveItemToCart(event,itemName,action,quantity){
  event.preventDefault()
  var formData = new FormData();
  formData.append('itemname',itemName);
  formData.append('action',action);
  formData.append('quantity',quantity);
  axios({
      headers: { "X-CSRFToken": Cookies.get('csrftoken')},
      method: 'post',
      url:'/cart/',
      data: formData
  })
  .then(data => {
      console.log(data);      
      if(action == "Remove"){
        location.reload();
      }else{
        var snackbar = document.getElementById("snackbar");
      snackbar.className = "show";
      document.getElementById("snackbar").getElementsByTagName("span")[0].innerHTML = data.data;
      setTimeout(function(){
        snackbar.className = snackbar.className.replace("show","");
      },3000);
      }
  })
  .catch(err => {
      console.log(err);
  })
}

function signout(event){
event.preventDefault();
axios({
  headers: { "X-CSRFToken": Cookies.get('csrftoken')},
  method: 'post',
  url:'/signout/'
})
.then(data => {
  location.href = "/";
})
.catch(err => {
  console.log(err);
})
}

function addOrRemoveToWishlist(event,id,action,actionbasedon = null){
  event.preventDefault();
  var formdata = new FormData()
  formdata.append('itemId',id)
  formdata.append('action',action)
  axios({
      headers: { "X-CSRFToken": Cookies.get('csrftoken')},
      method: 'post',
      url:'/wishlist/',
      data: formdata
  })
  .then(data => {
      console.log(data);    
      if(action == "remove"){
        if (actionbasedon && actionbasedon === "addtocart"){
          setTimeout(function(){
            location.reload();
          },4000);        
        }
        else{
          location.reload();
        }
      }else{
        if(Number(data.headers["content-length"]) > 1000){
          location.href = '/loginandregister/';
        }else{
            var snackbar = document.getElementById("snackbar");
          snackbar.className = "show";
          document.getElementById("snackbar").getElementsByTagName("span")[0].innerHTML = data.data;
          setTimeout(function(){
            snackbar.className = snackbar.className.replace("show","");
          },3000);
        }
      }       
  })
  .catch(err => {
      console.log(err);
  })
}