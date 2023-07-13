import { Injectable } from '@angular/core';
import { TableConnectionData } from '../models/player.model';
import * as signalR from '@microsoft/signalr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TableServiceService {

  public ConnectionData:TableConnectionData={jwt:"",username:"",TableId:""};

  constructor(private router:Router) {
  
  }

}
