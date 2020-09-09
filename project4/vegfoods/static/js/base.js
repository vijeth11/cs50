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