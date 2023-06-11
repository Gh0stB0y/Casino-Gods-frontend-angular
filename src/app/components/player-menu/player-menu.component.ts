import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { jwt, Player } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { AppModule } from 'src/app/app.module';
@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss']
})
export class PlayerMenuComponent implements OnInit {

  unameToDisplay:any=localStorage.getItem("username");
  bankrollToDisplay:any=localStorage.getItem("bankroll");
  profitToDipslay:any=localStorage.getItem("profit");
  test:boolean=true;
  jwtObj:jwt={
    jwtString:""
  };
  jwtStorage:any="";
  constructor(private playersService: PlayersServicesService,private router:Router,private appmodule:AppModule) {
    /* funkcja sprawdzajaca czy ktos jest zalogowany na tym urzadzeniu. Jesli tak to zimportuj dane  */
  }
  async ngOnInit(): Promise<void> {
    await this.appmodule.checkJWT(true);
  }
  logOut(){
    /* FUNKCJA: wroc do login-menu, zwolnij miejsce na tym komputerze, i na biezacym koncie */
    this.jwtStorage=localStorage.getItem("jwt");
    if(this.jwtStorage!=null){
    this.jwtObj.jwtString=this.jwtStorage;
    this.playersService.logout(this.jwtObj).subscribe({next: ()=>{console.log("logout")},error:(message)=>{console.log(message);}});
    localStorage.clear();
    this.router.navigate(['login']);
    }
    //
  }
  statistics(){}
  play(){this.router.navigate(['playGame']);}


  
}
