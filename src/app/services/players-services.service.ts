import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player, PlayerSignIn, PlayerSignUp } from '../models/player.model';


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
  signInPlayer(signInRequest:PlayerSignIn):Observable<string>{
    return this.http.put(this.baseApiUrl+'/api/players/login',signInRequest,{responseType:"text"});
    /* DOPISAC FUNKCJE SPRAWDZAJACA CZY KTOS JEST ZALOGOWANY NA TYM KONCIE NA INNYM URZADZENIU I CZY KTOS JEST ZALOGOWANY Z TEGO URZADZENIA */ 
  }
  recoveryPlayer(recoveryRequest:string):Observable<string>{
    return this.http.post<string>(this.baseApiUrl+'/api/players/recovery',recoveryRequest);
  }
}
