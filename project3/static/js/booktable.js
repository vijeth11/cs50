function loadBookingTables(){
    if(document.getElementsByName("toDate").length > 0){
        // var nextWeekDate = new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        var today = new Date().toISOString().split('T')[0];
        document.getElementsByName("toDate")[0].setAttribute('min', today);
        //document.getElementsByName("toDate")[0].setAttribute('max', nextWeekDate);
        document.getElementsByName("toDate")[0].setAttribute('onchange',"displayTime(event)")
    }
    var input = document.querySelector("#phone");
    if(input){
        window.intlTelInput(input, {
        // any initialisation options go here
        initialCountry: "in",
        separateDialCode: true
        });
    }
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
