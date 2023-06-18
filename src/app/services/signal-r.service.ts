import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {LobbyTableData,ChatMessages} from 'src/app/models/player.model';
import { PlayerMenuComponent } from '../components/player-menu/player-menu.component';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private UrlArray:string[]=['https://localhost:7267/BacarratLobby',
                              'https://localhost:7267/BlackJackLobby',
                              'https://localhost:7267/DragonTigerLobby',
                              'https://localhost:7267/RouletteLobby',
                              'https://localhost:7267/WarLobby'];
    
  private gameType:string[]=["Bacarrat","Blackjack","Dragon Tiger","Roulette","War"];
  private map=new Map<string,signalR.HubConnection>();
  private iterator:number=0;
  public isEntered:boolean=false;
  constructor() {
    for (this.iterator=0;this.iterator<this.gameType.length;this.iterator++){
      this.map.set(this.gameType[this.iterator],new signalR.HubConnectionBuilder()
      .withUrl(this.UrlArray[this.iterator])
      .build());
    }
  }
  public startConnection(gameType:string,messages:ChatMessages[],Author:string):void {
    
    if(this.map.get(gameType)!=undefined){
    this.map.get(gameType)
      ?.start()
      .then(() => {
        console.log('SignalR connection started.');
        console.log(this.map.get(gameType)?.connectionId);
        console.log(this.map.get(gameType)?.baseUrl);
        this.LobbyListener(gameType,Author,
          (username:string,message:string)=>{
            messages.push({ text: username+":",text2:message, textColor:'red',text2Color:'white'});   
          });
        this.ReportsListener(gameType,
          (report:string) =>{
            messages.push({ text: report,text2:"", textColor:'grey',text2Color:'white'})
          });
        // this.FirstConnectionTableData(gameType);
      })
      .catch(err => console.log('Error while starting SignalR connection: ' + err));
   }
  }
  public LobbyListener(gameType:string,Author:string,callback: (username:string,message: string) => void): void {
    this.map.get(gameType)?.on('ChatMessages', callback);
  }
  public ReportsListener(gameType:string,callback: (report:string) => void): void{
    this.map.get(gameType)?.on('ChatReports', callback);
  }
  public SendChatMessage(gameType:string,username:string,message:string){
    this.map.get(gameType)?.invoke('ChatMessages',username,message);
  }
  public QuitLobbyListener(gameType:string,Author:string){
    this.map.get(gameType)?.off('ChatMessages');
    this.map.get(gameType)?.off('ChatReports');
  }
  public Disconnect(gameType:string){
    this.map.get(gameType)?.stop();
  }
}
