import { Component, OnInit} from '@angular/core';
import { Route, Router } from '@angular/router';
import { Player } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit{
  ngOnInit(): void {}
  recoveryRequest: string='';
  currentError:string="";
  constructor(private playerService: PlayersServicesService, private router:Router){}
  recoveryPlayer: Player={
    id: '0',
    username: '',
    email: '',
    password: '',
    bankroll: 0,
    profit:0,
    birthdate:'1970-01-01T22:12:41.685Z'
    };
  recovery(){

    this.playerService.recoveryPlayer(this.recoveryRequest)
    .subscribe({//jak wszystko bedzie ok
      next: (message)=>{
       console.log(message);
       this.router.navigate(['']);
      },
      error:(message)=>{
        if(message.status===400)this.currentError=message.error;
        else if(message.status===0)this.currentError="Invalid connection, try again later";
        else console.log(message);
        console.log(message);
      }
    })
  }
}
