enterValueRightSide = true;
var senderName;
var recieverName;
var recieverImage;
var recieverObject;
var preselectedName;
var contactListDomElement;
var searchbar;
var socket = io("/");
var MessageFromOtherContact = {};
var FriendsListToAdd = [];
var listOfFiles=[];
var contactList=[];
var groupList = [];
var fileTypeImages =[{
  "pdf":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAMAAAD8KXLNAAAAvVBMVEUAAAD3d3fxRkbyRkbyRkb3fn74g4PyRUX3lZXzRUXyRUX/RkbyQED3fn7zRUX2iYn/Rkb4lpb0cHDvQEDzRETzRkbzQEDzQkLzOzv////939/yODj2enr4kJD0UVHzPT38xMT92tr5lZX1ZGT+6+v4g4P1bW35m5v7yMj91dX3fn76sLD1XFz6qan//f36trb+5OT0VVX6rKz7vb3yNDT4iIj/9vb0TEz5o6PtTEzlRUXsYWHiNzfyRETsSEiKDgROAAAAFHRSTlMAH+Z5+80n+JHu0AWTv6w6CX3V/BbNCjoAAAHfSURBVHgB7daDsisxGMDxHNtftLZqu+//WDebOu1p08H1f7D8zRoIoferx4djXb4htYvXy7vrI32NXi4U8v6KjzcbFTcKer48bQplS3dYwyhbwhpGRTpGRZpGoNvzjUT6RkU6RkX6RiJNM7dUhE/2NYkVhDU2lCgIa6DxxNr0eathBPoab5re6xjJ1pkaRu2XmP8GiIzKCSrHAW9NiKhiwKnKsFkukRMOZaWCVnWZA7uGxEaZn6UDApBGYjz3ekDFZtrGoig1FRPwZXnoQoXL6p0qwSTjy9pdxdicG41K1ue8g6kwRiWLOPcHQDzO84aoE7N9M2SMWX1eD11hal0zNMQ8tzQ2c0UU75saBXB9zhMmTJthsyc2J7cTuIRSQQ5sxzRZK9oYN4x4VGXCDMtz14IDxiusntiM0SILQ6oG71umMLKcHTCL+rEL+qZe5iWUwta+hUwYz7btoCAHTCdJEgcTgKUxY84NfPwc1AihABhLM+x2N+c6oICXqWa5RJo8bTQ59x04YgJhYMvIMnnvfGtivxmsTdr0RbmNCca0ZjR7FCtGNnCcAd6aEIELyhLFABXb35qg62k59v9d9d/8MnN5fa75QFeXZ5qvN4SezzTPCKEn8et/p9vD49UT+gEdNgrQ89qG8QAAAABJRU5ErkJggg==)"
},
{
  "xls":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAMAAAD8KXLNAAAAulBMVEUAAACK4K5X0otX14eI362F3aqG4q1X0Yqe5LxX0YpW0otT0YhS0YdW0otW0otX0otY0Iug5Lqg5r2e5byf3rr///9O0IVR0IdU0YlX0otV0opV0YpKz4L+//5S0YjJ8dqK4K7p+fCQ4rKI36x426KL4K5t15p12qDT9OFy2Z5Lz4JXyIdZzotb046r6MVY0oz9/v2D3qpo15e47M593KXc9uj4/fqh5r5PxYHL8dvP8t687dCd5bue5bzVEOpnAAAAFXRSTlMAwekIyxwk+JHcffGW/KzN0Ss+eo5vCipPAAABZklEQVR4Ae3WhfaqMACA8dn1T3VBd9jd+v6PZY/L2YExbtdnKz8aAQBQar43eH18ArbKW7HGbVioMKT0JvFThh6LXorZxmRQ7VXAMIgPqDHLldyGTimPuaFqfmOWq/kNXSZxQ6ckaByTQQJm6TFIyoz4thlHQmbg2p4XR5II8mdOVPkzMny0HURtu9RkpUSpdWrE6//VBqnpoUQjS87mmNbGUZIMkfYwvZ0uJxjla83aurWG0Iq35pow6F0zIJz5vagg5BpDQRjjBYTzPqYhxeCbEbm+PUDN1yUaGf0Io8uyfDcyTc8yE0wIuZo5IjQ84RtrfGsF4WIcy/ru2xROb2nPVxrfhMvAdV0DQjNwacEy/A7r4BdtU6wi1L/tbyqiqZhvVvatEMKTZ39pxTVa4rrWvvc2naYFDcbQXGeWlhNQwhiM0sN/zv/1f1N8zWs6oFnMaVptAF5ympf7pf9HqyZa671ZAhesTDDT4wdnEAAAAABJRU5ErkJggg==)"
},
{
 "ppt":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAMAAAD8KXLNAAAAvVBMVEUAAAD72HT712j4yTf4yTj52nn72XX4yDj73475yTn/yjT3xzr4yTn5yDn5xzH63IL4yDn4yDj62Hb4xCr84I755Kj5yDT5yTj////5yDf5yTn823j5xzD5xi75xiz5xSr72XX60FD//vv6zET6yz796az/++/tvjL6zkr84I797bz6yjn+89LzxTzzxDb84pTyzFv96rT71mnuxUr+9dz10Wb834v72HH+9Nb+9drruCP73ID+9+H856b85Jt3fPirAAAAFnRSTlMA0Rx5/CbJ+JHtB+TNrJI6l9S58X2QIoLA1AAAAW5JREFUeAHt1oN6A0EUQOGJnXq0ZmzV7/9YvXXXe2udj4N/EW0IIc3SQSOt1h4JV+w0auW0JofFEGl2ZHpiYlZDaL+RbcxqJWBq5WwTRhLKNnB5eANnwhtAWAMVKngDCG/g8vAGzoQ3gHKajRJCMrPpCkwAZRsxnZvKc4BkDtRbzTdPzU9yGGjae+68ns+MXmSAwfYzDDWyo0FDrW1Wg61FA0a/sHlWtqK92ajL8enY59w/i+t2AdaXasAw13FGQ849tx/NWXA+HDmOywJGCkoNMFcGjWZ4YGBBRN4fpt0ancnbKJPPC+qt0WAm1QiLUazRZkNLZTijX/NLhapYw23P0pEGWitCIA00EAxp7EWfIs+zViiTOOP1YRvK+IpQce8PXVpwXSgDSCA+bwaNpqeYpO+Pu0g18HWMNvZTTULvaSTdzQZJzXZUxhhAanL07b/X/6ZVw5pjUmohzRH8Re8iTffur3+7Uctbo11qkhvyszc0CTNWCAAAAABJRU5ErkJggg==)"
},
{
  "doc":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAMAAAD8KXLNAAAAulBMVEUAAACPw/ePw/lgqvVfqvaUx/mQxPhfqfWjz/lfqfVfqvZgp/9cp/ZfqvZgqvaayPpTpPVfqvVjpvNgqfaQw/mjzvq42PdfqvZgqvZiq/ZwsveRxflkqe9rsPdcqPZeqPRorvfN5fzw9/5bp/Z2tvdZoOqTxvqCuvPj8P7+//+QxPmBvfl3su+Pw/lWpfWx1fuJwPlUpPWVxvnp8/7////4+/9ure3C3/uq0fvb7P1usffn8v15tfFMmOceGILeAAAAF3RSTlMAIdHm7ijJ+JH8eQeTzaw68foX1Ll9kGZdllAAAAEQSURBVHgB7dZVcsMwFIVhhTkp5krmMJcZ9r+sMl7PEczopfC/f7ZFtoUQreZuWVepJ3g73VKtoSvaKzDS6kp9abSsMtQumQ1HtYbZcCSl2TBkZRiyNU+o4m6WxYqzeUIFd/P0eO7m6fGsDUNmQ+lsypA0ll6E4XdkYSbrTTj96AlJczSJ1rOP7vrQsFt9dl/HBnX8y00Cg0YFqBtkKJuDbgdEwMSLM9Cp9GnUCWoD54AOYH7XZwRDhtQRagVNfA5azKXX9RmirpGRaowKfM6bt/NDekPZYa6rIAEGz/VwNfJvskGuy3FimAOVzzhvlA+Z//f1vyltu5p90Sw5mq2eEG1H03759e+Ua7aVO82WeASxdDP0M8Z9fAAAAABJRU5ErkJggg==)"
},
{
  "default":"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAYAAADL94L/AAAByElEQVR4Ae3axdJTQRAFYFyegA3u8ALseCDcicsGhxt3x+G32BXc3X3NBnfXYTqp3sZlhuqpOlXZRL46He9ReJyJxGSTEreaPfEHZiX+1uSJvelVNu+Jvjd7Yk9zI8aSUe0eDpjCIYfNSuw5v/zF5In/6mU27478tXriLJvXjdSwPq1lCDTCmxjiCNav8GZYBVMwWKagX8kWjk9vCcMhYWhEFEw1+oV0wZjdPKY6Vn9EwmBDTYPwBoXCYPLGDQTJjkHQNQRJj0FQtmgs+C8wOHIIkh2DoDu5vD5Xfkz9hsTBWDyxhjDYUDqvLRYSY1JilSQGyyxXOt4QKJPX70NDQmI27gyxHcn9bH/5RFMNAUgoDI4afOAMHBiCdiDNj5woGAhgsCEYudSI1lBCRwoPL957slAoDDYEoPXb/ZVs3FE/y9072fDxsx4BMPVfGOpl1VY/y5++4EWM1Fm9LcCKpy8RpnchDGEIQxjCEIYwhCEMYQhDGMIQhjCEIQxhCEMYwhCGMIQhDGEIQxhYNlXiP+XHXLRDM5thQVpyzIfS2YtLceVEkRmzalsgMArPhp258bA6b/LEb8LqPM930VNdvY/fhMmCxw+Of+4BTcPInBo2AAAAAElFTkSuQmCC)"  
}];
var defaultGroupImage;

socket.on("connect", function () {
  let userloggedin = document.getElementById("loggedinUserName").textContent;
  console.log(userloggedin);
  socket.emit("my event", { data: "I'm connected!", name: userloggedin });
  document.getElementById("loadingSpinner").style.display = "";
  recieverObject = {image:document.getElementById("recieverImage"),name:document.getElementById("recieverUserName"),type:""};
});

socket.on("after connect", function (data) {
  if (data["error"]) {
    alert(data["error"]);
    document.getElementById("loadingSpinner").style.display = "none";
  } else {
    console.log(data["selectedName"]);
    preselectedName = data["selectedName"];
    senderName = data["name"];
    recieverName = preselectedName;
    recieverImage = (data["contacts"].find( x => x["name"] === recieverName) ? data["contacts"].find( x => x["name"] === recieverName):data["groups"].find(x => x["name"] === recieverName))["profileimage"];
    setSelectedContact(data["contacts"].find( x => x["name"] === recieverName) ? "contact":"group");
    contactListDomElement = document.getElementById("contactList");
    contactListDomElement.innerHTML = "";
    contactList = data["contacts"]
    groupList = data["groups"]
    searchbar = document.getElementById("searchbar");
    for(var contact of contactList){
      addNamesToContactList(contact);
    }
    for(var group of groupList){
      addNamesToContactList(group);
    }
    load();
    socket.emit("get-message-list", {
      sender: senderName,
      reciever: recieverName,
    });
  }
});

function load() {
  var isSearchBarOnFocus = false;
  console.log("calling onload");
  searchbar.onmouseover = function (event) {
    searchbar.style.background = "#435F7A";
    document.getElementById("searchIcon").style.background = "#435F7A";
  };
  searchbar.onmouseleave = function (event) {
    if (!isSearchBarOnFocus) {
      searchbar.style.background = "#32465A";
      document.getElementById("searchIcon").style.background = "#32465A";
    }
  };
  searchbar.onfocus = function (event) {
    searchbar.style.background = "#435F7A";
    document.getElementById("searchIcon").style.background = "#435F7A";
    isSearchBarOnFocus = true;
  };
  searchbar.onblur = function (event) {
    searchbar.style.background = "#32465A";
    document.getElementById("searchIcon").style.background = "#32465A";
    isSearchBarOnFocus = false;
  };
}

function addNamesToContactList(names) {
    contactListDomElement.innerHTML +=
      "<li style='background:" +
      (names["name"].toLowerCase() === preselectedName.toLowerCase()
        ? "#435F7A"
        : "#2C3E50") +
      ";color:white;padding-left:6vh;'class='list-group-item contact' onclick ='selectedContactFromContactList(event,\""+names["type"]+"\""+")'>" +
      "<div style='display:inline-block;'>" +
      " <img style='vertical-align:top' src='" +
      names["profileimage"] +
      "' width='50' height='50' class='rounded-circle' alt=''>" +
      "</div>" +
      "<div style='display:inline-block;vertical-align: bottom'>" +
      "<span style='font-size:15px;font-weight:bold;'>&nbsp " +
      names["name"] +
      "</span><br> <span style='font-size:15px;'>&nbsp "+names["lastMessage"] +"</span>" +
      "</div>" +
      "<div id=" +
      names["name"].toLowerCase().replace(" ","_") +
      " style='display :" +
      (MessageFromOtherContact[names["name"].toLowerCase()]
        ? ""
        : "none") +
      "' class='rounded-circle message-count'>" +
      "<span style='color:white'></span>" +
      "</div>"+
  "</li>";
}

function selectedContactFromContactList(event,type) {
  document.querySelectorAll(".contact").forEach((element) => {
    element.style.background = "#2C3E50";
  });
  event.target.querySelector(".message-count").style.display = "none";
  recieverName = event.target.querySelector("span").innerText.trim();
  recieverImage = event.target.querySelector("img").src;
  MessageFromOtherContact[recieverName.toLowerCase()] = 0;
  event.target.style.background = "#435F7A";
  document.getElementById("messagesList").innerHTML = "";
  setSelectedContact(type);
  document.getElementById("loadingSpinner").style.display = "";
  socket.emit("get-message-list", {
    sender: senderName,
    reciever: recieverName,
  });
}
function changeIcon() {
  var icon = document.getElementById("angledown");
  if (icon.className == "fa fa-angle-up") {
    icon.className = "fa fa-angle-down";
    contactListDomElement.style.maxHeight = "71.7vh";
  } else {
    icon.className = "fa fa-angle-up";

    contactListDomElement.style.maxHeight = "55.7vh";
  }
}

function changeBackgroundcolor(element) {
  element.style.background = "#435F7A";
}
function attachment(event) {
  document.getElementById("fileid").click();

}

function postMessage(event) {
  var bubble = document.getElementById("messageTyped");
  var attachments = null;
  let reader = new FileReader();
  reader.onload = function(e){
    attachments = { 
      filename:document.getElementById("fileid").files[0].name,
      filetype:document.getElementById("fileid").files[0].type,
      file:e.target.result
    }
    sendTheMessageRequest(bubble,attachments)
    document.getElementById("fileid").value=null;
  }
  if(document.getElementById("fileid").files && document.getElementById("fileid").files.length > 0){
  reader.readAsDataURL(document.getElementById("fileid").files[0]);
  }else{
    this.sendTheMessageRequest(bubble,attachments);
  }
  
}

function sendTheMessageRequest(bubble,attachments){
  if (bubble.value.length != 0 || attachments!= null) {
    socket.emit("send-message", {
      sender: senderName,
      message: bubble.value,
      reciever: recieverName,
      attachment:attachments,
      recieverType: contactList.findIndex(c => c.name.toLowerCase() === recieverName.toLowerCase()) > -1 ? "contact":"group",
    });
    if(attachments){
    document.getElementById("messagesList").innerHTML += enterRightMessage(
      bubble.value,attachments,document.getElementById("userPhoto").getAttribute("src")
    );
    listOfFiles.push(attachments);
    }else{      
    document.getElementById("messagesList").innerHTML += enterRightMessage(
      bubble.value,attachments,document.getElementById("userPhoto").getAttribute("src")
    );
    }
    //autoExpand(document.getElementsByTagName("textarea")[document.getElementsByTagName("textarea").length-1]);
    document
      .getElementById("messages")
      .scrollTo(0, document.getElementById("messages").scrollHeight);
    bubble.value = "";
  } else {
    alert("message box cannot be empty");
  }
}

document.addEventListener(
  "keyup",
  function (event) {
    if (event.target.id === "messageTyped") {
      if (!event) event = window.event;
      var keyCode = event.keyCode || event.which;
      if (keyCode == "13") {
        postMessage(document.getElementById("messageTyped"));
        return false;
      }
    }
    if (event.target.id === "searchbar") {
      contactListDomElement.innerHTML = "";
      let filteredName = contactList.filter((x) =>
        x["name"].toLowerCase().includes(event.target.value.toLowerCase())
      );
      let filteredGroup = groupList.filter((x) => 
      x["name"].toLowerCase().includes(event.target.value.toLowerCase())
      );
      console.log(filteredName);
      for(var contact of filteredName){
        addNamesToContactList(contact);
      }
      for(var group of filteredGroup){
        addNamesToContactList(group);
      }
    }
  },
  false
);

var autoExpand = function (field) {
  // Reset field height
  field.style.height = "inherit";
  field.style.fontSize = 16;
  field.style.width = "wrap-contant";
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
  var height =
    parseInt(computed.getPropertyValue("border-top-width"), 10) +
    parseInt(computed.getPropertyValue("padding-top"), 10) +
    field.scrollHeight +
    parseInt(computed.getPropertyValue("padding-bottom"), 10) +
    parseInt(computed.getPropertyValue("border-bottom-width"), 10);
  field.style.height = height + "px";

  //console.log(field.value.length);
  //console.log(field.getAttribute("cols"));
};

function enterLeftMessage(message,attachment,image,sender = null) {
  if(attachment){
  var index = Object.keys(fileTypeImages).findIndex((ele)=>{return attachment.filename.indexOf(Object.keys(fileTypeImages[ele])[0]) > -1;})
  }
  return (
    "<li class='list-group-item' style='border:0px'>" +
    "<div style='display: inline-block;vertical-align: top;padding-right:2vh;'>" +
    "<img src='"+image+"' width='25' height='25' class='rounded-circle'>" +
    "</div>" +
    //"<div style='display:inline-block;padding-left: 2vh;width:100%;'>"+
    //"<textarea readonly rows='1' style='width:100%;'>"+message+"</textarea>"+
    "<div style='text-align:left;background:#2C3E50;max-width:48%;border-radius:25px;border:1px solid #A9A9A9;color:white;padding:12px;display:inline-block;'>" +
    (sender ? "<span style='font-size:12px'>"+sender+"</span><br>":"")+
    (attachment?attachment.filename.indexOf("png")> -1 ? "<img src="+attachment.file+" width='350' height='200' id='"+attachment.filename+"' onclick='downloadTheFile(event)'>":
    "<div style='display:inline-flex'><div style='display:flex;background-size:contain;background-repeat:no-repeat;width:30px;height:20px;background-image:"+Object.values(fileTypeImages[index == -1? fileTypeImages.length-1:index])[0]+"'></div>"+
    "<div style='display:inline-block;max-width:90%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis' id='"+attachment.filename+"' onclick='downloadTheFile(event)'><span>"+attachment["filename"]+"</span></div></div><br>" : "")    
    +message +
    "</div>" +
    //"</div>"+
    "</li>"
  );
}

function enterRightMessage(message,attachment,image) {
  if(attachment){
  var index = Object.keys(fileTypeImages).findIndex((ele)=>{return attachment.filename.indexOf(Object.keys(fileTypeImages[ele])[0]) > -1;})
  }
  return (
    "<li class='list-group-item' style='text-align:right;border:0px'>" +
    //"<div style='display: inline-block;padding-right: 2vh;width:55%;'>"+
    //"<textarea readonly rows='1'  style='text-align:left;background:white;color:black'>"+message+"</textarea>"+
    
    "<div style='text-align:end;background:white;max-width:48%;border-radius:25px;border:1px solid #A9A9A9;color:black;padding:12px;display:inline-block;'>" +
    (attachment?attachment.filename.indexOf("png")> -1 ? "<img src="+attachment.file+" width='350' height='200' id='"+attachment.filename+"' onclick='downloadTheFile(event)'>":
      "<div style='display:inline-block;max-width:90%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-right:2vw' id='"+attachment.filename+"'onclick='downloadTheFile(event)'><span>"+attachment["filename"]+"</span></div>"+
      "<div style='position:absolute;display:inline-block;right:4.5vw;background-size:contain;background-repeat:no-repeat;width:30px;height:20px;background-image:"+Object.values(fileTypeImages[index == -1? fileTypeImages.length-1:index])[0]+"'></div><br>"
       : "") 
    +message +
    "</div>" +
    //"</div>"+
    "<div style='display:inline-block;vertical-align: top;padding-left:2vh;'>" +
    "<img src='"+image+"' width='25' height='25' class='rounded-circle'>" +
    "</div>" +
    "</li>"
  );
}

socket.on("message-recieved", (data) => {
  if (
    senderName.toLowerCase() == data["reciever"].toLowerCase() &&
    recieverName.toLowerCase() == data["sender"].toLowerCase()
  ) {
    document.getElementById("messagesList").innerHTML += enterLeftMessage(
      data["message"],data["attachment"],data["senderImage"]
    );
    document
      .getElementById("messages")
      .scrollTo(0, document.getElementById("messages").scrollHeight);
    if(data["attachment"]){
      listOfFiles.push(data["attachment"]);
    }
  } else if (senderName.toLowerCase() == data["reciever"].toLowerCase()) {
    MessageFromOtherContact[
      data["sender"].toLowerCase()
    ] = MessageFromOtherContact[data["sender"].toLowerCase()]
      ? MessageFromOtherContact[data["sender"].toLowerCase()] + 1
      : 1;
    document.getElementById(data["sender"].toLowerCase().replace(" ","_")).style.display = "";
    document
      .getElementById(data["sender"].toLowerCase().replace(" ","_"))
      .querySelector("span").innerText = MessageFromOtherContact[
      data["sender"].toLowerCase()
    ].toString();
  }
  else if(groupList.findIndex( (group) => {return group.name.toLowerCase() === data["reciever"].toLowerCase()}) > -1){
    if(recieverName.toLowerCase() === data["reciever"].toLowerCase() && senderName.toLowerCase() !== data["sender"].toLowerCase()){
      document.getElementById("messagesList").innerHTML += enterLeftMessage(
        data["message"],data["attachment"],data["senderImage"],data["sender"]
      );
      document
        .getElementById("messages")
        .scrollTo(0, document.getElementById("messages").scrollHeight);
      if(data["attachment"]){
        listOfFiles.push(data["attachment"]);
      }
    }
    else if(senderName.toLowerCase() !== data["sender"].toLowerCase()){
    MessageFromOtherContact[
      data["reciever"].toLowerCase()
    ] = MessageFromOtherContact[data["reciever"].toLowerCase()]
      ? MessageFromOtherContact[data["reciever"].toLowerCase()] + 1
      : 1;
    document.getElementById(data["reciever"].toLowerCase().replace(" ","_")).style.display = "";
    document
      .getElementById(data["reciever"].toLowerCase().replace(" ","_"))
      .querySelector("span").innerText = MessageFromOtherContact[
      data["reciever"].toLowerCase()
    ].toString();
  }
  }
});

socket.on("message-list", (data) => {
  document.getElementById("messagesList").innerHTML="";
  listOfFiles=[];
  loadMessages(data);
  document.getElementById("loadingSpinner").style.display = "none";
});

function loadMessages(messages) {
  for (var i = 0; i < messages['messages'].length; i++) {
    var bubble = "";
    if (messages['messages'][i].type === "left") {
      bubble = enterLeftMessage(messages['messages'][i].message,messages['messages'][i].attachment,messages['recieverImage'],recieverObject.type === "group"? messages['messages'][i].sender : null);
    }
    if (messages['messages'][i].type === "right") {
      bubble = enterRightMessage(messages['messages'][i].message,messages['messages'][i].attachment,messages['senderImage']);
    }
    if (bubble === "") continue;
    document.getElementById("messagesList").innerHTML += bubble;
    if(messages['messages'][i].attachment){
      listOfFiles.push(messages['messages'][i].attachment);
    }
  }
  var textareas = document.getElementsByTagName("textarea");
  for (var i = 0; i < textareas.length; i++) {
    autoExpand(textareas[i]);
  }
  document.getElementById("messages").scrollTop = document.getElementById(
    "messages"
  ).scrollHeight;
}

function logOut() {
  var request = new XMLHttpRequest();
  request.open("GET", "/logout");
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        alert("loggedout");
        window.location.href = "/";
      } else if (request.status === 500) {
        alert("internal server error");
      }
    }
  };
  request.send();
}

function selectNewContacts() {
  FriendsListToAdd = [];
  socket.emit(
    "get-friends-list",
    document.getElementById("loggedinUserName").textContent
  );
}

socket.on("display friends list", function (data) {
  let tableDisplayContacs = document.getElementById("tableDisplayContacs");
  tableDisplayContacs.innerHTML = "";
  fillTableWithContactsForAddFriendsOrGroup(data,tableDisplayContacs);
});

function addFriendsListAsContacts() {
  console.log(FriendsListToAdd);
  socket.emit("add-friends-to-user", {
    username: document.getElementById("loggedinUserName").textContent,
    friendsList: FriendsListToAdd,
  });
  FriendsListToAdd = [];
}
function downloadTheFile(event){
  var filename = event.currentTarget.getAttribute("id");
  var fileData = listOfFiles.find((ele)=>{return ele.filename === filename;});
  if(fileData){
    urltoFile(fileData.file,fileData.filename,fileData.filetype)
    .then( function(file){
      saveAs(file); // Defined in FileSaver.js
    })
  }
}
function urltoFile(url, filename, mimeType){
  return (fetch(url)
      .then(function(res){return res.arrayBuffer();})
      .then(function(buf){return new File([buf], filename,{type:mimeType});})
  );
}
function setSelectedContact(type){
  recieverObject.image.src = recieverImage;
  recieverObject.name.textContent = recieverName;
  recieverObject.type = type
}
function fillTableWithContactsForAddFriendsOrGroup(data,tableDisplayContacs){
  if (data.length > 0) {
    var innerElements = "<tr>";
    for (let i = 0; i < data.length - 1; i++) {
      if (i % 4 == 0) {
        innerElements += "</tr><tr>";
      }

      innerElements +=
        "<td style='padding-right: 1vw;padding-bottom:3vh;vertical-align:top'>" +
        "<div style='text-align: center;'>" +
        "<input type='button' style='border-radius: 25%; width: 100px;height: 100px;background-size: 100px 100px;'> <br>" +
        "<span>" +
        data[i]["name"] +
        "</span>" +
        "</div>" +
        "</td>";
    }
    innerElements +=
      "<td style='padding-right: 1vw;padding-bottom:3vh;vertical-align:top'>" +
      "<div style='text-align: center;'>" +
      "<input type='button' style='border-radius: 25%; width: 100px;height: 100px;background-size: 100px 100px;'> <br>" +
      "<span>" +
      data[data.length - 1]["name"] +
      "</span>" +
      "</div>" +
      "</td></tr>";

    tableDisplayContacs.innerHTML = innerElements;

    let inputelements = tableDisplayContacs
      .getElementsByTagName("Input");
    for (let i = 0; i < inputelements.length; i++) {
      inputelements[i].style.backgroundImage = data[i]["profileimage"].indexOf("data:image/") != -1 ?
      "url('"+data[i]["profileimage"] + "')"
      :"url('data:image/png;base64," + data[i]["profileimage"] + "')";
      inputelements[i].addEventListener("click", function (event) {
        if (
          !event.target.style.borderStyle ||
          event.target.style.borderStyle == "none"
        ) {
          event.target.style.borderStyle = "inset";
          event.target.style.border = "5px solid green";
          FriendsListToAdd.push(
            event.target.parentElement.getElementsByTagName("span")[0].innerText
          );
        } else {
          event.target.style.borderStyle = "none";
          event.target.style.border = "none";
          FriendsListToAdd.splice(
            FriendsListToAdd.indexOf(
              event.target.parentElement.getElementsByTagName("span")[0]
                .innerText
            ),
            1
          );
        }
      });
    }
  } else {
    tableDisplayContacs.innerHTML = "<tr><td>All friends selected </td></tr>";
  }
}
function selectNewGroup(){
  FriendsListToAdd = [];
  let tableDisplayGroups = document.getElementById("tableDisplayGroups")
  tableDisplayGroups.innerHTML = "";
  defaultGroupImage = document.getElementById("groupImage").src;
  fillTableWithContactsForAddFriendsOrGroup(contactList,tableDisplayGroups);
}
function selectGroupImage(){
  document.getElementById("my_file").click();
}
function renderNewGroupImage(input){
  var imagebox = document.getElementById("groupImage");
  if(input.files && input.files[0]){
    let reader = new FileReader();
    reader.onload = function(e){
      console.log(e);      
      imagebox.setAttribute("src",e.target.result)
    }
    reader.readAsDataURL(input.files[0]);
  }

}
function addFriendsListAsGroup(){
  socket.emit("add-group-to-user",{
    username: document.getElementById("loggedinUserName").textContent,
    friendsList: FriendsListToAdd,
    groupname: document.getElementById("groupName").value,
    groupimage: document.getElementById("groupImage").src
  });
  FriendsListToAdd = [];
  document.getElementById("groupName").value = "";
  document.getElementById("groupImage").src = defaultGroupImage;
}
