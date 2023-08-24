import { Component,ViewChild, ElementRef,Input,HostListener, OnInit,OnDestroy} from '@angular/core';
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
  TableDisplay:string="false";
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
  TableMessages:ChatMessages[]=[];
  newMessage: string = "";
  newAuthor:string="";
  SwitchButtonText: string="Switch to table chat";
  LobbyMuteState:boolean=false;
  TableMuteState:boolean=false;
  MuteLobbyButtonText:string="Mute";
  MuteTableButtonText:string="Mute";
  LobbyChatEnabled:boolean=true;

  Arrows:boolean[]=[true,true];
  DisplayedTablesCurrentIterator:number=0;
  DisplayedTablesMaxIterator:number=0;
  TablesInfoStrings:TableInfoStrings[]=[];
  TableDataFromServer:LobbyTableDataDTO[]=[];

  private ComponentDestroyed:boolean = false;
  
  @ViewChild('chatMessages',{static:false})chatMessagesRef!: ElementRef;
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    this.TableGoback();
    this.SignalRService.QuitLobbyListener();
    this.SignalRService.QuitTableListener();
    this.SignalRService.Disconnect();
    this.ComponentDestroyed=true;
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    this.TableGoback();
    this.SignalRService.QuitLobbyListener();
    this.SignalRService.QuitTableListener();
    this.SignalRService.Disconnect();
    this.ComponentDestroyed=true;
  }
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
    if(!this.ComponentDestroyed){
    this.TableGoback();
    this.SignalRService.QuitLobbyListener();
    this.SignalRService.QuitTableListener();
    this.SignalRService.Disconnect();
    //this.playersService.logout();
    }
    // let JWT=localStorage.getItem("jwt");
    // if(JWT)this.SignalRService.QuitTable(JWT);
  }
  logOut()
  {
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
    this.SignalRService.ErrorListener(
      (report:string) =>{
        if(this.LobbyChatEnabled){
          this.messages.push({ text:"ERROR: ",text2:report, textColor:'red',text2Color:'red'});
          this.scrollToBottom();
        }
        else{
          this.TableMessages.push({ text:"ERROR: ",text2:report, textColor:'red',text2Color:'red'});   
          this.scrollToBottom();
        }
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
          maxSeats: "Seats: "+tableData[i].currentSeats.toString()+" / "+tableData[i].maxSeats.toString()
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
            currentSeats:0,
            maxSeats:0
          };
          this.TableDataFromServer.push(emptyobj2);
        }
        this.TablesInfoStrings=tableArray;
      }
    });      
    this.Currentgame=gameType;
    this.DisplayedTablesCurrentIterator=0;
  }
  GoBack(){
    this.CurrentDisplay="MainMenu";
  }
  LobbyGoBack(){
    this.CurrentDisplay="TableChoose";this.messages.length=0;this.SignalRService.QuitLobbyListener();
    this.SignalRService.Disconnect();
  }
  TableGoback(){
    this.TableDisplay="false";
    this.CurrentDisplay="Lobby";
    this.LobbyChatEnabled=true;
    this.SwitchButtonText="Switch to table chat";
    this.SignalRService.QuitTableListener();
    let JWT=localStorage.getItem("jwt");
    if(JWT)this.SignalRService.QuitTable(JWT);
  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      let Author = localStorage.getItem("username");
      let JWT=localStorage.getItem("jwt");
      if(Author&&JWT)this.SignalRService.SendChatMessage(Author.toString(),this.newMessage);
      this.messages.push({ text: Author+":",text2:this.newMessage, textColor:'red',text2Color:'white'});   
      this.scrollToBottom();
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
    let TableNotFull:boolean=false;
    if(JWT)TableNotFull=await this.SignalRService.EnterTable(Table.id,JWT.toString());
    if(TableNotFull)
    {
    this.SwitchButtonText="Switch to lobby chat";
    this.LobbyChatEnabled=false;
    this.TableDisplay=this.Currentgame;
    console.log(this.TableDisplay);
    this.TableMessages=[];
    this.SignalRService.TableChatListener(
      (username:string,message:string)=>{
        this.TableMessages.push({ text: username+":",text2:message, textColor:'red',text2Color:'white'});   
        this.scrollToBottom();
    });
    this.SignalRService.TableReportsListener(
      (report:string) =>{
        this.TableMessages.push({ text: report,text2:"", textColor:'grey',text2Color:'white'});
        this.scrollToBottom();
    });
    }
    else console.log("Table is full");
    this.SignalRService.BankrollListener(
      (NewBankroll:string,Profit:string)=>{
        this.bankrollToDisplay=NewBankroll;
        this.profitToDipslay=Profit;
        let OldProfit=localStorage.getItem("profit");
        let OldBankroll=localStorage.getItem("bankroll");
        if(OldProfit&&OldBankroll) 
        {     
          localStorage.setItem("profit",Profit);
          localStorage.setItem("bankroll",NewBankroll);          
        }                        
    });
  }
  scrollToBottom() {
    this.newMessage = '';
    const chatMessagesEl = this.chatMessagesRef.nativeElement;
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }
  RefreshTableData(){
    this.SignalRService.GetTableData();
  }
  switchChat(){
    if(this.LobbyChatEnabled===true)this.SwitchButtonText="Switch to lobby chat";
    else this.SwitchButtonText="Switch to table chat";
    this.LobbyChatEnabled=!this.LobbyChatEnabled; 
  }
  sendTableMessage(){
    let Author = localStorage.getItem("username");
      let JWT=localStorage.getItem("jwt");
      if(Author&&JWT)this.SignalRService.TableChatMessage(Author.toString(),this.newMessage);
    
  }
  ClearTableMessages(){
    this.TableMessages=[];
  }
  ClearLobbyMessages(){
    this.messages=[];
  }
  ToggleLobbyMute(){
    this.LobbyMuteState=!this.LobbyMuteState;
   if(this.LobbyMuteState){
    this.MuteLobbyButtonText="Unmute";
    this.SignalRService.MuteLobbyChat();
   }
   else{
    this.MuteLobbyButtonText="Mute";
    this.SignalRService.LobbyListener(
      (username:string,message:string)=>{
        this.messages.push({ text: username+":",text2:message, textColor:'red',text2Color:'white'});   
        this.scrollToBottom();
    });
   } 
  }
  ToggleTableMute(){
    this.TableMuteState=!this.TableMuteState;
    if(this.TableMuteState){
      this.MuteTableButtonText="Unmute";
      this.SignalRService.MuteTableChat();
    }
    else{
      this.MuteTableButtonText="Mute";
      this.SignalRService.TableChatListener(
        (username:string,message:string)=>{
          this.TableMessages.push({ text: username+":",text2:message, textColor:'red',text2Color:'white'});   
          this.scrollToBottom();
      });
    } 
  }
}
