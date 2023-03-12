import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPlayerComponent } from './components/add-player/add-player.component';
import { LoginMenuComponent } from './components/login-menu/login-menu/login-menu.component';
import { PlayersListComponent } from './components/players/players-list/players-list.component';
import { RecoveryComponent } from './components/recovery/recovery.component';
import { SignInPlayerComponent } from './components/sign-in-player/sign-in-player/sign-in-player.component';


const routes: Routes = [
  {path:'',redirectTo: 'login',pathMatch:'full'},
  {path:'players',component:PlayersListComponent},
  {path:'players/add',component:AddPlayerComponent},
  {path:'login',component:LoginMenuComponent},
  {path:'signin',component:SignInPlayerComponent},
  {path:'recovery',component:RecoveryComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
