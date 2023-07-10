import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AppModule } from 'src/app/app.module';
import { ChatMessages } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { TableServiceService } from 'src/app/services/table-service.service';
import { SignalRService } from 'src/app/services/signal-r.service';
@Component({
  selector: 'app-bacarrat',
  templateUrl: './bacarrat.component.html',
  styleUrls: ['./bacarrat.component.scss']
})
export class BacarratComponent implements OnInit, OnDestroy {
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
    
    this.TableService.startConnection();
    
    this.TableService.TableListener(
      (username:string,message:string)=>{
        this.messages.push({ text: username+":",text2:message, textColor:'red',text2Color:'white'});   
        this.scrollToBottom();
    });
    this.TableService.ReportsListener(
      (report:string) =>{
        this.messages.push({ text: report,text2:"", textColor:'grey',text2Color:'white'});
        this.scrollToBottom();
    });
  }
  ngOnDestroy(): void {
    this.TableService.QuitTableListener();
    this.TableService.Disconnect();
  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      let Author = localStorage.getItem("username");
      //if(Author)this.SignalRService.SendChatMessage(Author.toString(),this.newMessage);
    }
  }
  private scrollToBottom() {
    this.newMessage = '';
    const chatMessagesEl = this.chatMessagesRef.nativeElement;
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }
}