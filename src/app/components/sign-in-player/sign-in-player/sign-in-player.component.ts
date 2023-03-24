import { Component, OnInit} from '@angular/core';
import { Route, Router } from '@angular/router';
import { Player, PlayerSignIn } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
@Component({
  selector: 'app-sign-in-player',
  templateUrl: './sign-in-player.component.html',
  styleUrls: ['./sign-in-player.component.scss']
})
export class SignInPlayerComponent implements OnInit {
  currentError:string="";
  signInRequest: PlayerSignIn={
    username: "",
    password: "",
    };
constructor(private playerService: PlayersServicesService, private router:Router) {}
ngOnInit(): void {}
forgot(){location.href="recovery"}

  signIn(){    
    this.playerService.signInPlayer(this.signInRequest)
    .subscribe({//jak wszystko bedzie ok
      next: (sign_player)=>{    
        console.log(sign_player);    
        localStorage.setItem('jwt', sign_player);
        this.router.navigate(['playerPanel']);
      },
      error:(message)=>{//jesli bedzie jakis blad
        if(message.status===400)this.currentError=message.error;
        else if(message.status===0)this.currentError="Invalid connection, try again later";
        else console.log(message);
        /* console.log(message); */
      }
    })
  }
}
