const User = {
    name:null,
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
      document.getElementById("close").addEventListener('click',()=>{
        document.getElementById("signupModal").style.display = "none";
      });
    document.getElementById("formLoginRegister").onsubmit = function(event){
        event.preventDefault();
        var inputFields = document.getElementById("formLoginRegister").getElementsByTagName("input");
        var token = inputFields[0];
            axios({
                headers: { "X-CSRFToken": token.value },
                method:'post',
                url:'/register/',
                data:new FormData(document.getElementById("formLoginRegister")),
            })
            .then(data => {
                User.name = data.data;
                console.log(User);
            })
            .catch(err => {
                console.log(err);
            })
    } 
  }

  function login(){
    document.getElementById("signupModal").style.display = "block";
    document.getElementById("confirmpassword").style.display = "none";
    document.getElementById("email").textContent = "Login (Email)";
    document.getElementById("password").textContent = "Password";
    document.getElementById("submitButton").textContent = "Login";
    document.getElementById("LoginRoute").style.display = "none";
    document.getElementById("close").addEventListener('click',()=>{
        document.getElementById("signupModal").style.display = "none";
    });
    document.getElementById("formLoginRegister").onsubmit = function(event){
        event.preventDefault();
        var inputFields = document.getElementById("formLoginRegister").getElementsByTagName("input");
        var token = inputFields[0];
            axios({
                headers: { "X-CSRFToken": token.value },
                method:'post',
                url:'/login/',
                data:new FormData(document.getElementById("formLoginRegister"))
            })
            .then(data => {
                User = data;
            })
            .catch(err => {
                console.log(err);
            })
    } 
  }

  function order(Url,id){
      axios({
          method: 'post',
          url:'/order/',
          data: {
              orderid:id,
              user:User
          }
      })
      .then(data => {
          console.log(data);
      })
      .catch(err => {
          login();
      })
  }
