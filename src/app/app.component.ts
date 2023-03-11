import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GUI_APP';
  sign_up_error:string[]=["Username is already in use","E-mail address is already in use","E-mail address is incorrect","User is younger than 18 years old",
  "Password does not contain a large letter", "Password does not contain a small letter","Password does not contain a number","Password does not contain a special character",
  "Password is not 8-letter-long"];
  sign_in_error:string[]=["Username not found","Incorrect password"];
  login_menu:boolean=true;
  sign_up_menu:boolean=false;
  sign_in_menu:boolean=false;
  login_list_disp="block";
  signup_list_disp="none";
  signin_list_disp="none";
  forgot_pass_disp="none";
  welcome_disp="flex";
  error_info=this.sign_up_error[1];
  //
  signUp(){
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
  }
}
