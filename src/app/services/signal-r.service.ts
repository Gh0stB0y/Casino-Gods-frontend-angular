import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {LobbyTableDataDTO,ChatMessages,LobbyConnectionData} from 'src/app/models/player.model';
import { PlayerMenuComponent } from '../components/player-menu/player-menu.component';
import { single } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Route, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  
  public ConnectionData:LobbyConnectionData={jwt:"",username:""};
  private UrlArray:string[]=['https://localhost:7267/BacarratLobby',
                              'https://localhost:7267/BlackJackLobby',
                              'https://localhost:7267/DragonTigerLobby',
                              'https://localhost:7267/RouletteLobby',
                              'https://localhost:7267/WarLobby'];
    
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
    
    this.hubConnection=new signalR.HubConnectionBuilder().withUrl(hubUrl).withAutomaticReconnect().build();
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
  public TableDataListener(callback: (report:LobbyTableDataDTO[]) => void):void{
    this.hubConnection.on('TablesData', callback);
  }
  public GetTableData(){
    this.hubConnection?.invoke('GetTableData');
  }
  public SendChatMessage(username:string,message:string){
    this.hubConnection?.invoke('ChatMessages',username,message);
  }
  public JwtUpdate(callback: (report:string) => void): void{
    this.hubConnection?.on('JwtUpdate', callback);
  }
  public DisconnectFromServer(callback: (report:string) => void): void{
    this.hubConnection?.on('Disconnect', callback);
  }
  public QuitLobbyListener(){
    this.hubConnection.off('ChatMessages');
    this.hubConnection.off('ChatReports');
    this.hubConnection.off('TablesData');
  }
  public Disconnect(){
    this.hubConnection?.stop();
  }
}
