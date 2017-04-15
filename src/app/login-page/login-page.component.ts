import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthMethods , AngularFire} from 'angularfire2';
import { AF } from '../providers/angularfirebase';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  public error: any;

  constructor(public afService: AF, private router: Router) {
    this.afService.af.auth.subscribe(auth => {
      if (auth){
        this.router.navigate(['']);
      }
    });

  }

  loginWithGoogle() {
    this.afService.loginWithGoogle().then((data) => {
      // Send them to the homepage if they are logged in
      //console.log(data);
      this.afService.addUserInfo();
      this.router.navigate(['']);
    })
  }

  loginWithEmail(event, email, password){
    event.preventDefault();
    this.afService.loginWithEmail(email, password).then((user) => {
      //console.log(user);
      this.afService.af.database.list('/registeredUsers/' + user.uid).$ref.once('value').then(snapshot => {
        this.afService.displayName = snapshot.val().name;
      });
      this.router.navigate(['']);
    })
      .catch((error: any) => {
        if (error) {
          this.error = error;
          console.log(this.error);
        }
      });
  }

  resetPass(email){
    
  }

  ngOnInit(){
  }

}
