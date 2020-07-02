const User = {
    name:null,
    id:null
}

window.onload = function(){
    EmptyCart =  document.getElementById("noOrder");
    EmptyCart.style.display = "block";
    OrderList =  document.getElementById("orders");
    OrderList.style.display = "none";
}

window.addEventListener('scroll', function() {
    var el = document.getElementById('pizza');
    if(el.getBoundingClientRect().top > 80){
        el.classList.add("active");
    }
  });

  function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  window.onclick = function(event) {
    if(event.target == document.getElementById("signupModal")){
        document.getElementById("signupModal").style.display = "none";
        document.body.style.overflow = "visible";
    }  
    else if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


  function signup(){
    document.getElementById("signupModal").style.display = "block";
    document.getElementById("confirmpassword").style.display = "block";
    document.getElementById("email").textContent = "Email *";
    document.getElementById("password").textContent = "Password *";
    document.getElementById("submitButton").textContent = "Finish registration";
    document.getElementById("LoginRoute").style.display = "block";
    document.getElementById("errorMessage").style.display = "none";
      document.getElementById("close").addEventListener('click',()=>{
        document.getElementById("signupModal").style.display = "none";
      });
    document.getElementById("formLoginRegister").onsubmit = function(event){
        event.preventDefault();
        var inputFields = document.getElementById("formLoginRegister").getElementsByTagName("input");
        var token = inputFields[0];
        backendcall('/register/',token.value,new FormData(document.getElementById("formLoginRegister")),event);
    } 
  }

  function login(){
    document.getElementById("signupModal").style.display = "block";
    document.body.style.overflow = "hidden";
    document.getElementById("confirmpassword").style.display = "none";
    document.getElementById("email").textContent = "Login (Email)";
    document.getElementById("password").textContent = "Password";
    document.getElementById("submitButton").textContent = "Login";
    document.getElementById("LoginRoute").style.display = "none";
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("close").addEventListener('click',()=>{
        document.getElementById("signupModal").style.display = "none";
    });
    document.getElementById("formLoginRegister").onsubmit = function(event){
        event.preventDefault();
        var inputFields = document.getElementById("formLoginRegister").getElementsByTagName("input");
        var token = inputFields[0];
        if(Cookies.get('csrftoken')){
            token.value = Cookies.get('csrftoken');
        }
        backendcall('/login/',token.value,new FormData(document.getElementById("formLoginRegister")),event);        
    } 
  }
  
  function logout(){   
    backendcall('/logout/',Cookies.get('csrftoken'),null,null); 
    document.getElementById("Logout").style.display="none";
    document.getElementById("Account").style.display = "block";
    
  }

  function order(id,price,name,plate){
    var formData = new FormData();
    formData.append('price',price);
    formData.append('orderitem',name);
    formData.append('plate',plate);
      axios({
          headers: { "X-CSRFToken": Cookies.get('csrftoken')},
          method: 'post',
          url:'/order/',
          data: formData
      })
      .then(data => {
          EmptyCart.style.display ="none";
          OrderList.style.display = "block";
          OrderList.getElementsByTagName("ul")[0].textContent="";
          setupOrders(data.data.orders);
          document.getElementById("totalprice").textContent = data.data.total;
      })
      .catch(err => {
          console.log(err);
          login();
      })
  }
  

  function backendcall(url,token,formdata,event){
    if(event){
    event.preventDefault();
    }
    axios({
        headers: { "X-CSRFToken": token},
        method:'post',
        url:url,
        data:formdata,
        csrfmiddlewaretoken: '{{ csrf_token }}'
    })
    .then(data => {
        if(data.data && data.data.user){
        User.name = data.data.user;
        User.id = data.data.id;
        document.getElementById("signupModal").style.display = "none";
        document.body.style.overflow = "visible";
        document.getElementById("errorMessage").style.display = "none";
        document.getElementById("Logout").style.display="block";
        document.getElementById("Account").style.display = "none";
        EmptyCart.style.display ="none";
        OrderList.style.display = "block";
        OrderList.getElementsByTagName("ul")[0].textContent="";
        setupOrders(data.data.orders);
        document.getElementById("totalprice").textContent = data.data.total;
        }else{
          User.name = null;
          User.id = null;  
          EmptyCart.style.display ="block";
          OrderList.style.display = "none";
        }
    })
    .catch(err => {
        console.log(err);
        if(err.response && err.response.data){
            document.getElementById("errorMessage").style.display = "block";
            document.getElementById("errorMessage").textContent = err.response.data;
        }
    })
  }


  function setupOrders(orders){
    for(var orderitem of orders){
        var a2 = document.createElement("a");
        a2.setAttribute("class","increase-cart-item cart-icon btn plus theme-plus pull-right");
        a2.setAttribute("href","#");
        a2.innerHTML="+";
        var a1 = document.createElement("a");
        a1.setAttribute("href","#");
        a1.setAttribute("class","decrease-cart-item cart-icon btn plus theme-plus pull-right");
        a1.innerHTML="-";
        var div5 = document.createElement("div");
        div5.appendChild(a1);
        div5.appendChild(a2);
        var span3 = document.createElement("span");
        span3.setAttribute("style","padding-left: 1.5vw;");
        span3.textContent = "$"+orderitem.price.toString();
        var div4 = document.createElement("div");
        div4.append(span3);
        div4.appendChild(div5);
        var div3 = document.createElement("div");
        div3.setAttribute('class','col-sm-4 price'); 
        div3.appendChild(div4);
        var span2 = document.createElement("span");
        span2.setAttribute("class","name");
        span2.textContent = orderitem.name;
        var span1 = document.createElement("span");
        span1.setAttribute("class","quantity");
        span1.textContent= orderitem.plate.toString()+" x ";  
        var div2 = document.createElement("div");
        div2.setAttribute("class","col-sm-7 orderName")
        div2.appendChild(span1);
        div2.appendChild(span2); 
        var div1 = document.createElement("div"); 
        div1.setAttribute("class","row");
        div1.setAttribute("style","width:99%;margin-left:0px");
        div1.appendChild(div2);
        div1.appendChild(div3);
        var li= document.createElement("li");
        li.appendChild(div1);
        OrderList.getElementsByTagName("ul")[0].appendChild(li);
      }
  }