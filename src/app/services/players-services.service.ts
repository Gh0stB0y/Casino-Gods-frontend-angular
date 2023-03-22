import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player, PlayerSignUp } from '../models/player.model';


@Injectable({
  providedIn: 'root'
})
export class PlayersServicesService {

  baseApiUrl: string='https://localhost:7267';
  constructor(private http: HttpClient) { }

  getAllPlayers(): Observable<Player[]>{
    return this.http.get<Player[]>(this.baseApiUrl+'/api/players');
  }
  addPlayer(addPlayerRequest:PlayerSignUp):Observable<PlayerSignUp>{
    return this.http.post<PlayerSignUp>(this.baseApiUrl+'/api/players',addPlayerRequest);
  }
  signInPlayer(signInRequest:Player):Observable<Player>{
    signInRequest.id='00000000-0000-0000-0000-000000000000';
    return this.http.post<Player>(this.baseApiUrl+'/api/players/login',signInRequest);
    /* DOPISAC FUNKCJE SPRAWDZAJACA CZY KTOS JEST ZALOGOWANY NA TYM KONCIE NA INNYM URZADZENIU I CZY KTOS JEST ZALOGOWANY Z TEGO URZADZENIA */ 
  }
  recoveryPlayer(recoveryRequest:string,recoveryPlayer:Player):Observable<Player>{
    recoveryPlayer.email=recoveryRequest;
    recoveryPlayer.id='00000000-0000-0000-0000-000000000000';
    return this.http.post<Player>(this.baseApiUrl+'/api/players/recovery',recoveryPlayer);
  }
}
