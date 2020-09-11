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

function initMap(){
    var map = new google.maps.Map(document.getElementById("map"),{
        center:{lat: -34.397,
            lng: 150.644},
        zoom:8
    });
}