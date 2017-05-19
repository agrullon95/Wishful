import { Component, OnInit, AfterViewInit  } from '@angular/core';
import {Router, Params, ActivatedRoute} from "@angular/router";
import { AF } from '../../providers/angularfirebase';
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

@Component({
  selector: 'app-santa-wishlist',
  templateUrl: './santa-wishlist.component.html',
  styleUrls: ['./santa-wishlist.component.css']
})
export class SantaWishlistComponent implements OnInit, AfterViewInit {
  public error: Boolean;
  public success: Boolean;
  public flashMessage: String;
  public pageLoaded: Boolean;

  public currentWishlistKey: any;

  public title: FirebaseObjectObservable<any>;
  public ownerEmail: FirebaseObjectObservable<any>;
  public ownerName: FirebaseObjectObservable<any>;
  public results: FirebaseObjectObservable<any>;
  public blind: FirebaseObjectObservable<any>;
  public shuffled: FirebaseObjectObservable<any>;


  public participantEmail: any;
  public shuffleResults: any;
  public emails: FirebaseObjectObservable<any>;
  public emailsArray: Array<any> = [];
  public emailObj: Array<any> = [];
  public assignedTo: any;


  constructor(private afService: AF, private router: Router, private activatedRoute: ActivatedRoute) {
    // retrieve wishlist key from url
    let params: any = this.activatedRoute.snapshot.params;
    this.currentWishlistKey = params['wishlistKey'];

    // Retrieve values from database and watch for any changes
    this.afService.af.database.object('/secretSantaGroups/' + this.currentWishlistKey).$ref.on('value', snapshot => {
      this.title = snapshot.val().title;
      this.ownerEmail = snapshot.val().ownerEmail;
      this.ownerName = snapshot.val().ownerName;
      this.blind = snapshot.val().blind;
      this.shuffled = snapshot.val().shuffled;
      this.results = snapshot.val().results;
      this.emails  = snapshot.val().participants;

      this.emailObj = this.emailObjDecode(snapshot.val().participants);
      this.assignedTo = this.getAssignedPerson();
    });

  }


  // Secret Santa Generator. Thanks to Ryan Knight for this work

  secretSantaGenerator() {
    var participants, copy, result, equal, list;
    list = this.emails;
    participants = list;
    copy = list.slice();
    result = {};
    equal = true;

    // stop function if there are less than 3 users
    if (list.length < 3){
      this.error = true;
      this.flashMessage = "You must share this list with 3 or more users in order to shuffle and assign each user";
      this.messageFlash();
      return;
    }

    this.draw(list,participants, result, copy);
  }


  // check if participant list are equal after shuffle
  checkTheList(list, participants, copy) {

    for (var i = participants.length; i--;) {
      if (participants[i] == copy[i]) {
        return true;
      }
    }

    return false;
  }

  // shuffle the list
  shuffle(list) {
      var counter = list.length, temp, index;
      while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;

        //swap
        temp = list[counter];
        list[counter] = list[index];
        list[index] = temp;
      }

      return list;
  } // end of shuffle

  draw(list, participants, result, copy) {
    while (true) {
      var saveList = list;

      //shuffle x times to increase randomness (testing)
      for (var x = 0; x < 5; x++){
        this.shuffle(saveList);
        //console.log(list);
      }

      if (!this.checkTheList(saveList,participants, copy)) {
        break;
      }
    }

      for (var i = participants.length; i--;) {
        result[participants[i]] = copy[i];
      }

      //this.shuffleResults = result;

      this.afService.af.database.object('/secretSantaGroups/' + this.currentWishlistKey + '/results').set(result);
      this.afService.af.database.object('/secretSantaGroups/' + this.currentWishlistKey + '/shuffled').set(true);
      //console.log(result);

      this.getAssignedPerson();

    }// end of draw


  // encode email before sending to firebase in order to bypass forbidden characters
  encodeString(string) {
    return encodeURIComponent(string).replace(/\./g, '%2E');
  }

  decodeString(string) {
    return decodeURIComponent(string);
  }

  copyArray(from) {
    if (from == null) {
      return [];
    }

    var to = [];

    for (var i = 0; i < from.length; i++) {
      to.push(from[i]);
    }

    return to;
  }

  checkExists(encoded) {
    for ( var i = 0; i < this.emailsArray.length; i++) {
      if (this.emailsArray[i] == encoded) {
        return true;
      }
    }
    return false;
  }

  //add emails of participants to database
  addParticipant() {
    var encoded = this.encodeString(this.participantEmail);
    if (this.emailsArray.length < 1) {
      this.emailsArray = this.copyArray(this.emails)
    }

    if (this.checkExists(encoded)) {
      //console.log("Email already exists");
      this.error = true;
      this.flashMessage = "Error: Email has already been added to list";
      this.messageFlash();
    }
    else {
      if (!this.validateEmail(this.participantEmail)) {
        this.error = true;
        this.flashMessage = "Please enter a valid email";
        this.messageFlash();
      }
      else {
        this.emailsArray.push(encoded);

        this.success = true;
        this.flashMessage = "Email has been added to list";
        this.messageFlash();

        this.afService.af.database.object('/secretSantaGroups/' + this.currentWishlistKey + '/participants').$ref.set(this.emailsArray);
        this.participantEmail = "";
      }
    }

  } // end of add participant function

  // Flash message on frontend for few seconds then remove it
 messageFlash() {
    setTimeout(function() {
       this.error = false;
       this.success = false;
       this.flashMessage = "";
       //console.log(this.error);
   }.bind(this), 1500);
  } //end of message Flash function

  getAssignedPerson() {
    var results = this.results;
    var decode;
    var myEmail = this.afService.email;
    for (var key in results) {
      decode = this.decodeString(key);
      if (myEmail == decode) {
        this.assignedTo = this.decodeString(results[key]);
        return this.assignedTo;
      }
    }

  }

  loadPageContent() {
    setTimeout(function() {
      this.pageLoaded = true;
    }.bind(this), 1000);
  }

  emailObjDecode(emails) {
    var newArr = new Array();
    for (var i = 0; i < emails.length; i++) {
      newArr.push(this.decodeString(emails[i]));
    }
    return newArr;
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

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.loadPageContent();
  }

}
