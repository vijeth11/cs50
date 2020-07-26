function submitNewPost(id=0){
    let url="/post";
    let postdata= "";
   if(id>0){
       url = "/post/"+id;
       postdata = document.querySelector("#newpost"+id).value.trim();
   }else{
       postdata = document.querySelector('#newpost').value.trim();
   }
    fetch(url,{
        method:"POST",
        body:JSON.stringify({
            post: postdata
        })
    })
    .then(response => {
        if(id > 0){
            document.querySelector("#edit"+id).style.display = "block";
            document.querySelector("#display"+id).style.display = "block";
            document.querySelector("#display"+id).innerHTML = document.querySelector("#newpost"+id).value;
            document.querySelector("#editpost"+id).style.display = "none"; 
        }else{
            window.location = window.location.origin;
        }
    })
}

function displayedit(id){
    document.querySelector("#editpost"+id).style.display = "block";    
    document.querySelector("#edit"+id).style.display = "none";
    document.querySelector("#display"+id).style.display = "none";
    document.querySelector("#newpost"+id).value = document.querySelector("#display"+id).innerHTML.trim();
}

function increaselikes(id){
    fetch('likes/'+id,{
        method:"GET",
    })
    .then(r => r.json())
    .then(response =>{
        console.log(response.id);
        if(response.likes > 0){            
            document.querySelector("#likebutton"+id).style.color = "red";
        }else{            
            document.querySelector("#likebutton"+id).style.color = "black"
        }
        document.querySelector("#likebutton"+id+" + span").innerHTML = response.likes;
    })
}

function addOrRemoveFollowers(username,type){
    fetch('/followers',{
        method:"POST",
        body:JSON.stringify({
            following:username,
            action:type
        })
    })
    .then(response => {
         location.reload()
    })
}