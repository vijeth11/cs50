var deliveryDate = null;
var streetElement = null;
var streetNumberElement = null;
var cityElement = null;
var apartmentNumberElement = null;
var floorElement = null;
var firstNameElement = null;
var lastNameElement = null;
var emailElement = null;
var phoneElement = null;
var orders = null;

const User = {
    name:null,
    id:null
}

function menuOnLoad(){
      EmptyCart =  document.getElementById("noOrder");
      OrderList =  document.getElementById("orders");
      if(EmptyCart && OrderList)
      {
        EmptyCart.style.display = "block";    
        OrderList.style.display = "none";
          axios({
              method: 'get',
              url:'/orderItems/',
          })
          .then(data => {
              if(data.data.orders.length > 0)
              {
                EmptyCart.style.display ="none";
                OrderList.style.display = "block";
                OrderList.getElementsByTagName("ul")[0].textContent="";              
                document.getElementById("totalprice").textContent = data.data.total;
                setupOrders(data.data.orders);              
              }else{
                EmptyCart.style.display ="block";
                OrderList.style.display = "none";
                document.getElementById("totalprice").textContent = 0;
              }
              orders = data.data.orders;
              document.getElementById("signupModal").style.display = "none";
              document.body.style.overflow = "visible";
              document.getElementById("errorMessage").style.display = "none";
              document.getElementById("Logout").style.display="block";
              document.getElementById("Account").style.display = "none";              
          })
          .catch(err => {
              console.log(err);
              login();
          });
      }
      if(document.getElementsByName("deliveryDate").length > 0){
        // var nextWeekDate = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        var today = new Date().toISOString().split('T')[0];
        document.getElementsByName("deliveryDate")[0].setAttribute('min', today);
        //document.getElementsByName("toDate")[0].setAttribute('max', nextWeekDate);
        document.getElementsByName("deliveryDate")[0].setAttribute('onchange',"displayTime(event)")
      }
      var input = document.querySelector("#phone");
      if(input){
        window.intlTelInput(input, {
        // any initialisation options go here
        initialCountry: "in",
        separateDialCode: true
        });
      }
      streetElement = document.querySelector("input[name='street']");
      streetNumberElement = document.querySelector("input[name='streetNumber']");
      cityElement = document.querySelector("input[name='city']");
      apartmentNumberElement = document.querySelector("input[name='apartmentNumber']");
      floorElement = document.querySelector("input[name='floorNumber']");
      firstNameElement = document.querySelector("input[name='firstName']");
      lastNameElement = document.querySelector("input[name='lastName']");
      emailElement = document.querySelector("input[name='email']");
      phoneElement = document.querySelector("input[name='phone']");
      deliveryDate = document.querySelector("input[name='deliveryDate']");
} 

window.addEventListener('scroll', function() {
    var el = document.getElementById('pizza');
    if(el && el.getBoundingClientRect().top > 80){
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
    else if(event.target == document.getElementById("toppingsModal")){
        let selectedToppings = []
        for(let input of document.getElementById("toppingsform").querySelectorAll('input[type="checkbox"]:checked')){
            selectedToppings.push(input.nextElementSibling.innerText);
        }
        console.log(selectedToppings);
        document.getElementById("toppingsModal").style.display = "none";
        document.body.style.overflow = "visible";
    }
    else if(event.target == document.getElementById("checkoutModal")){
       document.getElementById("checkoutModal").style.display = "none";
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
    document.body.style.overflow = "hidden";
    document.getElementById("confirmpassword").style.display = "block";
    document.getElementById("email").textContent = "Email *";
    document.getElementById("password").textContent = "Password *";
    document.getElementById("submitButton").textContent = "Finish registration";
    document.getElementById("LoginRoute").style.display = "block";
    document.getElementById("errorMessage").style.display = "none";
      document.getElementById("close").addEventListener('click',()=>{
        document.body.style.overflow = "visible";
        document.getElementById("signupModal").style.display = "none";
      });
    document.getElementById("formLoginRegister").onsubmit = function(event){
        event.preventDefault();
        var inputFields = document.getElementById("formLoginRegister").getElementsByTagName("input");
        var token = inputFields[0];
        backendcall('/register/',token.value,new FormData(document.getElementById("formLoginRegister")),event);
    } 
  }

  function toppings(price,name,plate,itemType,preSelectedString){
    document.getElementById("toppingsModal").style.display = "block";
    document.body.style.overflow = "hidden";
    preSelectedString = preSelectedString.split(",").map(function(element) {return element.trim();})
    for(var element of document.getElementById("toppingsform").getElementsByTagName("input")){        
        if(preSelectedString.findIndex(el => el.toLowerCase() == element.nextElementSibling.innerText.toLowerCase()) > -1){
          element.checked = true;
        }else{
          element.checked = false;
        }
        element.addEventListener("click",(event)=>{
            if(event.target.parentElement.parentElement.querySelectorAll('input[type="checkbox"]:checked').length === 3){
                for(var input of event.target.parentElement.parentElement.querySelectorAll('input[type="checkbox"]:not(:checked)')){
                    input.setAttribute("disabled","");
                }
            }else{
              for(var input of event.target.parentElement.parentElement.querySelectorAll('input[type="checkbox"]:not(:checked)')){
                input.removeAttribute("disabled");
              }
            }
        });
    }
    for(let input of document.getElementById("toppingsform").querySelectorAll('input[type="checkbox"]')){
      input.removeAttribute("disabled");
    }
    if(document.getElementById("toppingsform").querySelectorAll('input[type="checkbox"]:checked').length >= 3){
      for(var input of document.getElementById("toppingsform").querySelectorAll('input[type="checkbox"]:not(:checked)')){
          input.setAttribute("disabled","");
      }
    }
    document.getElementById("closetoppings").addEventListener('click',()=>{
        let selectedToppings = []
        for(let input of document.getElementById("toppingsform").querySelectorAll('input[type="checkbox"]:checked')){
            selectedToppings.push(input.nextElementSibling.innerText);
        }
        order(price,name,plate,itemType,selectedToppings.toString());
        document.body.style.overflow = "visible";
        document.getElementById("toppingsModal").style.display = "none";
      });
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
        document.body.style.overflow = "visible";
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

  function order(price,name,plate,itemtype,toppings=""){
    var formData = new FormData();
    formData.append('price',price);
    formData.append('orderitem',name);
    formData.append('plate',plate);
    formData.append('itemtype',itemtype);
    formData.append('selectedToppings',toppings)
      axios({
          headers: { "X-CSRFToken": Cookies.get('csrftoken')},
          method: 'post',
          url:'/order/',
          data: formData
      })
      .then(data => {
          if(data.data.orders.length > 0){
            EmptyCart.style.display ="none";
            OrderList.style.display = "block";
            OrderList.getElementsByTagName("ul")[0].textContent="";
            setupOrders(data.data.orders);
            document.getElementById("totalprice").textContent = data.data.total;
          }else{
            EmptyCart.style.display ="block";
            OrderList.style.display = "none";
            document.getElementById("totalprice").textContent = 0;
          }          
          showToast('Order added from menu item');
          orders = data.data.orders;
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
        if(data.data.orders.length > 0 ){
          EmptyCart.style.display ="none";
          OrderList.style.display = "block";
          OrderList.getElementsByTagName("ul")[0].textContent="";
          setupOrders(data.data.orders);
          document.getElementById("totalprice").textContent = data.data.total;
        }else{
          EmptyCart.style.display ="block";
          OrderList.style.display = "none";
          document.getElementById("totalprice").textContent = 0;
        }
        orders = data.data.orders;        
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
        if(Number(orderitem.plate) > 0){
            var a2 = document.createElement("a");
            a2.setAttribute("class","increase-cart-item cart-icon btn plus theme-plus pull-right");
            a2.setAttribute("href","#!");
            a2.setAttribute("onclick","order("+orderitem.price+",'"+orderitem.name+"',1,'"+orderitem.itemtype+"','"+orderitem.selectedtoppings.toString()+"')");
            a2.innerHTML="+";
            var a1 = document.createElement("a");
            a1.setAttribute("href","#!");
            a1.setAttribute("class","decrease-cart-item cart-icon btn plus theme-plus pull-right");
            a1.setAttribute("onclick","order("+orderitem.price+",'"+orderitem.name+"',-1,'"+orderitem.itemtype+"','"+orderitem.selectedtoppings.toString()+"')");
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
            if(orderitem.itemtype === "pizza"){
                var button1 = document.createElement("button");
                button1.setAttribute("type","button")
                button1.setAttribute("class","btn btn-primary selectToppingsButton");
                button1.setAttribute("onclick","toppings("+orderitem.price+",'"+orderitem.name+"',0,'"+orderitem.itemtype+"','"+orderitem.selectedtoppings.toString()+"')");
                button1.textContent = "Select Toppings";
                var div6 = document.createElement("div");
                div6.setAttribute("class","row");
                div6.setAttribute("style","width:99%;margin-left:0px");
                div6.appendChild(button1);
                li.appendChild(div6);
            }
            if(orderitem.itemtype === "sub" || orderitem.itemtype === "dinnerplatter"){
              var input1 = document.createElement("input");
              input1.setAttribute("type","radio");
              input1.setAttribute("name","small");
              input1.setAttribute("id",orderitem.name+"_smallinput")
              if(orderitem.itemtype == "sub"){
                input1.setAttribute("value",document.getElementById(orderitem.name+"_subsmall").value);
              }else{
                input1.setAttribute("value",document.getElementById(orderitem.name+"_dinnerplattersmall").value);
              }
              if(input1.value == orderitem.price){
                input1.checked = true;
              }
              input1.setAttribute("style","margin-left: 1vw;");
              input1.setAttribute("onclick","order("+input1.value+",'"+orderitem.name+"',0,'"+orderitem.itemtype+"','"+orderitem.selectedtoppings.toString()+"');getElementById('"+orderitem.name+"_largeinput').checked=false;")
              var label1 = document.createElement("label");
              label1.setAttribute("style","margin-left: 5px;");
              label1.innerHTML = "Small"
              var input2 = document.createElement("input");
              input2.setAttribute("type","radio");
              input2.setAttribute("name","large");
              input2.setAttribute("id",orderitem.name+"_largeinput")
              if(orderitem.itemtype == "sub"){
                input2.setAttribute("value",document.getElementById(orderitem.name+"_sublarge").value);
              }else{
                input2.setAttribute("value",document.getElementById(orderitem.name+"_dinnerplatterlarge").value);
              }
              if(input2.value == orderitem.price){
                input2.checked=true;
              }
              input2.setAttribute("style","margin-left: 5vw;");
              input2.setAttribute("onclick","order("+input2.value+",'"+orderitem.name+"',0,'"+orderitem.itemtype+"','"+orderitem.selectedtoppings.toString()+"');getElementById('"+orderitem.name+"_smallinput').checked=false;")
              var label2 = document.createElement("label");
              label2.setAttribute("style","margin-left: 5px;");
              label2.innerHTML = "Large";
              var div6 = document.createElement("div");
              div6.setAttribute("class","col-md-12");
              div6.setAttribute("style","padding:0");          
              div6.appendChild(input1);
              div6.appendChild(label1);
              div6.appendChild(input2);
              div6.appendChild(label2)
              var form = document.createElement("form");
              form.appendChild(div6);
              var div7 = document.createElement("div");
              div7.setAttribute("class","row");
              div7.setAttribute("style","width:99%;margin-left:0px");
              div7.appendChild(form);
              li.appendChild(div7);
            }
            OrderList.getElementsByTagName("ul")[0].appendChild(li);
        }
      }
  }

  function checkoutOrder(){
    if(orders && orders.length > 0)
    {
      document.getElementById("checkoutModal").style.display = "block";
      document.getElementById("checkoutModal").style.overflow = "auto";
      document.body.style.overflow = "hidden";
      document.getElementById("delivery-date-field").style.display = "none";
      document.getElementsByName("deliveryTime")[0].style.display = "none";
      document.getElementById("deliveryType").classList.remove("has-error");
      document.getElementById("deliveryType").getElementsByClassName("help-block")[0].setAttribute("hidden","");
      document.getElementById("streetForm").classList.remove("has-error");
      document.getElementById("streetForm").getElementsByTagName("div")[0].setAttribute("hidden","");
      document.getElementById("streetNumberForm").classList.remove("has-error");
      document.getElementById("streetNumberForm").getElementsByTagName("div")[0].setAttribute("hidden","");
      document.getElementById("cityForm").classList.remove("has-error");
      document.getElementById("cityForm").getElementsByTagName("div")[0].setAttribute("hidden","");
      document.getElementById("apartmentNumberForm").classList.remove("has-error");
      document.getElementById("apartmentNumberForm").getElementsByTagName("div")[0].setAttribute("hidden","");
      document.getElementById("floorNumberForm").classList.remove("has-error");
      document.getElementById("floorNumberForm").getElementsByTagName("div")[0].setAttribute("hidden","");
      document.getElementById("firstNameForm").classList.remove("has-error");
      document.getElementById("firstNameForm").getElementsByTagName("div")[0].setAttribute("hidden","");
      document.getElementById("lastNameForm").classList.remove("has-error");
      document.getElementById("lastNameForm").getElementsByTagName("div")[0].setAttribute("hidden","");
      document.getElementById("emailForm").classList.remove("has-error");
      document.getElementById("emailForm").getElementsByTagName("div")[0].setAttribute("hidden","");
      document.getElementById("phoneForm").classList.remove("has-error");
      let errormessage = document.getElementById("phoneForm").getElementsByTagName("div");
      errormessage[errormessage.length-1].setAttribute("hidden","");
      document.getElementById("_order-form-errors").style.display = "none";
      
      document.getElementById("deliveryType").addEventListener('change',function(){
        if(document.getElementById("delivery-date").checked){
          document.getElementById("delivery-date-field").style.display = "block";
        }else{
          document.getElementById("delivery-date-field").style.display = "none";
          //document.getElementById("deliveryType").getElementsByClassName("help-block")[0].setAttribute("hidden","");
        }
      });
    
      document.getElementById("orderType").addEventListener('change',function(){
        if(document.getElementById("DELIVERY").checked){
          document.getElementById("deliveryAddressDetails").style.display="flex";
        }else{
          document.getElementById("deliveryAddressDetails").style.display = "none";
        }
      });

    }else{
      showToast("Your Cart is Empty");
    }
  }

  function displayTime(event){
    if(document.getElementsByName("deliveryTime").length > 0){
      document.getElementsByName("deliveryTime")[0].style.display = "block";
      for(var ele of document.getElementsByName("deliveryTime")[0].getElementsByTagName("option")){
          if(ele.hasAttribute("hidden") && event.currentTarget.value){
              ele.removeAttribute("hidden");
          }else if(!ele.hasAttribute("hidden")){
              ele.setAttribute("hidden","");
          }
      }
    }
  }

  function clearOrderForm(){
    document.getElementById("checkout-order-id").reset();
    document.getElementById("checkoutModal").style.display = "none";
    document.body.style.overflow = "visible";
  }

  function validate(){
    let valid = true;

    if(!deliveryDate.value){
      document.getElementsByName("deliveryTime")[0].style.display = "none";
      document.getElementById("deliveryType").classList.add("has-error");
      document.getElementById("deliveryType").getElementsByClassName("help-block")[0].removeAttribute("hidden");
      valid = false;
    }else{
      document.getElementsByName("deliveryTime")[0].style.display = "block";
      document.getElementById("deliveryType").classList.remove("has-error");
      document.getElementById("deliveryType").getElementsByClassName("help-block")[0].setAttribute("hidden","");
    }
    if(!streetElement.value){
      document.getElementById("streetForm").classList.add("has-error");
      document.getElementById("streetForm").getElementsByTagName("div")[0].removeAttribute("hidden");
      valid = false;
    }else{
      document.getElementById("streetForm").classList.remove("has-error");
      document.getElementById("streetForm").getElementsByTagName("div")[0].setAttribute("hidden","");
    }

    if(!streetNumberElement.value){
      document.getElementById("streetNumberForm").classList.add("has-error");
      document.getElementById("streetNumberForm").getElementsByTagName("div")[0].removeAttribute("hidden");
      valid = false;
    }else{
      document.getElementById("streetNumberForm").classList.remove("has-error");
      document.getElementById("streetNumberForm").getElementsByTagName("div")[0].setAttribute("hidden","");
    }

    if(!cityElement.value){
      document.getElementById("cityForm").classList.add("has-error");
      document.getElementById("cityForm").getElementsByTagName("div")[0].removeAttribute("hidden");
      valid = false;
    }else{
      document.getElementById("cityForm").classList.remove("has-error");
      document.getElementById("cityForm").getElementsByTagName("div")[0].setAttribute("hidden","");
    }

    if(!apartmentNumberElement.value){
      document.getElementById("apartmentNumberForm").classList.add("has-error");
      document.getElementById("apartmentNumberForm").getElementsByTagName("div")[0].removeAttribute("hidden");
      valid = false;
    }else{
      document.getElementById("apartmentNumberForm").classList.remove("has-error");
      document.getElementById("apartmentNumberForm").getElementsByTagName("div")[0].setAttribute("hidden","");
    }

    if(!floorElement.value){
      document.getElementById("floorNumberForm").classList.add("has-error");
      document.getElementById("floorNumberForm").getElementsByTagName("div")[0].removeAttribute("hidden");
      valid = false;
    }else{
      document.getElementById("floorNumberForm").classList.remove("has-error");
      document.getElementById("floorNumberForm").getElementsByTagName("div")[0].setAttribute("hidden","");
    }
    if(!firstNameElement.value){
      document.getElementById("firstNameForm").classList.add("has-error");
      document.getElementById("firstNameForm").getElementsByTagName("div")[0].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("firstNameForm").classList.remove("has-error");
        document.getElementById("firstNameForm").getElementsByTagName("div")[0].setAttribute("hidden","");
    }
    if(!lastNameElement.value){
        document.getElementById("lastNameForm").classList.add("has-error");
        document.getElementById("lastNameForm").getElementsByTagName("div")[0].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("lastNameForm").classList.remove("has-error");
        document.getElementById("lastNameForm").getElementsByTagName("div")[0].setAttribute("hidden","");
    }
    if(!emailElement.value || !emailElement.validity.valid){
        document.getElementById("emailForm").classList.add("has-error");
        document.getElementById("emailForm").getElementsByTagName("div")[0].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("emailForm").classList.remove("has-error");
        document.getElementById("emailForm").getElementsByTagName("div")[0].setAttribute("hidden","");
    }
    if(!phoneElement.value){
        document.getElementById("phoneForm").classList.add("has-error");
        let errormessage = document.getElementById("phoneForm").getElementsByTagName("div");
        errormessage[errormessage.length-1].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("phoneForm").classList.remove("has-error");
        let errormessage = document.getElementById("phoneForm").getElementsByTagName("div");
        errormessage[errormessage.length-1].setAttribute("hidden","");
    }

    if(!valid){
      document.getElementById("_order-form-errors").style.display = "block";
    }else{
      document.getElementById("_order-form-errors").style.display = "none";
    }

    return valid;
  }


  function submitFinalCheckOutOrder(){
      validate();
  }