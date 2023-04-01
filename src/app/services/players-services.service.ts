import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {ActivePlayer,EmailRec, jwt,Player, PlayerSignIn, PlayerSignUp } from '../models/player.model';


@Injectable({
  providedIn: 'root'
})
export class PlayersServicesService {

  baseApiUrl: string='https://localhost:7267';
  constructor(private http: HttpClient) { }

  getAllPlayers(): Observable<Player[]>{
    return this.http.get<Player[]>(this.baseApiUrl+'/api/Players');
  }
  addPlayer(addPlayerRequest:PlayerSignUp):Observable<PlayerSignUp>{
    return this.http.post<PlayerSignUp>(this.baseApiUrl+'/api/Players',addPlayerRequest);
  }
  signInPlayer(signInRequest:PlayerSignIn):Observable<ActivePlayer>{
    return this.http.post<ActivePlayer>(this.baseApiUrl+'/api/Players/login',signInRequest);
    /* DOPISAC FUNKCJE SPRAWDZAJACA CZY KTOS JEST ZALOGOWANY NA TYM KONCIE NA INNYM URZADZENIU I CZY KTOS JEST ZALOGOWANY Z TEGO URZADZENIA */ 
  }
  guest():Observable<ActivePlayer>{
    return this.http.post<ActivePlayer>(this.baseApiUrl+'/api/Players/guest',"");
    /* DOPISAC FUNKCJE SPRAWDZAJACA CZY KTOS JEST ZALOGOWANY NA TYM KONCIE NA INNYM URZADZENIU I CZY KTOS JEST ZALOGOWANY Z TEGO URZADZENIA */ 
  }
  recoveryPlayer(recoveryRequest:EmailRec):Observable<string>{
    return this.http.put<string>(this.baseApiUrl+'/api/Players/recovery',recoveryRequest);
  }
  checkJWT(jwt:jwt):Observable<string>{
    return this.http.put(this.baseApiUrl+'/api/Players/refreshToken',jwt,{responseType:"text"});
  }
  logout(jwt:jwt):Observable<any>{
    return this.http.put(this.baseApiUrl+'/api/Players/logout',jwt);
  }

  test(signInRequest:jwt):Observable<string>{
    
    return this.http.post<string>(this.baseApiUrl+'/api/Players/test',signInRequest);
    /* DOPISAC FUNKCJE SPRAWDZAJACA CZY KTOS JEST ZALOGOWANY NA TYM KONCIE NA INNYM URZADZENIU I CZY KTOS JEST ZALOGOWANY Z TEGO URZADZENIA */ 
  }
}
