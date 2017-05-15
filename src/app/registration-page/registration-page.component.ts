import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AF } from '../providers/angularfirebase';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit{
  public error: any;

  constructor(private afService: AF, private router: Router) {

    //authorization (user logged in) check
    this.afService.af.auth.subscribe(
      (auth) => {
        if (auth) {
          // if user is logged in, redirect to home page
          this.router.navigate(['']);
        }
      }
    );


  }

  register(event, name, email, password, passwordAgain) {
    event.preventDefault();
    if (this.validateForm(password, passwordAgain)) {
      this.afService.registerUser(email, password).then((user) => {
        this.afService.saveUserInfoFromForm(user.uid, name, email).then(() => {
          this.router.navigate(['']);
        })
          .catch((error) => {
            this.error = error;
          });
      })
        .catch((error) => {
          this.error = error;
          console.log(this.error);
        });
    }
    else {
      console.log("Passwords don't match");
    }
  }

  validateForm(password, passwordAgain) {
    if (password === passwordAgain) {
      return true;
    }
    return false;
  }

  ngOnInit(){}
}
