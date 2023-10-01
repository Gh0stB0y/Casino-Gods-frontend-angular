import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {LobbyTableDataDTO,ChatMessages,LobbyConnectionData, TableSeat} from 'src/app/models/player.model';
import { PlayerMenuComponent } from '../components/player-menu/player-menu.component';
import { single } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Route, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  
  public ConnectionData:LobbyConnectionData={jwt:"",username:""};
  private UrlArray:string[]=['https://casinogodsserver.azurewebsites.net/BacarratLobby',
                              'https://casinogodsserver.azurewebsites.net/BlackJackLobby',
                              'https://casinogodsserver.azurewebsites.net/DragonTigerLobby',
                              'https://casinogodsserver.azurewebsites.net/RouletteLobby',
                              'https://casinogodsserver.azurewebsites.net/WarLobby'];
    
  private gameType:string[]=["Bacarrat","Blackjack","Dragon Tiger","Roulette","War"];
  private newMap=new Map<string,string>();
  private iterator:number;
  private hubConnection:signalR.HubConnection;
  private StartConnectionData:LobbyConnectionData;
  constructor(private router:Router) {
    for (this.iterator=0;this.iterator<this.gameType.length;this.iterator++){
      this.newMap.set(this.gameType[this.iterator],this.UrlArray[this.iterator]);
    }
    this.hubConnection=new signalR.HubConnectionBuilder().withUrl('dummy').build();//dummy
    this.StartConnectionData={jwt:"",username:""}
  }
  public startConnection(gameType:string):void {

    let JWT=localStorage.getItem('jwt');
    let USERNAME=localStorage.getItem('username');
    if(JWT&&USERNAME)this.StartConnectionData={jwt:JWT.toString(),username:USERNAME.toString()}
    else{localStorage.clear();this.router.navigate(['login']);}
    const hubUrl = this.newMap.get(gameType)+`?param1=${encodeURIComponent(this.StartConnectionData.jwt)}&param2=${encodeURIComponent(this.StartConnectionData.username)}`;
    
    this.hubConnection=new signalR.HubConnectionBuilder().withUrl(hubUrl,
                                                          {
                                                            skipNegotiation:true,
                                                            transport: signalR.HttpTransportType.WebSockets
                                                          })
                                                          .build();
    if(this.hubConnection!=undefined){
      this.hubConnection?.start()
      .then(() => {
        console.log('SignalR connection started.');
        console.log(this.hubConnection?.baseUrl);
        this.GetTableData();
        this.DisconnectFromServer((report:string) =>{
          this.Disconnect();
          console.log(report);
          localStorage.clear();
          this.router.navigate(['login']);
        });
        this.JwtUpdate((jwt:string)=>{
          localStorage.setItem("jwt", jwt);
          //console.log("NOWE jwt: "+jwt);
        });
      })
      .catch(err => console.log('Error while starting SignalR connection: ' + err));}
  }
  public LobbyListener(callback: (username:string,message: string) => void): void {
    this.hubConnection.on('ChatMessages', callback);
  }
  public ReportsListener(callback: (report:string) => void): void{
    this.hubConnection.on('ChatReports', callback);
  }
  public TableChatListener(callback: (username:string,message: string) => void): void {
    this.hubConnection.on('TableChatMessages', callback);
  }
  public TableReportsListener(callback: (report:string) => void): void{
    this.hubConnection.on('TableChatReports', callback);
  }
  public TableDataListener(callback: (report:LobbyTableDataDTO[]) => void):void{
    this.hubConnection.on('TablesData', callback);
  }
  public ErrorListener(callback: (report:string)=>void):void{
    this.hubConnection.on("ErrorMessages",callback);
  }
  public GetTableData(){
    this.hubConnection?.invoke('GetTableData');
  }
  public SendChatMessage(username:string,message:string){
    this.hubConnection?.invoke('ChatMessages',username,message);
  }
  public TableChatMessage(username:string,message:string){
    this.hubConnection?.invoke('TableChatMessages',username,message);
  }
  public async EnterTable(TableId:string,jwt:string):Promise<boolean>{
    const result:boolean = await this.hubConnection?.invoke('EnterTable',TableId,jwt);
    return result;
  }
  public JwtUpdate(callback: (report:string) => void): void{
    this.hubConnection?.on('JwtUpdate', callback);
  }
  public DisconnectFromServer(callback: (report:string) => void): void{
    this.hubConnection?.on('Disconnect', callback);
  }
  public QuitTable(jwt:string){
    this.hubConnection?.invoke("QuitTable",jwt);
  }
  public QuitLobbyListener(){
    this.hubConnection.off('ChatMessages');
    this.hubConnection.off('ChatReports');
    this.hubConnection.off('TableChatMessages');
    this.hubConnection.off('TableChatReports');
    this.hubConnection.off('TablesData');
  }
  public QuitTableListener(){
    this.hubConnection.off('TableChatMessages');
    this.hubConnection.off('TableChatReports');
    this.hubConnection.off("ToggleBetting");
    this.hubConnection.off("Win");
    this.hubConnection.off("Cards");
    //this.hubConnection.off("Bankroll");
  }
  public Disconnect(){
    this.hubConnection?.stop();
  }
  public MuteLobbyChat(){
    this.hubConnection.off('ChatMessages');
  }
  public MuteTableChat(){
    this.hubConnection.off('TableChatMessages');
  }
  public async IsBettingEnabled():Promise<boolean>{
    const result:boolean=await this.hubConnection.invoke("IsBettingEnabled");
    return result;
  }
  public BettingEnabledListener(callback:(IsEnabled:boolean,closedBetsToken:string)=>void):void{
    this.hubConnection.on("ToggleBetting",callback);
  }
  public BetsAreClosingListener(callback:()=>void):void{
    this.hubConnection.on("BetsAreClosing",callback);
  }
  public SendBets(Bets:number[],jwt:string,closedBetsToken:string){
    this.hubConnection.invoke("SendBets",Bets,jwt,closedBetsToken);    
  }
  public WinListener(callback:(WinReport:string,WinValue:number)=>void){
    this.hubConnection.on("Win",callback);
  }
  public BankrollListener(callback:(NewBankroll:string,Profit:string)=>void){
    this.hubConnection.on("Bankroll",callback);
  }
  public DragonTigerCards(callback:(Cards:number[],report:string)=>void){
    this.hubConnection.on("Cards",callback);
  }
  public async GetAllSeatsStatus(TableId:string):Promise<TableSeat[]>{
    const result:TableSeat[] = await this.hubConnection?.invoke('GetAllSeatsStatus',TableId);
    return result;
  }
  public async UpdateSeatInfoListener(callback:(updatedSeat:TableSeat)=>void){
    this.hubConnection.on("UpdateSeatInfo",callback);
  }
  public async TakeASeat(tableId:string,jwt:string,seatId:number){
    await this.hubConnection?.invoke('GetAllSeatsStatus',tableId,jwt,seatId);
  }

}
