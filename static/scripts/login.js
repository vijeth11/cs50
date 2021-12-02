Array.from(document.getElementsByClassName("input-container")).forEach(
  function (element, index) {
    element.addEventListener("click", function (event) {
      if (
        !document.getElementsByClassName("bar")[index].getAttribute("style")
      ) {
        document
          .getElementsByClassName("bar")
          [index].setAttribute("style", "background-size: 100% 100%;");
      }
      if (
        !document.getElementsByTagName("label")[index].getAttribute("style") ||
        !!event.target.value
      ) {
        document
          .getElementsByTagName("label")
          [index].setAttribute("style", "top:-25px;font-size:20px;");
      }
    });
  }
);

Array.from(document.getElementsByTagName("input")).forEach(function (
  element,
  index
) {
  element.addEventListener("blur", function (event) {
    if (!event.target.value) {
      document
        .getElementsByClassName("bar")
        [index].removeAttribute("style", "background-size: 100% 100%;");
      document.getElementsByTagName("label")[index].removeAttribute("style");
    }
  });
});

function showRegister() {
  document.getElementById("RegisterCard").style.display =
    document.getElementById("RegisterCard").style.display == "none"
      ? ""
      : "none";
  document.getElementsByClassName("toggle")[0].style.display =
    document.getElementsByClassName("toggle")[0].style.display == "none"
      ? ""
      : "none";
  document.getElementsByClassName("card alt")[0].classList.toggle("active");
}

document.getElementById("closeButton").addEventListener("click", (event) => {
  document.getElementById("RegisterCard").style.display =
    document.getElementById("RegisterCard").style.display == "none"
      ? ""
      : "none";
  document.getElementsByClassName("toggle")[0].style.display =
    document.getElementsByClassName("toggle")[0].style.display == "none"
      ? ""
      : "none";
  document.getElementsByClassName("card alt")[0].classList.toggle("active");
});

document
  .getElementById("loginClick")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var request = new XMLHttpRequest();
    request.open("POST", "/");
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          // Inserting the response from server into an HTML element
          console.log(request.responseText);
          window.location.href = "/loggedin/" + request.responseText;
        } else if (request.status === 401) {
          alert(request.responseText);
        } else if (request.status === 500) {
          alert("internal server error");
        }
      }
    };
    var myForm = document.getElementById("loginForm");
    var formData = new FormData(myForm);
    formData.append("requestType", "Login");
    console.log(formData);
    request.send(formData);
  });

document
  .getElementById("registerClick")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var request = new XMLHttpRequest();
    request.open("POST", "/");
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          alert("sucessfully registered");
          window.location.href = "/loggedin/" + request.responseText;
        } else if (request.status === 500) {
          alert(request.responseText);
        }
      }
    };
    var myForm = document.getElementById("registerForm");
    var formData = new FormData(myForm);
    formData.append("requestType", "Register");
    var password1 = document.getElementById("registerPassword").value;
    var password2 = document.getElementById("registerRetypePassword").value;
    if (password1 === password2) {
      request.send(formData);
    } else {
        alert("password entered wrong");
    }
  });

  document.getElementById("userProfileImage").addEventListener("click",function(event){
    document.getElementById("my_file").click();
  });

  function renderNewImage(input){
    var imagebox = document.getElementById("userProfileImage");
    if(input.files && input.files[0]){
      let reader = new FileReader();
      reader.onload = function(e){
        // console.log(e)
        
        imagebox.setAttribute("src",e.target.result)
      }
      reader.readAsDataURL(input.files[0]);
    }
  
  }