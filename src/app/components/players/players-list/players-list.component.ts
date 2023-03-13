import { Component, Inject } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { OnInit } from '@angular/core';
import { PlayersServicesService } from 'src/app/services/players-services.service';
@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {
players: Player[]=[];

constructor(private playersService: PlayersServicesService) {}

ngOnInit(): void{
  this.playersService.getAllPlayers()
  .subscribe({
    next:(get_players)=>{
      console.log(get_players);
      this.players=get_players;

    },
    error:(get_response)=>{
      console.log(get_response);
    },
  })

}
}
