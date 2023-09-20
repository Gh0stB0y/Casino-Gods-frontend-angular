import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AppModule } from 'src/app/app.module';
import { TableSeat, ChatMessages } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import { SignalRService } from 'src/app/services/signal-r.service';
import{TableServiceService} from 'src/app/services/table-service.service';
import { NgModule } from '@angular/core';
import { PlayerMenuComponent } from 'src/app/components/player-menu/player-menu.component';


@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.scss']
})
export class BlackjackComponent implements OnInit,OnDestroy {

  IsClicked:boolean[]=[];

  unameToDisplay:any=localStorage.getItem("username");
  bankrollToDisplay:any=localStorage.getItem("bankroll");
  profitToDipslay:any=localStorage.getItem("profit");

  CurrentBetInfo:string="Wait for the next round";
  ColorsArray:string[]=["#009A17","#E10600"];
  BetsTimingInfo:string[]=["Bets are open","No more bets"];
  BetsbackgroundColor:string=this.ColorsArray[1];

  Seats:TableSeat[]=[];
  GameDisplay:boolean=false;
  PreGameButtons:number[]=[];

  CurrentCoin:number=0;
  TotalBet:number=0;
  Bets:number[]=[];
  PreviousBets:number[]=[];
  BetsEnabled:boolean=true;
  BetDescription:string[]=["Main bet","Perfect pairs","21+3"];

  chipImageUrl:string='../../../../../assets/images/TotalBetChip.png';
  CurrentBet:string[]=[];
  chipImageEnabled:boolean[]=[];

  cardImageEnabled:boolean[]=[];


  currentError:string="";
  jwtStorage:any="";
  messages:ChatMessages[]=[];
  newMessage: string = "";
  newAuthor:string="";



  @ViewChild('chatMessages',{static:false})chatMessagesRef!: ElementRef;
  
  constructor(private playerMenu:PlayerMenuComponent,private SignalRService:SignalRService){
      this.messages=[];
      this.SettingTransformValues();
      this.TotalBet=0;
      for (let i=0;i<3*this.Seats.length;i++)
      {        
        this.Bets.push(0);
        this.PreviousBets.push(0);
        this.chipImageEnabled.push(false);
        this.CurrentBet.push("");
      }
      this.PreGameButtons.fill(0,0,this.Seats.length-1);
      for (let i=0;i<7;i++)this.IsClicked.push(false);

    }
  async ngOnInit():Promise<void>
  {
    let TableId=localStorage.getItem("TableId");
    let username=localStorage.getItem("username");
    if(TableId&&username){
      this.Seats=await this.SignalRService.GetAllSeatsStatus(TableId);
      for(let i=0;i<this.Seats.length;i++){
        if(this.Seats[i].Player===username)this.PreGameButtons[i]=2;
        else if(this.Seats[i].Player==="")this.PreGameButtons[i]=0;
        else this.PreGameButtons[i]=1;
        console.log(this.Seats[i].Player);
      }
      console.log(this.Seats);
      console.log(this.PreGameButtons);
      
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
            let JWT=localStorage.getItem("jwt");
            if(JWT)this.SignalRService.SendBets(this.Bets,JWT,closedBetsToken);
          }
      });

      this.SignalRService.WinListener(
        (WinReport:string,WinValue:number)=>{
          this.playerMenu.TableMessages.push({ text: WinReport,text2:"", textColor:'grey',text2Color:'white'});   
          this.playerMenu.scrollToBottom();
      });
      this.SignalRService.UpdateSeatInfoListener(
        (updatedSeat:TableSeat)=>{
          let id=updatedSeat.Id;
          this.Seats[id]=updatedSeat;
      });
    }
  }
  ngOnDestroy(): void {

  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      let Author = localStorage.getItem("username");
     // if(Author)this.SignalRService.SendChatMessage(Author.toString(),this.newMessage);
    }
  }
  private scrollToBottom() {
    this.newMessage = '';
    const chatMessagesEl = this.chatMessagesRef.nativeElement;
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  Double() {
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
  Repeat() {
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
  Undo() {
    if(this.BetsEnabled){
      for(let i=0;i<this.Bets.length;i++)this.Bets[i]=0;this.TotalBet=0;
      this.CurrentBet=["","","",""];
      for(let i=0;i<this.chipImageEnabled.length;i++)this.chipImageEnabled[i]=false;
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
  Return() {
    this.playerMenu.TableGoback();
  }
  SendBets() {
    if(this.BetsEnabled){
      let JWT=localStorage.getItem("jwt");
      if(JWT){
        this.SignalRService.SendBets(this.Bets,JWT,"");
        localStorage.setItem('PreviousBets', JSON.stringify(this.Bets));
      }
      this.BetsEnabled=false;
      }
  }



  SeatDynamicValues(button:string){

    return {
      'transform': `translateY(${button}%)`,
      'width': `${100/this.Seats.length}%`
    };
  }
  SettingTransformValues(){

    let length=localStorage.getItem("TableMaxSeats");
    if(length){
      for(let j=0;j<parseInt(length);j++){
        let obj:TableSeat={
          Player:'wwwww',
          Ready:'a',
          TransformVal:'sd',
          Id:j
        }
        this.Seats.push(obj);
      }
    }
    console.log(this.Seats);
    
    if(this.Seats.length>0)
    {

      
      if(this.Seats.length%2===0){

        this.Seats[this.Seats.length/2].TransformVal='0';
        this.Seats[this.Seats.length/2-1].TransformVal='0';

        let iteratorMax:number=this.Seats.length/2;
        let iterator:number=1;

        for(iterator;iterator<iteratorMax;iterator++)
        {
          this.Seats[this.Seats.length/2+iterator].TransformVal=(-10*Math.pow(iterator,2)).toString();
          this.Seats[this.Seats.length/2-1-iterator].TransformVal=(-10*Math.pow(iterator,2)).toString();
        }

      }
      else{
        let rootIndex:number=Math.floor(this.Seats.length/2);
        this.Seats[rootIndex].TransformVal='0';

        let iteratorMax:number=Math.floor(this.Seats.length/2);
        let iterator:number=1;

        for(iterator;iterator<=iteratorMax;iterator++)
        {            
          this.Seats[rootIndex+iterator].TransformVal=(-10*Math.pow(iterator,2)).toString();
          this.Seats[rootIndex-iterator].TransformVal=(-10*Math.pow(iterator,2)).toString();
        }
      }
    }

    console.log(this.Seats);
  }
  AddBet(Index:number,SeatId:number){
    let newIndex=3*SeatId+Index;
    if(this.CurrentCoin>0&&this.BetsEnabled){
      let cash=localStorage.getItem("bankroll");
      let minBet=localStorage.getItem("TableMinBet");
      let maxBet=localStorage.getItem("TableMaxBet");

      
        if(minBet&&maxBet){
        if((this.Bets[newIndex]+this.CurrentCoin)>=parseFloat(minBet)&&(this.Bets[newIndex]+this.CurrentCoin)<=parseFloat(maxBet)){
          if(cash&&parseFloat(cash)>=(this.CurrentCoin+this.TotalBet))
          {
          this.TotalBet+=this.CurrentCoin;
          this.Bets[newIndex]+=this.CurrentCoin;
          this.chipImageEnabled[newIndex]=true;
          this.CurrentBet[newIndex]=this.Bets[newIndex].toString();
          console.log("Bets["+newIndex+"]: "+this.Bets[newIndex]);
          }
          else this.BrokeError();
        }
        else if((this.Bets[newIndex]+this.CurrentCoin)>parseFloat(maxBet))this.tooMuch();
        else  this.tooLittle(Index);
        }
        else console.log("error");
    }
  }
  SubstractBet(Index:number,SeatId:number,event:MouseEvent){
    let newIndex=3*SeatId+Index;
    event.preventDefault();
    let minBet=localStorage.getItem("TableMinBet");
    if(minBet&&this.BetsEnabled&&this.CurrentCoin>0)
    {
      if(this.Bets[newIndex]>0){
          if(this.Bets[newIndex]-this.CurrentCoin>=parseFloat(minBet)){

            this.TotalBet-=this.CurrentCoin;
            this.Bets[newIndex]-=this.CurrentCoin;
            this.CurrentBet[newIndex]=this.Bets[newIndex].toString();
          }
          else if(this.Bets[newIndex]-this.CurrentCoin<parseFloat(minBet)&&this.Bets[newIndex]-this.CurrentCoin>0){
            this.tooLittle(Index);
          }
          else{
            this.TotalBet-=this.Bets[newIndex];
            this.Bets[newIndex]=0;
            this.CurrentBet[newIndex]="";
            this.chipImageEnabled[newIndex]=false;
            
          }
      }
      console.log("Bets["+newIndex+"]: "+this.Bets[newIndex]);
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
  TakeASeat(seatId:number){
    let tableId=localStorage.getItem("TableId");
    let jwt=localStorage.getItem("jwt");
    if(tableId&&jwt) this.SignalRService.TakeASeat(tableId,jwt,seatId); 
  }
}
