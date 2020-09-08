function login(event){
    event.preventDefault();
    var formdata = new FormData(document.getElementById("Login"));
    formdata.append("action","login");
    axios({
        headers: { "X-CSRFToken": Cookies.get('csrftoken')},
        method: 'post',
        url:'/loginandregister/',
        data: formdata
        })
        .then(data => {
            location.href = "/";           
        })
        .catch(err => {
            console.log(err);
            document.getElementById("ErrorSection").style.display = "block";
            document.getElementById("ErrorMessage").innerHTML = err.response.data;
    })    
}

function register(event){
    event.preventDefault();
    var formdata = new FormData(document.getElementById("Register"));
    formdata.append("action","register");
    axios({
        headers: { "X-CSRFToken": Cookies.get('csrftoken')},
        method: 'post',
        url:'/loginandregister/',
        data: formdata
        })
        .then(data => {
            location.href = "/";           
        })
        .catch(err => {
            console.log(err);
            document.getElementById("ErrorSection").style.display = "block";
            document.getElementById("ErrorMessage").innerHTML = err.response.data;
    })    
}