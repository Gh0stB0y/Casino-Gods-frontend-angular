import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GUI_APP';

  private cookie_name='';
  private all_cookies:any='';
  sign_in_error:string[]=["Username not found","Incorrect password"];
  login_menu:boolean=true;
  sign_up_menu:boolean=false;
  sign_in_menu:boolean=false;
  loggedUser:boolean=false;
  login_list_disp="block";
  signup_list_disp="none";
  signin_list_disp="none";
  forgot_pass_disp="none";
  welcome_disp="flex";
  

  constructor(private cookieService:CookieService){
  }

}
