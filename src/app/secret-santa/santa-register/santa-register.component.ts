import { Component, OnInit } from '@angular/core';
import {Router, Params, ActivatedRoute} from "@angular/router";
//import { AF } from '../../providers/angularfirebase';
import { AF } from '../../providers/angularfirebase';
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

@Component({
  selector: 'app-santa-register',
  templateUrl: './santa-register.component.html',
  styleUrls: ['./santa-register.component.css']
})
export class SantaRegisterComponent implements OnInit {
  public checkBoxValue: boolean = false;
  public flashMessage: String;
  public error: Boolean;
  public success: Boolean;
  public groups: FirebaseListObservable<any>;
  public groupName: String;

  constructor(public afService: AF) {

    this.groups = this.afService.secretSantaGroups;
  }

  // creates new Secret Santa group
  newSecretSantaGroup (event){
    event.preventDefault();
    //console.log(groupName);
    //console.log(this.checkBoxValue);
    this.afService.createNewSecretSantaGroup(this.groupName,this.checkBoxValue);
    this.success = true;
    this.flashMessage = "Success: Secret Santa has been created";
    this.messageFlash();
    this.groupName = "";
  }

  // changes checkbox value
  checkboxChange(){
    if(this.checkBoxValue == true){
      this.checkBoxValue = false;
    }
    else {
      this.checkBoxValue = true;
    }
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

  decodeString(string) {
    return decodeURIComponent(string);
  }

  checkSharedList(wishlist, email) {
    var obj = wishlist.participants;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if(this.decodeString(obj[key]) == this.afService.email){
          return true;
        }
      }
    }

    return false;

  }

  ngOnInit() {
  }

}
