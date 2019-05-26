import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
    for(let i=0 ;i< 4 ;i++){
      this.names=this.names.concat(this.names);
    }
  }

}
