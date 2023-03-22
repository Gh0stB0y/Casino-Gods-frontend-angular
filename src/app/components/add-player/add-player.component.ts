import { Component, OnInit} from '@angular/core';
import { Route, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service/public-api';
import { PlayerSignUp } from 'src/app/models/player.model';
import { PlayersServicesService } from 'src/app/services/players-services.service';
import {AppModule} from 'src/app/app.module'
@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss']
})

export class AddPlayerComponent implements OnInit {

  passConfValue:string="";
  errorArray:boolean[]=[false,false,false,false,false,false,false,false,false];
  errorArrayVal:string[]=["Username too short","invalid email","User is not an adult","Birthdate not fulfilled","Password does not contain lowercase letter",
  "Password does not contain upercase letter","Password does not contain a number","Password does not contain a special character","Password too short",
  "Password and Confirm password do not match"];
  currentError:string="";
  allGood:boolean=false;

  addPlayerRequest: PlayerSignUp={
  username: '',
  email: '',
  password: '',
  birthdate:""
  };
  constructor(private playerService: PlayersServicesService, private router:Router,  private cookie:AppModule) {}
  ngOnInit(): void {
    this.cookie.cookieSet();
  }

  containsUppercase(str:string) {
    return Boolean(str.match(/[A-Z]/));
  }
  containsLowercase(str:string) {
    return Boolean(str.match(/[a-z]/));
  }
  containsNumber(str:string) {
    return Boolean(str.match(/[0-9]/));
  }
  containsSpecialLetter(str:string) {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if(format.test(str)){
      return true;
    } else {
      return false;
    }
  }

/* "Username too short","invalid email","User is not an adult","Birthdate not fulfilled","Password does not contain lowercase letter",
"Password does not contain upercase letter","Password does not contain number","Password does not contain special character","Password too short",""Password" and "Confirm password" do not match" */

  checkBirthDate():boolean{
    var userAge = new Date(this.addPlayerRequest.birthdate);  
    var currentDate = new Date();
     if((userAge.getFullYear()+18)<currentDate.getFullYear()) return false;
     else if(((userAge.getFullYear()+18)===currentDate.getFullYear())){
        if(userAge.getMonth()<currentDate.getMonth()) return false;
        else if(userAge.getMonth()===currentDate.getMonth()){
          if(userAge.getDate()<=currentDate.getDate()) return false;
          else return true;
        }
     else return true;
     }
     else return true;
  }
  checkPassword():boolean[]{
    let arr: boolean[] = [false,false,false,false,false]; 
    this.allGood=true;

    arr[0]=!this.containsLowercase(this.addPlayerRequest.password);
    arr[1]=!this.containsUppercase(this.addPlayerRequest.password);
    arr[2]=!this.containsNumber(this.addPlayerRequest.password);
    arr[3]=!this.containsSpecialLetter(this.addPlayerRequest.password);
    if(this.addPlayerRequest.password.length<8)arr[4]=true;
    else arr[4]=false;
    console.log(this.addPlayerRequest.password.length);
    return arr;
  }
  addPlayer(){ 
    this.errorArray=[false,false,false,false,false,false,false,false,false];
    /* for(let n = 0; n < this.errorArray.length; n++){this.errorArray[n]=false;} */
    if(this.addPlayerRequest.username.length<4) this.errorArray[0]=true;
    if(!this.addPlayerRequest.email.includes("@"))this.errorArray[1]=true;
      if(this.addPlayerRequest.birthdate.length>0) this.errorArray[2]=this.checkBirthDate(); /* jesli funkcja daje true to uzytkownik jest za mlody */
      else {this.errorArray[3]=true; this.errorArray[2]=false;}/* pusta data urodzenia */
      this.errorArray.splice(4,this.checkPassword().length ,...this.checkPassword());
      /* this.errorArray= this.errorArray.concat(this.checkPassword()); */
    if(this.passConfValue!=this.addPlayerRequest.password) this.errorArray[9]=true; else this.errorArray[8]=false;

    let out:string="";
    for(let n = 0; n < this.errorArray.length; n++){out+=(this.errorArray[n]+" ");}

    console.log(out);
    for(let n = 0; n < this.errorArray.length; n++){
     if(this.errorArray[n]===true){
      this.currentError=this.errorArrayVal[n];
      this.allGood=false;
      n=this.errorArray.length;
     }
     else {this.currentError="";this.allGood=true;}
    }

    if(this.allGood===true){
    this.playerService.addPlayer(this.addPlayerRequest)
    .subscribe({//jak wszystko bedzie ok
      next: (add_player)=>{
        console.log(add_player);
        this.router.navigate(['']);
      },
      error:(message)=>{//jesli bedzie jakis blad
        if(message.status===400)this.currentError=message.error;
        else if(message.status===0)this.currentError="Invalid connection, try again later";
        else console.log(message);
        console.log(message);
      }
      
    })
    }
    else{console.log("blad danych");}
  }



}
