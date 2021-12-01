
function placetheorder(event){
    event.preventDefault();
    var formdata = new FormData(document.getElementById("BillingDetails"));
    formdata.append("paymenttype",document.getElementById("banktransfer").checked ? "bank transfer":document.getElementById("bankcheck").checked ? "bank check" : document.getElementById("paypal").checked ? "paypal": "");
    if(validateBillingDetails()){
        axios({
            headers: { "X-CSRFToken": Cookies.get('csrftoken')},
            method: 'post',
            url:'/checkout/',
            data: formdata
        })
        .then(data => {
            var snackbar = document.getElementById("snackbar");
            snackbar.className = "show";
            document.getElementById("snackbar").getElementsByTagName("span")[0].innerHTML = data.data;
            setTimeout(function(){
              snackbar.className = snackbar.className.replace("show","");
              location.href = "/";  
            },3000);                     
        })
        .catch(err => {
            console.log(err);
        })
    }
}

function validateBillingDetails(){
    let valid= true;
    let firstName = document.getElementById("firstname");
    let lastName = document.getElementById("lastname");
    let housenumber = document.getElementById("housenumber");
    let appartmentNumber = document.getElementById("appartmentnumber");
    let town = document.getElementById("Town");
    let zip = document.getElementById("Zip");
    let phone = document.getElementById("phone");
    let email = document.getElementById("email");
    let bankTransferRadio = document.getElementById("banktransfer");
    let bankCheckRadio = document.getElementById("bankcheck");
    let paypalRadio = document.getElementById("paypal");
    let termsAndCondition = document.getElementById("termsandcondition");
    if(firstName.value.length == 0){
        firstName.classList.add("has-error");
        valid = false;
    }else{
        firstName.classList.remove("has-error");
    }
    if(lastName.value.length == 0){
        lastName.classList.add("has-error");
        valid = false;
    }else{
        lastName.classList.remove("has-error");
    }
    if(housenumber.value.length == 0){
        housenumber.classList.add("has-error");
        valid = false;
    }else{
        housenumber.classList.remove("has-error");
    }
    if(appartmentNumber.value.length == 0){
        appartmentNumber.classList.add("has-error");
        valid = false
    }else{
        appartmentNumber.classList.remove("has-error");
    }
    if(town.value.length == 0){
        town.classList.add("has-error");
        valid = false;
    }else{
        town.classList.remove("has-error");
    }
    if(zip.value.length == 0){
        zip.classList.add("has-error");
        valid = false;
    }else{
        zip.classList.remove("has-error");
    }
    if(phone.value.length == 0){
        phone.classList.add("has-error");
        valid =false;
    }else{
        phone.classList.remove("has-error");
    }
    if(email.value.length == 0){
        email.classList.add("has-error");
        valid = false;
    }else{
        email.classList.remove("has-error");
    }    
    if(!bankTransferRadio.checked && !bankCheckRadio.checked && !paypalRadio.checked){
        document.getElementsByClassName("payment-details")[0].classList.add("has-error");
        valid = false;
    }else{
        document.getElementsByClassName("payment-details")[0].classList.remove("has-error");
    }
    if(!termsAndCondition.checked){
        document.getElementsByClassName("checkbox")[0].classList.add("has-error");
        valid = false;
    }else{
        document.getElementsByClassName("checkbox")[0].classList.remove("has-error");
    }
    return valid;
}