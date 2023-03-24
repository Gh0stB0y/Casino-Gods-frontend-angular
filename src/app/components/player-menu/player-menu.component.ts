import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Player } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss']
})
export class PlayerMenuComponent implements OnInit {

  unameToDisplay:string="";
  bankrollToDisplay:number=0;
  constructor(private playersService: PlayersServicesService) {
    /* funkcja sprawdzajaca czy ktos jest zalogowany na tym urzadzeniu. Jesli tak to zimportuj dane  */
  }
  ngOnInit(): void {
  }
  logOut(){
    /* FUNKCJA: wroc do login-menu, zwolnij miejsce na tym komputerze, i na biezacym koncie */
    console.log(localStorage.getItem('jwt'));
  }
  statistics(){

  }



  
}
