import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Router, Params, ActivatedRoute} from "@angular/router";
import { AF } from '../providers/angularfirebase';
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit, AfterViewInit {
  public error: Boolean;
  public success: Boolean;
  public flashMessage: String;
  public newWishlistItem: any;
  public sharedEmailList: FirebaseListObservable<any>;
  public currentWishlistKey: any;
  public title: FirebaseObjectObservable<any>;
  public ownerEmail: FirebaseObjectObservable<any>;
  public ownerName: FirebaseObjectObservable<any>;
  public items: FirebaseListObservable<any>;
  public completedToggle: false;
  public shareEmail: String;
  public emailObj: FirebaseObjectObservable<any>;
  public sharedToggle: Boolean;
  public editableToggle: Boolean;
  public pageLoaded: Boolean;

  constructor(private afService: AF, private router: Router, private activatedRoute: ActivatedRoute) {
    let params: any = this.activatedRoute.snapshot.params;
    this.currentWishlistKey = params['wishlistKey'];

    // this.afService.af.database.object('/wishlists/' + this.currentWishlistKey).$ref.once('value').then(snapshot => {
    //   this.title = snapshot.val().title;
    //   this.ownerEmail = snapshot.val().ownerEmail;
    //   this.sharedToggle = snapshot.val().shared;
    //   this.editableToggle = snapshot.val().editable;
    //   //console.log(this.title);
    // });

    // Retrieve values from database and watch for any changes
    this.afService.af.database.object('/wishlists/' + this.currentWishlistKey).$ref.on('value', snapshot => {
      this.title = snapshot.val().title;
      this.ownerEmail = snapshot.val().ownerEmail;
      this.sharedToggle = snapshot.val().shared;
      this.editableToggle = snapshot.val().editable;
      this.ownerName = snapshot.val().ownerName;
      //console.log(snapshot.val());
    });

    this.afService.af.database.object('/wishlists/' + this.currentWishlistKey + '/sharedEmails').$ref.on('value', snapshot => {
      this.emailObj = snapshot.val();
    });
    this.sharedEmailList = this.afService.af.database.list('/wishlists/' + this.currentWishlistKey + '/sharedEmails');

    this.items = this.afService.af.database.list('/wishlists/' + this.currentWishlistKey + '/items');

  }

  // add new wishlist item and show error for 1 second
  addWishlistItem() {
    if (this.newWishlistItem == null || this.newWishlistItem == ""){
      this.error = true;
      this.flashMessage = "Error: Input field cannot be empty";
      //console.log(this.error);
    }
    else {
      var newItem = {
        title: this.newWishlistItem,
        completed: false,
        creatorName: this.afService.name,
        creatorEmail: this.afService.email
      }
      this.items.push(newItem);
      this.newWishlistItem = "";
    }
    this.messageFlash();
  }

  //delete wishlist item
  deleteWishlistItem(key) {
    //console.log(key);
    this.items.remove(key);
  }

  //change checkbox value for specified item
  checkboxItemChange(e, key, field) {
    var itemPath = this.afService.af.database.list('/wishlists/' + this.currentWishlistKey + '/items/' + key);
    if (e.target.checked) {

      switch (field) {
        case 'completed':
          itemPath.$ref.ref.update({'completed': true});
          break;
      }

    }
    else {

      switch (field) {
        case 'completed':
          itemPath.$ref.ref.update({'completed' : false});
          break;
      }

    }
  }

  //change checkbox for wishlist field
  checkboxWishlistChange(e, field) {
    var wishlistPath = this.afService.af.database.list('/wishlists/' + this.currentWishlistKey);
    if (e.target.checked) {

      switch (field) {
        case 'editable':
          wishlistPath.$ref.ref.update({'editable': true});
          break;
        case 'shared':
          wishlistPath.$ref.ref.update({'shared': true});
          break;
      }

    }
    else {

      switch (field) {
        case 'editable':
          wishlistPath.$ref.ref.update({'editable' : false});
          break;
        case 'shared':
          wishlistPath.$ref.ref.update({'shared': false});
          break;
      }

    }
  }

  //Share wishlist form
  shareWishlist() {
    if (this.shareEmail == null || this.shareEmail == "" ) {
      this.error = true;
      this.flashMessage = "Error: Input field cannot be empty.";
      this.messageFlash();
    }
    else if (!this.validateEmail(this.shareEmail)) {
      this.error = true;
      this.flashMessage = "Error: Please enter a valid email address."
      this.messageFlash();
    }
    else if (this.objIter(this.emailObj,this.shareEmail)) {
        this.error = true;
        this.flashMessage = "Error: Email already in your shared list.";
        this.messageFlash();
      }
    else {
        this.sharedEmailList.push(this.shareEmail);
        this.success = true;
        this.flashMessage = "Success: Email added to shared list.";
        this.messageFlash();
        this.shareEmail = "";
      }
  }

  //object loop
  objIter(obj, value){
    //console.log(obj);
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if(obj[key] == value){
        //console.log(key + " " + obj[key]);
        return true;
        }
      }
    }
    return false;
  }

  //validate email
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  // Flash message on frontend for few seconds then remove it
  messageFlash() {
    setTimeout(function() {
       this.error = false;
       this.success = false;
       this.flashMessage = "";
       //console.log(this.error);
   }.bind(this), 1500);
  }

  loadPageContent() {
    setTimeout(function() {
      this.pageLoaded = true;
    }.bind(this), 1000);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadPageContent();

  }



}
