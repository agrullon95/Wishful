import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AF } from './providers/angularfirebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean;
  public user: string;

  constructor(public afService: AF, private router: Router) {
    // This asynchronously checks if our user is logged it and will automatically
    // redirect them to the Login page when the status changes.
    // This is just a small thing that Firebase does that makes it easy to use.
    this.afService.af.auth.subscribe(
      (auth) => {
        if(auth == null) {
          console.log("Not Logged in.");

          this.isLoggedIn = false;
          this.router.navigate(['login']);
        }
        else {
          console.log("Successfully Logged in.");
          // Set the Display Name and Email so we can attribute messages to them
          if(auth.google) {
            this.afService.displayName = auth.google.displayName;
            this.afService.email = auth.google.email;
          }
          else {
            this.afService.displayName = auth.auth.email;
            this.afService.email = auth.auth.email;
            this.afService.af.database.list('/registeredUsers/' + auth.uid).$ref.once('value').then(snapshot => {
              this.afService.name = snapshot.val().name;
              //console.log(this.afService.name);
            });
          }

          this.isLoggedIn = true;
          //this.router.navigate(['']);
        }
      }
    );
  }

  logout() {
    this.afService.logout();
  }

  ngOnInit() {
  }

}
