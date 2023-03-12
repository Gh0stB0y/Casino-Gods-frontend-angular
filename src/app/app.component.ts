import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GUI_APP';

  sign_in_error:string[]=["Username not found","Incorrect password"];
  login_menu:boolean=true;
  sign_up_menu:boolean=false;
  sign_in_menu:boolean=false;
  login_list_disp="block";
  signup_list_disp="none";
  signin_list_disp="none";
  forgot_pass_disp="none";
  welcome_disp="flex";

  //
/*   signUp(){
    this.login_list_disp="none";
    this.signup_list_disp="block";
    this.welcome_disp="none";
    location.href='players/add'
  }

  signIn(){
    this.login_list_disp="none";
    this.signin_list_disp="block";
    this.welcome_disp="none";
  }  

  guest(){
    this.login_list_disp="none";
    this.welcome_disp="none";
    //trzeba wyslac info do serwera ze gosc chce zagrac

  }
  forgot(){
    this.signin_list_disp="none";
    this.forgot_pass_disp="block";
  } */
}
