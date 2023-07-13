import { Component,ViewChild, ElementRef,Input, OnInit,OnDestroy} from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TableInfoStrings,LobbyTableDataDTO,ChatMessages, jwt, LobbyDataInput, Player,TableData } from 'src/app/models/player.model';
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
  username_test:any="";
  jwtObj:jwt={
    jwtString:""
  };
  currentError:string="";
  jwtStorage:any="";
  messages:ChatMessages[]=[];
  newMessage: string = "";
  newAuthor:string="";

  Arrows:boolean[]=[true,true];
  DisplayedTablesCurrentIterator:number=0;
  DisplayedTablesMaxIterator:number=0;
  TablesInfoStrings:TableInfoStrings[]=[];
  TableDataFromServer:LobbyTableDataDTO[]=[];
  
  @ViewChild('chatMessages',{static:false})chatMessagesRef!: ElementRef;
  
  constructor(private playersService: PlayersServicesService,private router:Router,private appmodule:AppModule,private SignalRService:SignalRService,
              private appComponent:AppComponent) {
    /* funkcja sprawdzajaca czy ktos jest zalogowany na tym urzadzeniu. Jesli tak to zimportuj dane  */
    this.messages=[];

    for(let i=0;i<6;i++){
      let tableData: TableInfoStrings = {
        Name: " ",
        minBet: " ",
        maxBet: " ",
        betTime: " ",
        sidebets: " ",
        maxSeats: " "
      };
      this.TablesInfoStrings.push(tableData);
    }
  }
  async ngOnInit(): Promise<void> {
    this.jwt_test=localStorage.getItem("jwt");
    this.username_test=localStorage.getItem('username');
      if(this.jwt_test===null||this.username_test===null){
        localStorage.clear();
        this.router.navigate(['login']);
      }
      else{
        this.jwtObj.jwtString=this.jwt_test;

        try {
          console.log(this.jwtObj.jwtString);
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
    this.SignalRService.QuitLobbyListener();
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
  leftTableDislay(){
    if(this.DisplayedTablesCurrentIterator>0)
    {
    this.DisplayedTablesCurrentIterator--;
    if(this.DisplayedTablesCurrentIterator===0)this.Arrows[0]=false;
    else this.Arrows[0]=true;
    }
  }
  rightTableDislay(){

    if(this.DisplayedTablesCurrentIterator<this.DisplayedTablesMaxIterator)
    {
    this.DisplayedTablesCurrentIterator++;
    if(this.DisplayedTablesCurrentIterator<this.DisplayedTablesMaxIterator)this.Arrows[1]=true;
    else this.Arrows[1]=false;
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
        if(tableData.length>0){
        this.TableDataFromServer.length=0;
        this.TableDataFromServer=tableData;
        let tableArray:TableInfoStrings[]=[];
        this.DisplayedTablesMaxIterator=Math.floor(tableData.length/6);
        if(this.DisplayedTablesCurrentIterator<this.DisplayedTablesMaxIterator){this.Arrows[1]=true;}
        else {this.Arrows[1]=false;}
        if(this.DisplayedTablesCurrentIterator===0){this.Arrows[0]=false;}
        else {this.Arrows[0]=true;}
        if (this.DisplayedTablesCurrentIterator>this.DisplayedTablesMaxIterator)this.DisplayedTablesCurrentIterator=this.DisplayedTablesMaxIterator;
        if (this.DisplayedTablesCurrentIterator<0)this.DisplayedTablesCurrentIterator=0;
        
        for (let i=0;i<tableData.length;i++){
        let tableObj:TableInfoStrings={
          Name: tableData[i].name+" #"+parseInt(tableData[i].id.substring(0,4), 16),
          minBet: "Minimal bet: "+tableData[i].minBet.toString(),
          maxBet: "Maximal bet: "+tableData[i].maxBet.toString(),
          betTime: "Time to bet: "+tableData[i].betTime.toString(),
          sidebets: "Sidebets enabled: "+tableData[i].sidebets.toString(),
          maxSeats: "Seats: "+tableData[i].maxSeats.toString()
        }
          tableArray.push(tableObj);
        }
        for (let i=0;i<6;i++){
          let emptyobj:TableInfoStrings={
            Name: " ",
            minBet: " ",
            maxBet: " ",
            betTime: " ",
            sidebets: " ",
            maxSeats: " "
          };
          tableArray.push(emptyobj);
          let emptyobj2:LobbyTableDataDTO={
            id:"",
            name:"",
            minBet:0,
            maxBet:0,
            betTime:0,
            sidebets:false,
            maxSeats:0
          };
          this.TableDataFromServer.push(emptyobj2);
        }
        this.TablesInfoStrings=tableArray;
      }
    });
    

      
    this.Currentgame=gameType;
  }
  GoBack(){
    this.CurrentDisplay="MainMenu";
  }
  LobbyGoBack(){this.CurrentDisplay="TableChoose";this.messages.length=0;this.SignalRService.QuitLobbyListener();
  this.SignalRService.Disconnect();}
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      let Author = localStorage.getItem("username");
      let JWT=localStorage.getItem("jwt");
      if(Author&&JWT)this.SignalRService.SendChatMessage(Author.toString(),this.newMessage);
    }
  }

  async ChooseTable(Table:LobbyTableDataDTO){
    
    localStorage.setItem("TableId",Table.id);
    localStorage.setItem("TableName",Table.name);
    localStorage.setItem("TableMinBet",Table.minBet.toString());
    localStorage.setItem("TableMaxBet",Table.maxBet.toString());
    localStorage.setItem("TableBetTime",Table.betTime.toString());
    localStorage.setItem("TableSidebets",Table.sidebets.toString());
    localStorage.setItem("TableMaxSeats",Table.maxSeats.toString());
    let JWT=localStorage.getItem("jwt");
    if(JWT)this.SignalRService.EnterTable(Table.id,JWT.toString());
  }

  private scrollToBottom() {
    this.newMessage = '';
    const chatMessagesEl = this.chatMessagesRef.nativeElement;
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }
}
