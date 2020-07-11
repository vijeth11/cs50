const User = {
    name:null,
    id:null
}

window.onload = function(){
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
            EmptyCart.style.display ="none";
            OrderList.style.display = "block";
            document.getElementById("signupModal").style.display = "none";
            document.body.style.overflow = "visible";
            document.getElementById("errorMessage").style.display = "none";
            document.getElementById("Logout").style.display="block";
            document.getElementById("Account").style.display = "none";
            OrderList.getElementsByTagName("ul")[0].textContent="";
            setupOrders(data.data.orders);
            document.getElementById("totalprice").textContent = data.data.total;
        })
        .catch(err => {
            console.log(err);
            login();
        });
      }
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