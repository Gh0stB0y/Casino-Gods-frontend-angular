import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPlayerComponent } from './components/add-player/add-player.component';
import { PlayersListComponent } from './components/players/players-list/players-list.component';


const routes: Routes = [
  {
  path:'players',
  component:PlayersListComponent
},
{
  path:'players/add',
  component:AddPlayerComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
