function submitMesssage(event){
    event.preventDefault();
    var formData =  new FormData(document.getElementById("MessageForm"));
    axios({
        headers: { "X-CSRFToken": Cookies.get('csrftoken')},
        method: 'post',
        url:'/contact/',
        data: formData
    })
    .then(data => {
        console.log(data);
        document.getElementById("MessageForm").reset();         
        var snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        document.getElementById("snackbar").getElementsByTagName("span")[0].innerHTML = data.data;
        setTimeout(function(){
          snackbar.className = snackbar.className.replace("show",""); 
        },3000);  
    })
    .catch(err => {
        console.log(err);
    })

}
