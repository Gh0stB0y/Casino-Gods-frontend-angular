import { Component } from '@angular/core';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.scss']
})
export class LoginMenuComponent {
  signUp(){
    location.href='players/add'
  }

  signIn(){
    location.href='signin'
  }  

  guest(){
    
  }
}
