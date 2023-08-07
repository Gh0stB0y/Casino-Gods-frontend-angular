import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AppModule } from 'src/app/app.module';
import { ChatMessages } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { TableServiceService } from 'src/app/services/table-service.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import { PlayerMenuComponent } from 'src/app/components/player-menu/player-menu.component';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs';
@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.scss']
})
export class RouletteComponent implements OnInit,OnDestroy{
  unameToDisplay:any=localStorage.getItem("username");
  bankrollToDisplay:any=localStorage.getItem("bankroll");
  profitToDipslay:any=localStorage.getItem("profit");

  currentError:string="";
  jwtStorage:any="";
  messages:ChatMessages[]=[];
  TableMessages:ChatMessages[]=[];
  newMessage: string = "";
  newAuthor:string="";
  BetImagePath:string='../../../../../assets/images/TotalBetChip.png';

  loopRange: number[] = Array(11).fill(0).map((_, index) => index)
  BetsEnabled:boolean=false;
  PreviousBets:number[]=[];
  Bets:number[]=[];
  CurrentBetsInfo:string="";
  BetDescription:string[]=[];
  CurrentCoin:number=0;
  IsClicked:boolean[]=[];
  TotalBet:number=0;
  space:string='      ';
  ColorsArray:string[]=["#009A17","#DBA800","#E10600"]
  BetsTimingInfo:string[]=["Bets are open","Bets are closing","No more bets"]
  CurrentBetInfo:string="Wait for the next round";
  BetsbackgroundColor:string=this.ColorsArray[2];
  ShowAnimation:boolean=false;
  @ViewChild('chatMessages',{static:false})chatMessagesRef!: ElementRef;
  
  constructor(private playersService: PlayersServicesService,private router:Router,private appmodule:AppModule,private SignalRService:SignalRService,
    private appComponent:AppComponent,private playerMenu:PlayerMenuComponent,private http: HttpClient){
      this.messages=[];
      this.TotalBet=0;
      for (let i=0;i<157;i++)this.Bets.push(0);
      for (let i=0;i<7;i++)this.IsClicked.push(false);
      this.PreviousBets=this.Bets;
      this.CurrentBetsInfo="";
      this.http.get('assets/BetsDescription.txt', { responseType: 'text' })
      .subscribe(data => {
        this.BetDescription = data.split('\n').filter(item => item.trim() !== '');
      });
    }
  async ngOnInit():Promise<void>
  {
    this.SignalRService.BettingEnabledListener(
      (IsEnabled:boolean,closedBetsToken:string)=>{
        this.BetsEnabled=IsEnabled;
        if(IsEnabled)//de facto start nowej gierki, rozpoczynajac od fazy betowania
        {
          for(let i=0;i<this.Bets.length;i++)this.Bets[i]=0;this.TotalBet=0; this.CurrentBetsInfo="";   
          this.CurrentBetInfo=this.BetsTimingInfo[0];    
          this.BetsbackgroundColor=  this.ColorsArray[0];
          this.ShowAnimation=false;
        }
        else //de facto zakonczenie fazy betowania
        {
          this.PreviousBets=this.Bets;
          this.CurrentBetInfo=this.BetsTimingInfo[2];
          this.BetsbackgroundColor=  this.ColorsArray[2];
          let JWT=localStorage.getItem("jwt");
          if(JWT)this.SignalRService.SendBets(this.Bets,JWT,closedBetsToken);
          this.ShowAnimation=true;
        }
    });
    this.SignalRService.BetsAreClosingListener(
      ()=>{
        if(this.CurrentBetInfo!="Wait for the next round"){
        this.CurrentBetInfo=this.BetsTimingInfo[1];
        this.BetsbackgroundColor=  this.ColorsArray[1];
        }
    });
    this.SignalRService.WinListener(
      (WinReport:string,WinValue:number)=>{
        this.playerMenu.TableMessages.push({ text: WinReport,text2:"", textColor:'grey',text2Color:'white'});   
        this.playerMenu.scrollToBottom();
    });
  }
  ngOnDestroy(): void {
  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      let Author = localStorage.getItem("username");
      //if(Author)this.SignalRService.SendChatMessage(Author.toString(),this.newMessage);
    }
  }
  Return(){
    
    this.playerMenu.TableGoback();
    
    //this.LeaveTableWarning();
  }
  AddBet(Index:number){
    if(this.CurrentCoin>0&&this.BetsEnabled){
      let cash=localStorage.getItem("bankroll");
      let minBet=localStorage.getItem("TableMinBet");
      let maxBet=localStorage.getItem("TableMaxBet");
      if(minBet&&maxBet&&(this.Bets[Index]+this.CurrentCoin)>=parseFloat(minBet)&&(this.Bets[Index]+this.CurrentCoin)<=parseFloat(maxBet)){
        if(cash&&parseFloat(cash)>=(this.CurrentCoin+this.TotalBet))
        {
          this.UpdateBetsInfoAdd(Index,this.Bets[Index]);
          this.TotalBet+=this.CurrentCoin;
          this.Bets[Index]+=this.CurrentCoin;
          console.log("Bets["+Index+"]: "+this.Bets[Index]);
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
          this.UpdateBetsInfoSubstract(Index,this.Bets[Index]);
          this.TotalBet-=this.CurrentCoin;
          this.Bets[Index]-=this.CurrentCoin;
        }
        else if(this.Bets[Index]-this.CurrentCoin<parseFloat(minBet)&&this.Bets[Index]-this.CurrentCoin>0){
          this.tooLittle(Index);
        }
        else{
          this.UpdateBetsInfoSubstract(Index,this.Bets[Index]);
          this.TotalBet-=this.Bets[Index];
          this.Bets[Index]=0;
        }
    }
  }
  SubstractBetSpecial(Index:number){
    let minBet=localStorage.getItem("TableMinBet");
    if(this.CurrentCoin>0&&minBet&&this.Bets[Index]>0&&this.BetsEnabled){
        if(this.Bets[Index]-this.CurrentCoin>=parseFloat(minBet)){
          this.UpdateBetsInfoSubstract(Index,this.Bets[Index]);
          this.TotalBet-=this.CurrentCoin;
          this.Bets[Index]-=this.CurrentCoin;
        }
        else if(this.Bets[Index]-this.CurrentCoin<parseFloat(minBet)&&this.Bets[Index]-this.CurrentCoin>0){
          this.tooLittle(Index);
        }
        else{
          this.UpdateBetsInfoSubstract(Index,this.Bets[Index]);
          this.TotalBet-=this.Bets[Index];
          this.Bets[Index]=0;
        }
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
  VoisinsDuZero(){
    if(this.BetsEnabled){
      let cash=localStorage.getItem("bankroll");
      if(cash&&parseFloat(cash)>=9*this.CurrentCoin+this.TotalBet){

        let arr:number[]=[63,41,43,68,60,121,121,142,142];
        for(let i=0;i<arr.length;i++){
          this.UpdateBetsInfoAdd(arr[i],this.Bets[arr[i]]);
          this.Bets[arr[i]]+=this.CurrentCoin;
        }
        this.TotalBet+=9*this.CurrentCoin;
      }
      else{
        this.BrokeError();
      }
    }
  }
  SubstractVoisinsDuZero(event:MouseEvent){
    event.preventDefault();
      if(this.BetsEnabled){
      let arr:number[]=[63,41,43,68,60,121,121,142,142];
      for (let i=0;i<arr.length;i++){
        this.SubstractBetSpecial(arr[i]);
      }
    } 
  }
  OrphellinsDuPlein(){
    if(this.BetsEnabled){
      let cash=localStorage.getItem("bankroll");
      if(cash&&parseFloat(cash)>=8*this.CurrentCoin+this.TotalBet){
        let arr:number[]=[1,6,9,14,17,20,31,34];
        for(let i=0;i<arr.length;i++){
          this.UpdateBetsInfoAdd(arr[i],this.Bets[arr[i]]);
          this.Bets[arr[i]]+=this.CurrentCoin;
        }
        this.TotalBet+=8*this.CurrentCoin;
      }
    
      else{
        this.BrokeError();
      }
    }
  }
  SubstractOrphellinsDuPlein(event:MouseEvent){
    event.preventDefault();
    if(this.BetsEnabled){
      let arr:number[]=[1,6,9,14,17,20,31,34];
      for(let i=0;i<arr.length;i++){
        this.SubstractBetSpecial(arr[i]);
      }
    }
  }
  TiersDuCylindre(){
    if(this.BetsEnabled){
      let cash=localStorage.getItem("bankroll");
      if(cash&&parseFloat(cash)>=6*this.CurrentCoin+this.TotalBet){
        let arr:number[]=[51,100,66,92,46,48];
        for(let i=0;i<arr.length;i++){
          this.UpdateBetsInfoAdd(arr[i],this.Bets[arr[i]]);
          this.Bets[arr[i]]+=this.CurrentCoin;
        }
        this.TotalBet+=6*this.CurrentCoin;
      }
      else{
        this.BrokeError();
      }
    }
  }
  SubstractTiersDuCylindre(event:MouseEvent){
    event.preventDefault();
    if(this.BetsEnabled){
      let arr:number[]=[51,100,66,92,46,48];
      for(let i=0;i<arr.length;i++){
        this.SubstractBetSpecial(arr[i]);
      }
    }
  }
  SendBets(){
    if(this.BetsEnabled){
    this.PreviousBets=this.Bets;
    let JWT=localStorage.getItem("jwt");
    if(JWT)this.SignalRService.SendBets(this.Bets,JWT,"");
    this.BetsEnabled=false;
    }
  }
  Repeat(){
    if(this.BetsEnabled){
      let cash=localStorage.getItem("bankroll");
      let sum = this.PreviousBets.reduce((acc, curr) => acc + curr, 0);
      if(cash&&sum<=parseFloat(cash)){
        this.Bets=this.PreviousBets;
        this.TotalBet=sum;
      }
      else{
        this.BrokeError();
      }
    }
  }
  Double(){
    if(this.BetsEnabled){
      let cash=localStorage.getItem("bankroll");
      let sum = this.PreviousBets.reduce((acc, curr) => acc + curr, 0);
      if(cash&&2*sum<=parseFloat(cash)){
        for(let i=0;i<this.Bets.length;i++)this.Bets[i]=2*this.PreviousBets[i];
        this.TotalBet=2*sum;
      }
      else{
        this.BrokeError();
      }
    }
  }
  Undo(){
    if(this.BetsEnabled){
      for(let i=0;i<this.Bets.length;i++)this.Bets[i]=0;this.TotalBet=0; this.CurrentBetsInfo="";
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
      this.playerMenu.messages.push({ text:"",text2:this.BetDescription[Index]+"Too small bet", textColor:'red',text2Color:'red'});
      this.playerMenu.scrollToBottom();
    }
    else{
      this.playerMenu.TableMessages.push({ text:"",text2:this.BetDescription[Index]+"Too small bet", textColor:'red',text2Color:'red'});   
      this.playerMenu.scrollToBottom();
    }
  }
  UpdateBetsInfoAdd(Index:number,Val:number){
    if(this.CurrentCoin>0){
    if(Val>0){
      console.log("Val: "+Val);
      let newString=this.CurrentBetsInfo.replace(this.BetDescription[Index]+Val,this.BetDescription[Index] + (Val + this.CurrentCoin));
      this.CurrentBetsInfo=newString;
    }
    else{
      let stringToAdd:string=this.BetDescription[Index] + (Val + this.CurrentCoin)+this.space;
      this.CurrentBetsInfo+=stringToAdd;
    }
    }
  }
  UpdateBetsInfoSubstract(Index:number,Val:number){
    if(this.CurrentCoin>0){
      console.log("Val: "+Val+" Coin: "+this.CurrentCoin);
      if(Val>0){
        if(Val>this.CurrentCoin){
          let newString=this.CurrentBetsInfo.replace(this.BetDescription[Index]+Val,this.BetDescription[Index] + (Val - this.CurrentCoin));
          this.CurrentBetsInfo=newString;
        }
        else {
          let newString=this.CurrentBetsInfo.replace(this.BetDescription[Index]+Val+this.space,"");
          this.CurrentBetsInfo=newString;
        }
      }
    }  
  }
  async IsBettingEnabled(){
    return await this.SignalRService.IsBettingEnabled();
  }
  LeaveTableWarning(){


  }
}
