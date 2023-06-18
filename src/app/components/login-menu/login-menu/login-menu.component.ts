import { Component,OnInit } from '@angular/core';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { Route, Router } from '@angular/router';
import { AppModule } from 'src/app/app.module';
@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.scss']
})
export class LoginMenuComponent implements OnInit {
  test:boolean=true;
  constructor(private playerService: PlayersServicesService, private router:Router,private appmodule:AppModule){}
  async ngOnInit(): Promise<void> {
    await this.appmodule.checkJWT(false);
  }
  signUp(){
    location.href='players/add'
  }

  signIn(){
    location.href='signin'
  }  

  guest(){
    this.playerService.guest()
    .subscribe({
      next: (sign_player)=>{       
        
        localStorage.setItem('username', sign_player.username);
        localStorage.setItem('bankroll', JSON.stringify(sign_player.bankroll));
        localStorage.setItem('profit',JSON.stringify(sign_player.profit));
        localStorage.setItem('jwt', sign_player.jwt);
        localStorage.setItem('isLoggedIn',"true");
        this.router.navigate(['playerMenu']);
      },
      error:(message)=>{//jesli bedzie jakis blad      
        /* if(message.status===0)this.currentError="Invalid connection, try again later";
        else this.currentError=message.error;
        console.log(message); */
        /* console.log(message); */
      }

    })
  }
}
