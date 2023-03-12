import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Player } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss']
})
export class AddPlayerComponent implements OnInit {
  addPlayerRequest: Player={
  id: '0',
  username: '',
  email: '',
  password: '',
  bankroll: 5000,
  profit:0

  };
  constructor(private playerService: PlayersServicesService, private router:Router) {}
  ngOnInit(): void {}

  addPlayer(){
    console.log(this.addPlayerRequest)
    this.playerService.addPlayer(this.addPlayerRequest)
    .subscribe({
      next: (add_player)=>{
        console.log(add_player);
        this.router.navigate(['']);
      }
    })
  }
}
