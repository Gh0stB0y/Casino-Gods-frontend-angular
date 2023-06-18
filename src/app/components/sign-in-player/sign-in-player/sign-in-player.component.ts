import { Component, OnInit} from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';
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
    test:boolean=true;
constructor(private playerService: PlayersServicesService, private router:Router,private appmodule:AppModule) {}
async ngOnInit(): Promise<void> {
  /* this.test=this.appmodule.checkJWT();*/ 
   await this.appmodule.checkJWT(false);
}
forgot(){location.href="recovery"}

signIn(){    
  this.playerService.signInPlayer(this.signInRequest)
    .subscribe({//jak wszystko bedzie ok
      next: (sign_player)=>{       
        
        localStorage.setItem('username', sign_player.username);
        localStorage.setItem('bankroll', JSON.stringify(sign_player.bankroll));
        localStorage.setItem('profit',JSON.stringify(sign_player.profit));
        localStorage.setItem('jwt', sign_player.jwt);
        localStorage.setItem('isLoggedIn',"true");
        this.router.navigate(['playerMenu']);
      },
      error:(message)=>{//jesli bedzie jakis blad      
        if(message.status===0)this.currentError="Invalid connection, try again later";
        else this.currentError=message.error;
        console.log(message);
        /* console.log(message); */
      }
    })
  }
}
