import { Injectable } from '@angular/core';
import { TableConnectionData } from '../models/player.model';
import * as signalR from '@microsoft/signalr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TableServiceService {

  public ConnectionData:TableConnectionData={jwt:"",username:"",TableId:"",TablePath:""};
  private hubConnection:signalR.HubConnection;

  constructor(private router:Router) {
    const hubUrl = "https://localhost:7267";
    this.hubConnection=new signalR.HubConnectionBuilder().withUrl(hubUrl).build();
  }

  public startConnection():void{
    let JWT=localStorage.getItem('jwt');
    let USERNAME=localStorage.getItem('username');
    let TablePath=localStorage.getItem("TablePath");
    let TableId=localStorage.getItem("TableId");
    if(JWT&&USERNAME&&TablePath&&TableId)this.ConnectionData={jwt:JWT.toString(),username:USERNAME.toString(),TableId:TableId.toString(),TablePath:TablePath.toString()};
    else{localStorage.clear();this.router.navigate(['login']);}
    const hubUrl = 'https://localhost:7267'+this.ConnectionData.TablePath+`?param1=${encodeURIComponent(this.ConnectionData.jwt)}&param2=${encodeURIComponent(this.ConnectionData.username)}&param3=${encodeURIComponent(this.ConnectionData.TableId)}`;
                                                                            
    this.hubConnection=new signalR.HubConnectionBuilder().withUrl(hubUrl).withAutomaticReconnect().build();
    if(this.hubConnection!=undefined){
    this.hubConnection?.start()
    .then(() => {
      console.log('Table connection started.');

      this.DisconnectFromServer((report:string) =>{
      this.Disconnect();
        console.log(report);
        localStorage.clear();
        this.router.navigate(['login']);
      });
      this.JwtUpdate((jwt:string)=>{
        localStorage.setItem('jwt', jwt);
      });
    })
    .catch(err => console.log('Error while starting SignalR connection: ' + err));

    }
  }
  public TableListener(callback: (username:string,message: string) => void): void {
    this.hubConnection.on('ChatMessages', callback);
  }
  public ReportsListener(callback: (report:string) => void): void{
    this.hubConnection.on('ChatReports', callback);
  }
  public JwtUpdate(callback: (report:string) => void): void{
    this.hubConnection?.on('JwtUpdate', callback);
  }
  public DisconnectFromServer(callback: (report:string) => void): void{
    this.hubConnection?.on('Disconnect', callback);
  }
  public QuitTableListener(){
    this.hubConnection.off('ChatMessages');
    this.hubConnection.off('ChatReports');
  }
  public Disconnect(){
    this.hubConnection?.stop();
    console.log(localStorage.getItem('jwt'));
  }
}
