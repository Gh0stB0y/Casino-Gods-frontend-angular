import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { AppModule } from 'src/app/app.module';
import { PlayerMenuComponent } from 'src/app/components/player-menu/player-menu.component';
import { ChatMessages } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-dragon',
  templateUrl: './dragon.component.html',
  styleUrls: ['./dragon.component.scss']
})
export class DragonComponent implements OnInit{



  ColorsArray:string[]=["#009A17","#E10600"]
  BetsTimingInfo:string[]=["Bets are open","No more bets"]
  CurrentBetInfo:string="Wait for the next round";
  BetsbackgroundColor:string=this.ColorsArray[1];

  CurrentCoin:number=0;
  IsClicked:boolean[]=[];
  TotalBet:number=0;

  Bets:number[]=[];
  PreviousBets:number[]=[];
  
  newMessage: string = "";
  messages:ChatMessages[]=[];
  TableMessages:ChatMessages[]=[];
  
  BetsEnabled:boolean=false;
  PastResults:string="";

  BetDescription:string[]=["Dragon","Tiger","Tie","Suited Tie"];

  cardImageEnabled:boolean[]=[false,false];
  chipImageEnabled:boolean[]=[false,false,false,false];
  cardImageDatabase:string[]=[];
  cardImageUrl:string[]=['',''];
  chipImageUrl:string='../../../../../assets/images/TotalBetChip.png';
  CurrentBet:string[]=["","","",""];

  constructor(private playerMenu:PlayerMenuComponent,private SignalRService:SignalRService,private router:Router,private http: HttpClient){
      this.messages=[];
      this.TotalBet=0;
      this.PastResults="";
      //for(let i=0;i<52;i++)this.cardImageDatabase.push("");
      for (let i=0;i<4;i++)this.Bets.push(0);
      for (let i=0;i<3;i++)this.PreviousBets.push(0);
      for (let i=0;i<7;i++)this.IsClicked.push(false);    
      this.http.get('assets/CardsURL.txt', { responseType: 'text' })
      .subscribe(data => {
        this.cardImageDatabase = data.split('\n').filter(item => item.trim() !== '');        
      });        
    }
  async ngOnInit():Promise<void>{
    this.SignalRService.BettingEnabledListener(
      (IsEnabled:boolean,closedBetsToken:string)=>{
        this.BetsEnabled=IsEnabled;
        if(IsEnabled)//de facto start nowej gierki, rozpoczynajac od fazy betowania
        {          
          for(let i=0;i<this.Bets.length;i++)this.Bets[i]=0;this.TotalBet=0;    
          this.CurrentBetInfo=this.BetsTimingInfo[0];    
          this.BetsbackgroundColor=this.ColorsArray[0];
          this.Undo();
          this.cardImageEnabled[0]=false;
          this.cardImageEnabled[1]=false;
        }
        else //de facto zakonczenie fazy betowania
        {          
          this.CurrentBetInfo=this.BetsTimingInfo[1];
          this.BetsbackgroundColor=  this.ColorsArray[1];
          let JWT=localStorage.getItem("jwt");
          if(JWT)this.SignalRService.SendBets(this.Bets,JWT,closedBetsToken);
        }
    });
    this.SignalRService.DragonTigerCards(
      (Cards:number[],report:string)=>{       
        this.cardImageUrl=[this.cardImageDatabase[Cards[0]],this.cardImageDatabase[Cards[1]]];        
        this.cardImageEnabled[0]=true;
        setTimeout(() => {
        this.cardImageEnabled[1]=true;
        this.playerMenu.TableMessages.push({ text: report,text2:"", textColor:'grey',text2Color:'white'});   
        this.playerMenu.scrollToBottom();
        if(Math.floor(Cards[0]/4)>Math.floor(Cards[1]/4)){if(this.PastResults==="")this.PastResults+="Dragon";else(this.PastResults+=", Dragon");}
        else if(Math.floor(Cards[0]/4)<Math.floor(Cards[1]/4)){if(this.PastResults==="")this.PastResults+="Tiger";else(this.PastResults+=", Tiger");}
        else{
          if(Cards[0]%4===Cards[1]%4){if(this.PastResults==="")this.PastResults+="SUITED TIE";else(this.PastResults+=", SUITED TIE");}
          else{if(this.PastResults==="")this.PastResults+="TIE";else(this.PastResults+=", TIE");}
        }

        },2500);
      });
    this.SignalRService.WinListener(
      (WinReport:string,WinValue:number)=>{
        this.playerMenu.TableMessages.push({ text: WinReport,text2:"", textColor:'grey',text2Color:'white'});   
        this.playerMenu.scrollToBottom();
    });
  }
  Return() {    
    this.playerMenu.TableGoback();
    //this.LeaveTableWarning();    
  }
  SendBets(){
    if(this.BetsEnabled){
    let JWT=localStorage.getItem("jwt");
    if(JWT){
      this.SignalRService.SendBets(this.Bets,JWT,"");
      localStorage.setItem('PreviousBets', JSON.stringify(this.Bets));
      //for(let i=0;i<this.Bets.length;i++)this.PreviousBets[i]=this.Bets[i];
    }
    this.BetsEnabled=false;
    }
  }
  SwitchCoin(coinVal:number,CoinIndex:number){
    if(coinVal!=this.CurrentCoin){
    this.CurrentCoin=coinVal;
    this.IsClicked.fill(false);
    this.IsClicked[CoinIndex]=true;
    console.log("coin value: "+this.CurrentCoin);
    }
  }
  Repeat(){
    if(this.BetsEnabled){
      const PreviousBetsArray=localStorage.getItem('PreviousBets');
      let cash=localStorage.getItem("bankroll");
      if(cash&&PreviousBetsArray){
        this.PreviousBets = JSON.parse(PreviousBetsArray);
        let sum = this.PreviousBets.reduce((acc, currentValue) => acc + currentValue, 0);
        if(sum<=parseInt(cash,10)){
          this.Bets=this.PreviousBets;
          this.TotalBet=sum;
          for (let i=0;i<this.Bets.length;i++){
            if(this.Bets[i]>0){
              this.chipImageEnabled[i]=true; 
              this.CurrentBet[i]=this.Bets[i].toString();
            }
            else this.chipImageEnabled[i]=false;            
          }
        }
        else this.BrokeError();       
      }
      
    }
  }
  Double(){
    if(this.BetsEnabled){
      const PreviousBetsArray=localStorage.getItem('PreviousBets');
      let cash=localStorage.getItem("bankroll");
      if(cash&&PreviousBetsArray){
        this.PreviousBets = JSON.parse(PreviousBetsArray);
        let sum = this.PreviousBets.reduce((acc, currentValue) => acc + currentValue, 0);
        if(2*sum<=parseInt(cash,10)){
          let minBet=localStorage.getItem("TableMinBet");
          let maxBet=localStorage.getItem("TableMaxBet");


          for(let i=0;i<this.Bets.length;i++){
            if(maxBet&&minBet){
              if(2*this.PreviousBets[i]<=parseInt(maxBet,10))this.Bets[i]=2*this.PreviousBets[i];
              else {this.tooMuch(); return;}
            }
          }          
          this.TotalBet=2*sum;
          
          for (let i=0;i<this.Bets.length;i++){
            if(this.Bets[i]>0){
              this.chipImageEnabled[i]=true; 
              this.CurrentBet[i]=this.Bets[i].toString();
            }
            else this.chipImageEnabled[i]=false;            
          }
        }
        else this.BrokeError();       
      }
      
    }
  }
  Undo(){
    if(this.BetsEnabled){
      for(let i=0;i<this.Bets.length;i++)this.Bets[i]=0;this.TotalBet=0;
      this.CurrentBet=["","","",""];
      for(let i=0;i<this.chipImageEnabled.length;i++)this.chipImageEnabled[i]=false;
    }
  }
  BrokeError(){
    if(this.playerMenu.LobbyChatEnabled){
      this.playerMenu.messages.push({ text:"ERROR: ",text2:"Not enough money", textColor:'red',text2Color:'red'});
      this.playerMenu.scrollToBottom();
    }
    else{
      this.playerMenu.TableMessages.push({ text:"ERROR: ",text2:"Not enough money", textColor:'red',text2Color:'red'});   
      this.playerMenu.scrollToBottom();
    }
  }
  AddBet(Index:number){
    if(this.CurrentCoin>0&&this.BetsEnabled){
      let cash=localStorage.getItem("bankroll");
      let minBet=localStorage.getItem("TableMinBet");
      let maxBet=localStorage.getItem("TableMaxBet");
      if(minBet&&maxBet&&(this.Bets[Index]+this.CurrentCoin)>=parseFloat(minBet)&&(this.Bets[Index]+this.CurrentCoin)<=parseFloat(maxBet)){
        if(cash&&parseFloat(cash)>=(this.CurrentCoin+this.TotalBet))
        {
          //this.UpdateBetsInfoAdd(Index,this.Bets[Index]);
          this.TotalBet+=this.CurrentCoin;
          this.Bets[Index]+=this.CurrentCoin;
          console.log("Bets["+Index+"]: "+this.Bets[Index]);
          this.CurrentBet[Index]=this.Bets[Index].toString();
          if(!this.chipImageEnabled[Index])this.chipImageEnabled[Index]=true;
        }
        else{this.BrokeError();}
      }
      else if(minBet&&maxBet&&(this.Bets[Index]+this.CurrentCoin)>parseFloat(maxBet)){this.tooMuch()}
      else  this.tooLittle(Index);
    }
  }
  SubstractBet(Index:number,event:MouseEvent){
    event.preventDefault();
    let minBet=localStorage.getItem("TableMinBet");
    if(this.CurrentCoin>0&&minBet&&this.Bets[Index]>0&&this.BetsEnabled){
        if(this.Bets[Index]-this.CurrentCoin>=parseFloat(minBet)){
          //this.UpdateBetsInfoSubstract(Index,this.Bets[Index]);
          this.TotalBet-=this.CurrentCoin;
          this.Bets[Index]-=this.CurrentCoin;
          this.CurrentBet[Index]=this.Bets[Index].toString();
        }
        else if(this.Bets[Index]-this.CurrentCoin<parseFloat(minBet)&&this.Bets[Index]-this.CurrentCoin>0){
          this.tooLittle(Index);
        }
        else{
          //this.UpdateBetsInfoSubstract(Index,this.Bets[Index]);
          this.TotalBet-=this.Bets[Index];
          this.Bets[Index]=0;
          this.CurrentBet[Index]="";
          this.chipImageEnabled[Index]=false;
        }
    }
  }
  tooMuch() {
    if(this.playerMenu.LobbyChatEnabled){
      this.playerMenu.messages.push({ text:"ERROR: ",text2:"Too big bet", textColor:'red',text2Color:'red'});
      this.playerMenu.scrollToBottom();
    }
    else{
      this.playerMenu.TableMessages.push({ text:"ERROR: ",text2:"Too big bet", textColor:'red',text2Color:'red'});   
      this.playerMenu.scrollToBottom();
    }
  }
  tooLittle(Index:number) {
    if(this.playerMenu.LobbyChatEnabled){
      this.playerMenu.messages.push({ text:"",text2:this.BetDescription[Index]+": Too small bet", textColor:'red',text2Color:'red'});
      this.playerMenu.scrollToBottom();
    }
    else{
      this.playerMenu.TableMessages.push({ text:"",text2:this.BetDescription[Index]+": Too small bet", textColor:'red',text2Color:'red'});   
      this.playerMenu.scrollToBottom();
    }
  }
}
