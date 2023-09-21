import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {ActivePlayer,EmailRec, jwt,Player, PlayerSignIn, PlayerSignUp,TableData } from '../models/player.model';


@Injectable({
  providedIn: 'root'
})
export class PlayersServicesService {
    baseApiUrl: string='https://casinogodsserver.azurewebsites.net';
  constructor(private http: HttpClient) { }

  getAllPlayers(): Observable<Player[]>{
    return this.http.get<Player[]>(this.baseApiUrl+'/api/Players');
  }
  addPlayer(addPlayerRequest:PlayerSignUp):Observable<PlayerSignUp>{
    return this.http.post<PlayerSignUp>(this.baseApiUrl+'/api/Players/Register',addPlayerRequest);
  }
  signInPlayer(signInRequest:PlayerSignIn):Observable<ActivePlayer>{
    return this.http.post<ActivePlayer>(this.baseApiUrl+'/api/Players/Login',signInRequest);
  }
  guest():Observable<ActivePlayer>{
    return this.http.post<ActivePlayer>(this.baseApiUrl+'/api/Players/Guest',"");

  }
  recoveryPlayer(recoveryRequest:EmailRec):Observable<string>{
    return this.http.put<string>(this.baseApiUrl+'/api/Players/Recovery',recoveryRequest);
  }
  checkJWT(jwt:jwt):Observable<string>{
    return this.http.put(this.baseApiUrl+'/api/Players/RefreshToken',jwt,{responseType:"text"});
  }
  logout(jwt:jwt):Observable<any>{
    return this.http.put(this.baseApiUrl+'/api/Players/Logout',jwt);
  }
  playerMenu(jwt:jwt): Observable<TableData> {
    return this.http.post<TableData>(this.baseApiUrl +'/api/Players/GetGamesList',jwt);
  }
}
