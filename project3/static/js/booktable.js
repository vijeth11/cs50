window.onload = function(){
    var today = new Date().toISOString().split('T')[0];
   // var nextWeekDate = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  document.getElementsByName("toDate")[0].setAttribute('min', today);
  //document.getElementsByName("toDate")[0].setAttribute('max', nextWeekDate);
  document.getElementsByName("toDate")[0].setAttribute('onchange',"displayTime(event)")
}

function displayTime(event){
    console.log(event.currentTarget.value);
    for(var ele of document.getElementsByName("toTime")[0].getElementsByTagName("option")){
        if(ele.hasAttribute("hidden") && event.currentTarget.value){
            ele.removeAttribute("hidden");
        }else if(!ele.hasAttribute("hidden")){
            ele.setAttribute("hidden","");
        }
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