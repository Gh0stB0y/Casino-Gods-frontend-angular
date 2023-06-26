import { Component,ViewChild, ElementRef,Input, OnInit,OnDestroy} from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { LobbyTableDataDTO,ChatMessages, jwt, LobbyDataInput, Player,TableData } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { AppModule } from 'src/app/app.module';
import { AppComponent } from 'src/app/app.component';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss']
})
export class PlayerMenuComponent implements OnInit,OnDestroy{
  
  CurrentDisplay:string="MainMenu";
  Currentgame:string="Loading, please wait...";
  currentGameIndex:number=0;
  gamesList:string[]=[];
  lobbyData: LobbyDataInput={
    jwt:"",
    ChosenGame:""
    };
  unameToDisplay:any=localStorage.getItem("username");
  bankrollToDisplay:any=localStorage.getItem("bankroll");
  profitToDipslay:any=localStorage.getItem("profit");
  test:boolean=true;
  jwt_test:any="";
  jwtObj:jwt={
    jwtString:""
  };
  currentError:string="";
  jwtStorage:any="";
  messages:ChatMessages[]=[];
  newMessage: string = "";
  newAuthor:string="";
  
  @ViewChild('chatMessages',{static:false})chatMessagesRef!: ElementRef;
  constructor(private playersService: PlayersServicesService,private router:Router,private appmodule:AppModule,private SignalRService:SignalRService,
              private appComponent:AppComponent) {
    /* funkcja sprawdzajaca czy ktos jest zalogowany na tym urzadzeniu. Jesli tak to zimportuj dane  */
    this.messages=[];
  }
  async ngOnInit(): Promise<void> {

    this.jwt_test=localStorage.getItem("jwt");
      if(this.jwt_test==null){
        localStorage.clear();
        this.router.navigate(['login']);
      }
      else{
        this.jwtObj.jwtString=this.jwt_test;
        try {
          const response = await new Promise<void>((resolve, reject) => {
            this.playersService.playerMenu(this.jwtObj).subscribe({
              next: (dataResponse) => {
                localStorage.setItem('jwt', dataResponse.jwt);  
                this.gamesList=dataResponse.gameNames;
                this.Currentgame=this.gamesList[this.currentGameIndex];               
                resolve(); // Resolve the Promise with the received data
              },
              error: (message) => {
                console.log(message);
                this.currentError=message.error;
                localStorage.clear();
                if(this.currentError== "JWT expired,log in again") console.log("user timed out,log in again");        
                this.router.navigate(['login']);
                reject(message); // Reject the Promise with the error
              }
            });
          });     
        }
        catch(error){
          console.log(error);
          localStorage.clear();
          this.router.navigate(['login']);
        }
      }
      
  }
  ngOnDestroy(): void {
    let Author = localStorage.getItem("username");
    if(Author)this.SignalRService.QuitLobbyListener();
    this.SignalRService.Disconnect();
  }
  logOut(){
    /* FUNKCJA: wroc do login-menu, zwolnij miejsce na tym komputerze, i na biezacym koncie */
    this.jwtStorage=localStorage.getItem("jwt");
    if(this.jwtStorage!=null){
    this.jwtObj.jwtString=this.jwtStorage;
    this.playersService.logout(this.jwtObj).subscribe({next: ()=>{console.log("logout")},error:(message)=>{console.log(message);}});
    localStorage.clear();
    this.router.navigate(['login']);
    }
    //
  }
  statistics(){}
  play(){
    this.CurrentDisplay="TableChoose";
  }
  left(){
    if(this.currentGameIndex===0){
      this.currentGameIndex=this.gamesList.length-1;
      this.Currentgame=this.gamesList[this.currentGameIndex];
      
    }
    else {
      this.currentGameIndex--;
      this.Currentgame=this.gamesList[this.currentGameIndex];
    }
  }
  right(){
  if(this.currentGameIndex===this.gamesList.length-1){
    this.currentGameIndex=0;
    this.Currentgame=this.gamesList[this.currentGameIndex];
    
  }

  else {
    this.currentGameIndex++;
    this.Currentgame=this.gamesList[this.currentGameIndex];

  }
  }
  ChooseGame(gameType:string){
    this.CurrentDisplay="Lobby";
    this.appComponent.ToggleWrapperWidth();
    let Author = localStorage.getItem("username");
    if(Author)this.SignalRService.startConnection(gameType);
    this.SignalRService.LobbyListener(
      (username:string,message:string)=>{
        this.messages.push({ text: username+":",text2:message, textColor:'red',text2Color:'white'});   
        this.scrollToBottom();
      });
    this.SignalRService.ReportsListener(
      (report:string) =>{
        this.messages.push({ text: report,text2:"", textColor:'grey',text2Color:'white'});
        this.scrollToBottom();
      });
    this.SignalRService.TableDataListener(
      (tableData:LobbyTableDataDTO[])=>{
        console.log(tableData);
      });
      
    this.Currentgame=gameType;
  }
  GoBack(){
    this.CurrentDisplay="MainMenu";
  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      let Author = localStorage.getItem("username");
      if(Author)this.SignalRService.SendChatMessage(Author.toString(),this.newMessage);
    }
  }
  private scrollToBottom() {
    this.newMessage = '';
    const chatMessagesEl = this.chatMessagesRef.nativeElement;
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }
}
