import { Component, OnInit } from '@angular/core';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages:any= [{"type":"right","message":"When you're backed against the wall, break the god damn thing down."},
                {"type":"right","message":"Excuses don't win championships."},
                {"type":"left","message":"Oh yeah, did Michael Jordan tell you that?"},
                {"type":"right","message":"No, I told him that."},
                {"type":"right","message":"What are your choices when someone puts a gun to your head?"},
                {"type":"left","message":"What are you talking about? You do what they say or they shoot you."},
                {"type":"right","message":"Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things."}];

  private names:any =["Cras justo odio","Dapibus ac facilisis in","Vestibulum at eros"];
  public anglechangeIcon:string;
  private angleChange: boolean = true;
  private isSearchBarFocused:boolean=false;
  private messageSide:boolean=true;
  constructor() { }

  ngOnInit() {
    for(let i=1 ;i< 3 ;i++){
      this.names=this.names.concat(this.names);
    }
    this.anglechangeIcon="fa fa-angle-down";
  }

  changeIcon(contactList:any){
    if(this.angleChange){
      this.anglechangeIcon="fa fa-angle-up";
      this.angleChange=!this.angleChange;
      contactList.style.maxHeight="47.0vh";
    }
    else{
      this.anglechangeIcon="fa fa-angle-down";
      this.angleChange=!this.angleChange;
      
      contactList.style.maxHeight="72.7vh";
    }
  }

  searchbarChange(event:any,type:String,searchIcon:any){
    switch(type){
      case 'mouseover': event.target.style.background=searchIcon.style.background="#435F7A";
      break;
      case 'mouseleave':
      if(!this.isSearchBarFocused)
        event.target.style.background=searchIcon.style.background="#32465A";
       break;
      case 'focus':
      event.target.style.background=searchIcon.style.background="#435F7A";
      this.isSearchBarFocused=true;
      break;
      case 'blur':
      event.target.style.background=searchIcon.style.background="#32465A";
      this.isSearchBarFocused=false;
      break;
    }
  }

  changeIconEvent(event:any,type:string){
    switch(type){
      case 'focus': event.target.style.background="#435F7A";
      break;
      case 'blur' : event.target.style.background="#32465A";
      break;
    }
  }

  keydowns(event:any,Messages:any,messageList:any)
  {
    // console.log(event);
    // var newVal:string = event.target.value.replace(/\D/g, '');
    // event.target.value="";
    // if (newVal.length <= 3) {
    //   newVal = newVal.replace(/^(\d{1,3})/, '($1)');
    // } else if (newVal.length <= 6) {
    //   newVal = newVal.replace(/^(\d{1,3})(\d{1,3})/, '($1) $2');
    // } else {
    //   newVal = newVal.replace(/^(\d{1,3})(\d{1,3})(.*)/, '($1) $2-$3');
    // }
    // event.target.value=newVal;
    console.log(event);
    if(event.keyCode==13)
    {
      var height:number=0;
      if(this.messageSide){
      this.messages=this.messages.concat([{'type':'right','message':event.target.value}]);
      
      }
      else{
      this.messages=this.messages.concat([{'type':'left','message':event.target.value}]);
      }
      event.target.value="";
      console.log(document.getElementById("leftMessage"));
      Messages.scrollTo(0,Messages.scrollHeight);
    }
  }
}

