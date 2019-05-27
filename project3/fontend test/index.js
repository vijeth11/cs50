var enterValueRightSide=true;
window.onload=function(event)
  {
  var isSearchBarOnFocus=false;
 console.log("calling onload");
 var contactList= document.getElementById("contactList");
 var searchbar = document.getElementById("searchbar");
 var messages= [{"type":"right","message":"When you're backed against the wall, break the god damn thing down."},
                {"type":"right","message":"Excuses don't win championships."},
                {"type":"left","message":"Oh yeah, did Michael Jordan tell you that?"},
                {"type":"right","message":"No, I told him that."},
                {"type":"right","message":"What are your choices when someone puts a gun to your head?"},
                {"type":"left","message":"What are you talking about? You do what they say or they shoot you."},
                {"type":"right","message":"Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things."}]
 for(var i=0;i<messages.length;i++)
 {
   var bubble="";
   if(messages[i].type==="left"){
     bubble=enterLeftMessage(messages[i].message);
   }
   if(messages[i].type==="right"){
     bubble=enterRightMessage(messages[i].message);
   }
   if(bubble==="")
     continue;
   document.getElementById("messagesList").innerHTML+=bubble;
 }
 var textareas = document.getElementsByTagName("textarea");
 for(var i=0; i<textareas.length;i++)
 {
    autoExpand(textareas[i]);
 }
 searchbar.onmouseover=function (event){ 
  searchbar.style.background="#435F7A";
  document.getElementById("searchIcon").style.background="#435F7A";
 }
 searchbar.onmouseleave=function (event){ 
   if(!isSearchBarOnFocus){
    searchbar.style.background="#32465A";
    document.getElementById("searchIcon").style.background="#32465A";
   }
 }
 searchbar.onfocus = function(event){
   searchbar.style.background="#435F7A";
   document.getElementById("searchIcon").style.background="#435F7A";
   isSearchBarOnFocus=true;
 }
 searchbar.onblur= function(event){
   searchbar.style.background="#32465A";
   document.getElementById("searchIcon").style.background="#32465A";
   isSearchBarOnFocus=false;
 }

 var facebookIcon = document.getElementById("facebook");
 facebookIcon.onfocus = function(event){
  facebookIcon.style.background="#435F7A";
}
facebookIcon.onblur= function(event){
  facebookIcon.style.background="#32465A";
}

var twitterIcon = document.getElementById("twitter");
twitterIcon.onfocus = function(event){
  twitterIcon.style.background="#435F7A";
}
twitterIcon.onblur= function(event){
  twitterIcon.style.background="#32465A";
}

var instagramIcon = document.getElementById("instagram");
instagramIcon.onfocus = function(event){
  instagramIcon.style.background="#435F7A";
}
instagramIcon.onblur= function(event){
  instagramIcon.style.background="#32465A";
}

 var names=["Cras justo odio","Dapibus ac facilisis in","Vestibulum at eros"];
 for(var i=0;i<4;i++)
  for(var j in names)
     contactList.innerHTML+="<li style='background:#2C3E50;color:white;padding-left:6vh;'class='list-group-item'>"+
                                "<div style='display:inline-block;'>"+
                                 " <img style='vertical-align:top' src='./src/images/image1.jpg' width='50' height='50' class='rounded-circle' alt=''>"+
                                "</div>"+
                                "<div style='display:inline-block;vertical-align: bottom'>"+
                                   "<span style='font-size:15px;font-weight:bold;'>&nbsp "+names[j]+"</span><br> <span style='font-size:15px;'>&nbsp hello how are you ?</span>"+
                                "</div>"+
                              "</li>";     
 }

function changeIcon()
{
 var icon = document.getElementById("angledown");
 var contactList = document.getElementById("contactList");
 if(icon.className=="fa fa-angle-up"){
    icon.className= "fa fa-angle-down";
    contactList.style.maxHeight="71.7vh";  
 }
 else{         
    icon.className="fa fa-angle-up";
      
    contactList.style.maxHeight="55.7vh";         
 }
 
}

function changeBackgroundcolor(element)
{
  element.style.background="#435F7A";
}
function attachment(event)
{
  alert("attachment clicked");
}

function postMessage(event)
{
  var bubble=document.getElementById("messageTyped");
  if(bubble.value.length!=0){
    if(enterValueRightSide){
      document.getElementById("messagesList").innerHTML+=enterRightMessage(bubble.value);
    }
    else{
      document.getElementById("messagesList").innerHTML+=enterLeftMessage(bubble.value);
    }
    //autoExpand(document.getElementsByTagName("textarea")[document.getElementsByTagName("textarea").length-1]);
    document.getElementById("messages").scrollTo(0,document.getElementById("messages").scrollHeight);
    enterValueRightSide=!enterValueRightSide;
    bubble.value="";
    document.getElementById
  }
   else{
     alert("message box cannot be empty");
   } 
}

document.getElementById('messageTyped').onkeypress = function(e){
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13'){
    postMessage(document.getElementById('messageTyped'));
    return false;
  }
}

document.addEventListener('input', function (event) {
    if (event.target.tagName.toLowerCase()==='input'){
      console.log("helo");
      if(event.target.value=='\n')
        alert("pressed enter");
      return;
    }
    if (event.target.tagName.toLowerCase() !== 'textarea') return;
    autoExpand(event.target);
  }, false);

var autoExpand = function (field) {
        
      // Reset field height
          field.style.height = 'inherit';
          field.style.fontSize=16;
          field.style.width="wrap-contant"
          // Get the computed styles for the element
          var computed = window.getComputedStyle(field);

          //calculate the width

          console.log(field.scrollWidth);
          //field.style.width=field.scrollWidth;
          // var lengthOfCharacters=field.value.length;
          // console.log(lengthOfCharacters);
          // if(lengthOfCharacters >55)
          // {
          //   //field.setAttribute("cols","55");
          //   field.style.width="100%";
          // }
          // else if(lengthOfCharacters < 11){
          //   field.style.width="";
          //   field.setAttribute("cols",((lengthOfCharacters*16)/18).toString());
          // }
          // else if(lengthOfCharacters < 22){
          //   field.style.width="";
          // }
          // else{
          //   //lengthOfCharacters=(lengthOfCharacters*16)/18;
          //   //field.setAttribute("cols",lengthOfCharacters.toString());
          //   field.style.width=(field.value.length*2-(field.value.length/8)).toString()+"%";
          //   console.log(field.style.width);
          // }
          // Calculate the height
          var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                      + parseInt(computed.getPropertyValue('padding-top'), 10)
                      + field.scrollHeight
                      + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                      + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
          field.style.height = height + 'px';
                        
          
          //console.log(field.value.length);
          //console.log(field.getAttribute("cols"));
          };



function enterLeftMessage(message)
{
   return "<li class='list-group-item' style='border:0px'>"+
                  "<div style='display: inline-block;vertical-align: top;padding-right:2vh;'>"+
                      "<img src='./src/images/image1.jpg' width='25' height='25' class='rounded-circle'>"+
                  "</div>"+
                  //"<div style='display:inline-block;padding-left: 2vh;width:100%;'>"+ 
                      //"<textarea readonly rows='1' style='width:100%;'>"+message+"</textarea>"+
                      "<div style='text-align:left;background:#2C3E50;max-width:48%;border-radius:25px;border:1px solid #A9A9A9;color:white;padding:12px;display:inline-flex;'>"+message+"</div>"+
                  //"</div>"+
                "</li>"
                
}
function enterRightMessage(message)
{
  return "<li class='list-group-item' style='text-align:right;border:0px'>"+
                    //"<div style='display: inline-block;padding-right: 2vh;width:55%;'>"+
                        //"<textarea readonly rows='1'  style='text-align:left;background:white;color:black'>"+message+"</textarea>"+
                        "<div style='text-align:left;background:white;max-width:48%;border-radius:25px;border:1px solid #A9A9A9;color:black;padding:12px;display:inline-flex;'>"+message+"</div>"+
                    //"</div>"+
                    "<div style='display:inline-block;vertical-align: top;padding-left:2vh;'>"+ 
                        "<img src='./src/images/image1.jpg' width='25' height='25' class='rounded-circle'>"+
                    "</div>"+
                "</li>";
}