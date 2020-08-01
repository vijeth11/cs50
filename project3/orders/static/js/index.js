function submitMessage(){
    var formData = new FormData(document.getElementById("formSendMessage"));
        axios({
            headers: { "X-CSRFToken": Cookies.get('csrftoken')},
            method: 'post',
            url:'/send-message/',
            data: formData
        })
        .then(data => {
            showToast("Message has been registered");
            setTimeout(function() {
                location.reload();
            },4000);            
        })
        .catch(err => {
            console.log(err);
        })
}