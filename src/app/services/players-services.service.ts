import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';


@Injectable({
  providedIn: 'root'
})
export class PlayersServicesService {

  baseApiUrl: string='https://localhost:7267';
  constructor(private http: HttpClient) { }

  getAllPlayers(): Observable<Player[]>{
    return this.http.get<Player[]>(this.baseApiUrl+'/api/players');
  }
  addPlayer(addPlayerRequest:Player):Observable<Player>{
    addPlayerRequest.id='00000000-0000-0000-0000-000000000000';
    return this.http.post<Player>(this.baseApiUrl+'/api/players',addPlayerRequest);
  }
}
