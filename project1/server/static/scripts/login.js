$(document).ready(function() {
  setTimeout(function() {
    console.log("after 2 sec");
    $("#signup").css({ visibility: "visible" });
    $("#signup").addClass("w3-animate-opacity");
  }, 1400);
});

$(".card").on("click", "#register", function() {
  $("h5").text("Register");
  $("#signup").removeClass("w3-animate-opacity");
  $("#signup").addClass("w3-animate-top");
  console.log("register clicked 1");
  $("#confirmpassword").append(
    "<div><label for='exampleInputPassword2'>Confirm Password</label><input type='password' class='form-control' id='exampleInputPassword2'placeholder='Password' data-toggle='popover' data-trigger='focus' title='Password Error' data-content='Password does not match'></div>"
  );
  $("#footer").remove("");
});

$("#register").click(function() {
  $("h5").text("Register");
  console.log("register clicked");
  $("#signup").removeClass("w3-animate-opacity");
  $("#signup").addClass("w3-animate-top");
  $("#confirmpassword").append(
    "<div><label for='exampleInputPassword2'>Confirm Password</label><input type='password' class='form-control' id='exampleInputPassword2'placeholder='Password' data-toggle='popover' data-trigger='focus' title='Password Error' data-content='Password does not match'></div>"
  );
  $("#footer").remove("");
});

(function() {
  "use strict";
  window.addEventListener(
    "load",
    function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName("needs-validation");
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener(
          "submit",
          function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (!$("#register").length) {
              if (
                form.checkValidity() === false ||
                !document.getElementById("exampleInputPassword2").value ||
                document.getElementById("exampleInputPassword2").value !=
                document.getElementById("exampleInputPassword1").value
              ) {
                if (!document.getElementById("exampleInputPassword1").value)
                  $("#exampleInputPassword1").popover("show");
                if (
                  document.getElementById("exampleInputPassword2").value !=
                  document.getElementById("exampleInputPassword1").value
                )
                  $("#exampleInputPassword2").popover("show");
                  
                console.log("testing password error");
              } else {
                register({username:document.getElementById("exampleInputEmail1").value,confirmpassword:document.getElementById("exampleInputPassword1").value,password:document.getElementById("exampleInputPassword2").value},successRegister);
              }
            } else {
              login({username:document.getElementById("exampleInputEmail1").value,password:document.getElementById("exampleInputPassword1").value},successLogin);
            }
          },
          false
        );
      });
    },
    false
  );
})();

function register(data,functionsucess){
  $.ajax({
    type: 'POST',
    url: "/books/register",
    data: data,
    dataType: "json",
    success: (data)=>{functionsucess(data);},
    error: (data)=>{ alert(JSON.parse(data.responseText).error); }
});
// $.post("/books/register",data,(result)=>{
// functionsucess(result);
// }).fail(function(data) {
//   alert(JSON.parse(data.responseText).error);
// });
}

function login(data,functionsucess){
  $.ajax({
    type: 'POST',
    url: "/books/signin",
    data:data,
    dataType:"json",
    success: (data)=>{functionsucess(data);},
    error:(data)=>{ alert(JSON.parse(data.responseText).error);}
});
}
function successRegister(data){
  console.log(data);
  form.classList.add("was-validated");
                $("h5").text("Login");
                $("#signup").removeClass("w3-animate-top");
                $("#signup").addClass("w3-animate-opacity");
                $("#footer").css({ visibility: "visible" });
                $("#confirmpassword div").remove();
                if (!$("#register").length) {
                  $(".card").append(
                    " <div class='card-footer' id='footer'><div class='row'><div class='col-md-7 col-sm-7' style='text-align:left'><a href='#'>forgot password</a></div><div class='col-md-5 col-sm-5' style='text-align:right'><a href='#' id='register'>register</a></div></div>"
                  );
                } else {
                  setTimeout(function() {
                    window.location.href = "Searchpage.html";
                  }, 1);
                }
}


function successLogin(data){
  window.location = "/books/Searchpage.html";
}