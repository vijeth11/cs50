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