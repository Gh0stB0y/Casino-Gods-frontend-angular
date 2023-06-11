import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';



@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection: signalR.HubConnection;

  constructor() {this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7267/BlackJackLobby') 
    .build(); }

  public startConnection(): void {

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started.');
        console.log(this.hubConnection.connectionId);
        this.addFirstMessageListener((message:string)=>{console.log(message)});
      })
      .catch(err => console.log('Error while starting SignalR connection: ' + err));
  }

  public addFirstMessageListener(callback: (message: string) => void): void {
    this.hubConnection.on('FirstMessage', callback);
  }
}
