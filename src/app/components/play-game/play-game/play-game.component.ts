import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { jwt, Player, TableData } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { AppModule } from 'src/app/app.module';
import { first } from 'rxjs';
@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss']
})
export class PlayGameComponent implements OnInit {
  unameToDisplay:any=localStorage.getItem("username");
  bankrollToDisplay:any=localStorage.getItem("bankroll");
  profitToDipslay:any=localStorage.getItem("profit");
    jwtObj:jwt={
    jwtString:""
  };
  jwtStorage:any="";

  HeaderText:string="Choose a game";
  tableAvailable:TableData[]=[];
  GameChooseProcess:boolean=true;
  currentGameIndex:number=0;
  currentTableIndex:number=0;
  CurrentMinBet:number=0;
  CurrentMaxBet:number=0;
  Currentgame:string="";
  CurrentTableList:string[]=[];
  CurrentMinBetsList:number[]=[];
  CurrentMaxBetsList:number[]=[];
  
  CurrentTable:string=""
  constructor(private playersService: PlayersServicesService,private router:Router,private appmodule:AppModule) {
  }
async ngOnInit(): Promise<void> {
  await this.appmodule.checkJWT(true);
  this.playersService.getTablesData().subscribe(
    {next: (data)=>{
      console.log(data);
      this.tableAvailable=data;
      this.Currentgame=this.tableAvailable[this.currentGameIndex].gameNames;
      this.CurrentTableList=this.tableAvailable[this.currentGameIndex].tableNames;
      this.CurrentTable=this.CurrentTableList[this.currentTableIndex];
      
      this.CurrentMinBetsList=this.tableAvailable[this.currentGameIndex].minBet;
      this.CurrentMaxBetsList=this.tableAvailable[this.currentGameIndex].maxBet;
     
    }
      ,error:(message)=>{
        console.log(message);
      }
    }
  );
}
left(){

  if(this.GameChooseProcess){
    if(this.currentGameIndex===0){
      this.currentGameIndex=this.tableAvailable.length-1;
      this.Currentgame=this.tableAvailable[this.currentGameIndex].gameNames;
      this.CurrentTableList=this.tableAvailable[this.currentGameIndex].tableNames;
    }
    else {
      this.currentGameIndex--;
      this.Currentgame=this.tableAvailable[this.currentGameIndex].gameNames;
      this.CurrentTableList=this.tableAvailable[this.currentGameIndex].tableNames;
    }
  }
  else{
    if(this.currentTableIndex===0){
      this.currentTableIndex=this.CurrentTableList.length-1;
      this.CurrentTable=this.CurrentTableList[this.currentTableIndex];
      
      
    }
    else {
      this.currentTableIndex--;
      this.CurrentTable=this.CurrentTableList[this.currentTableIndex];
      
      
    }
  }
}
right(){
  if(this.GameChooseProcess){
    if(this.currentGameIndex===this.tableAvailable.length-1){
      this.currentGameIndex=0;
      this.Currentgame=this.tableAvailable[this.currentGameIndex].gameNames;
      this.CurrentTableList=this.tableAvailable[this.currentGameIndex].tableNames;
    }
  
    else {
      this.currentGameIndex++;
      this.Currentgame=this.tableAvailable[this.currentGameIndex].gameNames;
      this.CurrentTableList=this.tableAvailable[this.currentGameIndex].tableNames;
    }
  }
  else{
    if(this.currentTableIndex===this.CurrentTableList.length-1){
      this.currentTableIndex=0;
      this.CurrentTable=this.CurrentTableList[this.currentTableIndex];
      
      
    }
  
    else {
      this.currentTableIndex++;
      this.CurrentTable=this.CurrentTableList[this.currentTableIndex];
      
      

    }
  }
}
ChooseTable(){
  
  
  this.CurrentTable=this.CurrentTableList[this.currentTableIndex];
  this.HeaderText=this.Currentgame;
  this.GameChooseProcess=!this.GameChooseProcess;
  
}
SelectTable(tableIndex:number){console.log("CHUJ");}
}