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


@NgModule({
  declarations: [
    AppComponent,
    PlayersListComponent,
    AddPlayerComponent,
    LoginMenuComponent,
    SignInPlayerComponent,
    RecoveryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
