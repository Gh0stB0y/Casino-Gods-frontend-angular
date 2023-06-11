import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayersListComponent } from './components/players/players-list/players-list.component';
import { AddPlayerComponent } from './components/add-player/add-player.component';
import { FormsModule } from '@angular/forms';
import { LoginMenuComponent } from './components/login-menu/login-menu/login-menu.component';
import { SignInPlayerComponent } from './components/sign-in-player/sign-in-player/sign-in-player.component';
import { RecoveryComponent } from './components/recovery/recovery.component';
import { PlayerMenuComponent } from './components/player-menu/player-menu.component';
import {CookieService} from 'ngx-cookie-service'
import {jwt} from 'src/app/models/player.model'
import { Route, Router } from '@angular/router';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { take } from 'rxjs/operators';
import { isObservable, Observable } from 'rxjs';
import { PlayGameComponent } from './components/play-game/play-game/play-game.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayersListComponent,
    AddPlayerComponent,
    LoginMenuComponent,
    SignInPlayerComponent,
    RecoveryComponent,
    PlayerMenuComponent,
    PlayGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
  jwt_test:any="";
  jwtObj:jwt={
    jwtString:""
  };
  currentError:string="";
  jwtOk: boolean = true;
  jwtBuffer:string="";
  constructor(private playersService: PlayersServicesService,private cookie:CookieService,private router:Router){}

    async checkJWT(normalcheck:boolean):Promise<void>{    
      this.jwt_test=localStorage.getItem("jwt");
    if(this.jwt_test==null){
      localStorage.clear();
      if(normalcheck===true){this.router.navigate(['login']);}
      else{}
    }
    else{
      console.log("JWT jest sczytane");
      this.jwtObj.jwtString=this.jwt_test;
      
      try {
        const response = await new Promise<void>((resolve, reject) => {
          this.playersService.checkJWT(this.jwtObj).subscribe({
            next: (sign_player) => {
              localStorage.setItem('jwt', sign_player);          
              if(normalcheck===true){}
              else{this.router.navigate(['playerMenu']);}
              resolve(); // Resolve the Promise with the received data
            },
            error: (message) => {
              console.log(message);
              this.currentError=message.error;
              console.log(message);
              localStorage.clear();
              if(this.currentError== "JWT expired,log in again") console.log("user timed out,log in again");
        
              if(normalcheck===true){this.router.navigate(['login']);}
              else{}
              reject(message); // Reject the Promise with the error
            }
          });
        });     
      }
      catch(error){
      console.log(error);
      localStorage.clear();
      this.router.navigate(['login']);
      }
    }
  }
}
