const User = {
    name:null,
    id:null
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
          console.log(data);
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
        }else{
          User.name = null;
          User.id = null;  
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