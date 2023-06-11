import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { jwt, LobbyDataInput, Player,TableData } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { AppModule } from 'src/app/app.module';
@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss']
})
export class PlayerMenuComponent implements OnInit {

  mainMenu:boolean=true;
  Currentgame:string="";
  currentGameIndex:number=0;
  gamesList:string[]=[];
  lobbyData: LobbyDataInput={
    jwt:"",
    ChosenGame:""
    };

  unameToDisplay:any=localStorage.getItem("username");
  bankrollToDisplay:any=localStorage.getItem("bankroll");
  profitToDipslay:any=localStorage.getItem("profit");
  test:boolean=true;
  jwt_test:any="";
  jwtObj:jwt={
    jwtString:""
  };
  currentError:string="";
  jwtStorage:any="";
  constructor(private playersService: PlayersServicesService,private router:Router,private appmodule:AppModule,private SignalRService:SignalRService) {
    /* funkcja sprawdzajaca czy ktos jest zalogowany na tym urzadzeniu. Jesli tak to zimportuj dane  */
  }
  async ngOnInit(): Promise<void> {
    //await this.appmodule.checkJWT(true);
    this.jwt_test=localStorage.getItem("jwt");
      if(this.jwt_test==null){
        localStorage.clear();
        this.router.navigate(['login']);
      }
      else{
        this.jwtObj.jwtString=this.jwt_test;
        try {
          const response = await new Promise<void>((resolve, reject) => {
            this.playersService.playerMenu(this.jwtObj).subscribe({
              next: (dataResponse) => {
                localStorage.setItem('jwt', dataResponse.jwt);  
                this.gamesList=dataResponse.gameNames;
                this.Currentgame=this.gamesList[this.currentGameIndex];
                
                resolve(); // Resolve the Promise with the received data
              },
              error: (message) => {
                console.log(message);
                this.currentError=message.error;
                localStorage.clear();
                if(this.currentError== "JWT expired,log in again") console.log("user timed out,log in again");        
                this.router.navigate(['login']);
                reject(message); // Reject the Promise with the error
              }
            });
          });     
        }
        catch(error){
          console.log(error);
          localStorage.clear();
          this.router.navigate(['login']);
        }
      }

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
  play(){
    this.mainMenu=false;
    //this.router.navigate(['playGame']);
  }
  left(){
    if(this.currentGameIndex===0){
      this.currentGameIndex=this.gamesList.length-1;
      this.Currentgame=this.gamesList[this.currentGameIndex];
      
    }
    else {
      this.currentGameIndex--;
      this.Currentgame=this.gamesList[this.currentGameIndex];
    }
  }

  right(){
  if(this.currentGameIndex===this.gamesList.length-1){
    this.currentGameIndex=0;
    this.Currentgame=this.gamesList[this.currentGameIndex];
    
  }

  else {
    this.currentGameIndex++;
    this.Currentgame=this.gamesList[this.currentGameIndex];

  }
  }
  ChooseGame(){

    this.SignalRService.startConnection();

    // this.playersService.EnterLobby(this.lobbyData).subscribe(
    //   {next:()=>{
    //     this.router.navigate(['Lobby']);
    //   }      
    //   ,
    //   error:(message:any)=>{
    //     console.log(message);
    //     localStorage.clear();
    //     this.router.navigate(['login']);
    //   }
    //   }
    // )
  }
}
