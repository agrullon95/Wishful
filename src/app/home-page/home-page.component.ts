import { Component, OnInit } from '@angular/core';
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";
import { AF } from '../providers/angularfirebase';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  //public name: string;
  //public email: string;
  //public error: any;
  public error: Boolean;
  public success: Boolean;
  public flashMessage: String;
  public wishlists: FirebaseListObservable<any>;
  public newWishlist: string;


  constructor(public afService: AF) {
    // this.afService.af.auth.subscribe(auth => {
    //   // user info is inside auth object
    //   console.log("Email: " + auth.auth.email),
    //   this.email = auth.auth.email
    // });

    this.wishlists = this.afService.wishlists;

  } // end of constructor

  logout() {
    return this.afService.logout();
  }

  addWishlist(){
    if (this.newWishlist == null || this.newWishlist == ""){
      this.error = true;
      this.flashMessage = "Please enter a valid wishlist name";
      this.messageFlash();
      //console.log(this.error);
    }
    else {
      this.afService.createNewWishlist(this.newWishlist);
      this.newWishlist = '';
    }
    setTimeout(function() {
       this.error = false;
       //console.log(this.error);
   }.bind(this), 1000);
  }

  checkSharedList(wishlist, email) {
    var obj = wishlist.sharedEmails;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if(obj[key] == email)
        // console.log(key + " " + obj[key]);
        return true;
      }
    }
    return false;

  }

  messageFlash() {
    setTimeout(function() {
       this.error = false;
       this.success = false;
       this.flashMessage = "";
       //console.log(this.error);
   }.bind(this), 1500);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

}
