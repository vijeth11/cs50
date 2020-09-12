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
    })
    .catch(err => {
        console.log(err);
    })

}
