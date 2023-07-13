import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AppModule } from 'src/app/app.module';
import { ChatMessages } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import{TableServiceService} from 'src/app/services/table-service.service';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.scss']
})
export class BlackjackComponent implements OnInit,OnDestroy {

  unameToDisplay:any=localStorage.getItem("username");
  bankrollToDisplay:any=localStorage.getItem("bankroll");
  profitToDipslay:any=localStorage.getItem("profit");

  currentError:string="";
  jwtStorage:any="";
  messages:ChatMessages[]=[];
  newMessage: string = "";
  newAuthor:string="";

  @ViewChild('chatMessages',{static:false})chatMessagesRef!: ElementRef;
  
  constructor(private playersService: PlayersServicesService,private TableService:TableServiceService,private router:Router,private appmodule:AppModule,private SignalRService:SignalRService,
    private appComponent:AppComponent){
      this.messages=[];
    }
  ngOnInit():void
  {
    
  }
  ngOnDestroy(): void {

  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      let Author = localStorage.getItem("username");
     // if(Author)this.SignalRService.SendChatMessage(Author.toString(),this.newMessage);
    }
  }
  private scrollToBottom() {
    this.newMessage = '';
    const chatMessagesEl = this.chatMessagesRef.nativeElement;
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }
}
