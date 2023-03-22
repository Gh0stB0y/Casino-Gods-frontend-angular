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

@NgModule({
  declarations: [
    AppComponent,
    PlayersListComponent,
    AddPlayerComponent,
    LoginMenuComponent,
    SignInPlayerComponent,
    RecoveryComponent,
    PlayerMenuComponent,
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
  constructor(private cookie:CookieService){}


    public cookieSet(){
      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + 5);
      this.cookie.set("JEBAC","DISA",{ expires: dateNow, path: '/' });
    }
}
