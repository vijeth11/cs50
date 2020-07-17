var bookingDateElement = null;
var bookingTimeElement = null;
var numberOfPeopleElement = null;
var firstNameElement = null;
var lastNameElement = null;
var emailElement = null;
var phoneElement = null;
function loadBookingTables(){
    if(document.getElementsByName("toDate").length > 0){
        // var nextWeekDate = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        var today = new Date().toISOString().split('T')[0];
        document.getElementsByName("toDate")[0].setAttribute('min', today);
        //document.getElementsByName("toDate")[0].setAttribute('max', nextWeekDate);
        document.getElementsByName("toDate")[0].setAttribute('onchange',"displayTimeOfBookingTable(event)")
    }
    var input = document.querySelector("#phone");
    if(input){
        window.intlTelInput(input, {
        // any initialisation options go here
        initialCountry: "in",
        separateDialCode: true
        });
    }
    bookingDateElement = document.querySelector("input[name='toDate']");
    bookingTimeElement = document.querySelector("select[name='toTime']");
    numberOfPeopleElement = document.querySelector("select[name='people']");
    firstNameElement = document.querySelector("input[name='firstName']");
    lastNameElement = document.querySelector("input[name='lastName']");
    emailElement = document.querySelector("input[name='email']");
    phoneElement = document.querySelector("input[name='phone']");
    var form = document.querySelector('form');
    form.addEventListener('change', function(event) {
       if(bookingDateElement && bookingDateElement.value && bookingTimeElement && bookingTimeElement.selectedOptions[0].value 
          && numberOfPeopleElement && numberOfPeopleElement.selectedOptions[0].value){
           document.getElementById("userdetail").removeAttribute("hidden");
           document.getElementById("contactdetail").removeAttribute("hidden");
       }
    });
}

function displayTimeOfBookingTable(event){
    for(var ele of document.getElementsByName("toTime")[0].getElementsByTagName("option")){
        if(ele.hasAttribute("hidden") && event.currentTarget.value){
            ele.removeAttribute("hidden");
        }else if(!ele.hasAttribute("hidden")){
            ele.setAttribute("hidden","");
        }
    }
}

function submitbookTable(){
    if(validateBookingTable()){
        var formData = new FormData(document.getElementById("formBookTable"));
        axios({
            headers: { "X-CSRFToken": Cookies.get('csrftoken')},
            method: 'post',
            url:'/book-table/',
            data: formData
        })
        .then(data => {
            showToast("table has been booked and email is sent");
            setTimeout(function() {
                location.reload();
            },4000);            
        })
        .catch(err => {
            console.log(err);
        })
    }
}

function validateBookingTable(){
   let valid=true;
   if(!bookingDateElement.value){
       document.getElementById("dateForm").classList.add("has-error");
       document.getElementById("dateForm").getElementsByTagName("span")[0].removeAttribute("hidden");
       valid = false;
   }else{
    document.getElementById("dateForm").classList.remove("has-error");
    document.getElementById("dateForm").getElementsByTagName("span")[0].setAttribute("hidden","");
   }
   if(!bookingTimeElement.selectedOptions[0].value){
        document.getElementById("timeForm").classList.add("has-error");
        document.getElementById("timeForm").getElementsByTagName("span")[0].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("timeForm").classList.remove("has-error");
        document.getElementById("timeForm").getElementsByTagName("span")[0].setAttribute("hidden","");
    }
    if(!numberOfPeopleElement.selectedOptions[0].value){
        document.getElementById("peopleForm").classList.add("has-error");
        document.getElementById("peopleForm").getElementsByTagName("span")[0].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("peopleForm").classList.remove("has-error");
        document.getElementById("peopleForm").getElementsByTagName("span")[0].setAttribute("hidden","");
    }
    if(!firstNameElement.value){
        document.getElementById("firstNameForm").classList.add("has-error");
        document.getElementById("firstNameForm").getElementsByTagName("span")[0].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("firstNameForm").classList.remove("has-error");
        document.getElementById("firstNameForm").getElementsByTagName("span")[0].setAttribute("hidden","");
    }
    if(!lastNameElement.value){
        document.getElementById("lastNameForm").classList.add("has-error");
        document.getElementById("lastNameForm").getElementsByTagName("span")[0].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("lastNameForm").classList.remove("has-error");
        document.getElementById("lastNameForm").getElementsByTagName("span")[0].setAttribute("hidden","");
    }
    if(!emailElement.value || !emailElement.validity.valid){
        document.getElementById("emailForm").classList.add("has-error");
        document.getElementById("emailForm").getElementsByTagName("span")[0].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("emailForm").classList.remove("has-error");
        document.getElementById("emailForm").getElementsByTagName("span")[0].setAttribute("hidden","");
    }
    if(!phoneElement.value){
        document.getElementById("phoneForm").classList.add("has-error");
        let errormessage = document.getElementById("phoneForm").getElementsByTagName("span");
        errormessage[errormessage.length-1].removeAttribute("hidden");
        valid = false;
    }else{
        document.getElementById("phoneForm").classList.remove("has-error");
        let errormessage = document.getElementById("phoneForm").getElementsByTagName("span");
        errormessage[errormessage.length-1].setAttribute("hidden","");
    }
    return valid;
}