import { Component, OnInit } from '@angular/core';
import {Router, Params, ActivatedRoute} from "@angular/router";
import { AF } from '../providers/angularfirebase';
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  public error: Boolean;
  public errorMessage: String;
  public newWishlistItem: any;
  public currentWishlistKey: any;
  public title: FirebaseObjectObservable<any>;
  public ownerEmail: FirebaseObjectObservable<any>;
  public items: FirebaseListObservable<any>;
  public completedToggle: false;
  public shareEmail: String;

  constructor(private afService: AF, private router: Router, private activatedRoute: ActivatedRoute) {
    let params: any = this.activatedRoute.snapshot.params;
    this.currentWishlistKey = params['wishlistKey'];

    this.afService.af.database.object('/wishlists/' + this.currentWishlistKey).$ref.once('value').then(snapshot => {
      this.title = snapshot.val().title;
      this.ownerEmail = snapshot.val().ownerEmail;
      //console.log(this.title);
    });

    // this.afService.af.database.object('/users').$ref.once('value').then(snapshot => {
    //   console.log(snapshot.val());
    //   for (var property in snapshot.val()) {
    //     if (snapshot.val().hasOwnProperty(property)) {
    //     console.log(snapshot.val()[property].email);
    //     }
    //   }
    // });

    this.items = this.afService.af.database.list('/wishlists/' + this.currentWishlistKey + '/items');

  }

  // add new wishlist item and show error for 1 second
  addWishlistItem() {
    if (this.newWishlistItem == null || this.newWishlistItem == ""){
      this.error = true;
      this.errorMessage = "Error: Input field cannot be empty";
      //console.log(this.error);
    }
    else {
      var newItem = {
        title: this.newWishlistItem,
        completed: false
      }
      this.items.push(newItem);
      this.newWishlistItem = "";
    }
    setTimeout(function() {
       this.error = false;
       this.errorMessage = "";
       //console.log(this.error);
   }.bind(this), 1500);
  }

  //delete wishlist item
  deleteWishlistItem(key) {
    //console.log(key);
    this.items.remove(key);
  }

  //change checkbox value
  checkboxChange(e, key) {
    var itemPath = this.afService.af.database.list('/wishlists/' + this.currentWishlistKey + '/items/' + key);
    if (e.target.checked) {
      itemPath.$ref.ref.update({'completed' : true});
    }
    else {
      itemPath.$ref.ref.update({'completed' : false});
    }
  }

  //share wishlist
  shareWishlist() {
    if (this.shareEmail == null || this.shareEmail == "" ) {
      this.error = true;
      this.errorMessage = "Error: Input field cannot be empty";
    }
    else {
      console.log(this.shareEmail);
    }
    setTimeout(function() {
       this.error = false;
       this.errorMessage = "";
       //console.log(this.error);
   }.bind(this), 1500);
  }

  ngOnInit() {
  }



}
