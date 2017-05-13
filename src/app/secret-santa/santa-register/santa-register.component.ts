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

  constructor(public afService: AF) {

    this.groups = this.afService.secretSantaGroups;
  }

  // creates new Secret Santa group
  newSecretSantaGroup (event, groupName){
    event.preventDefault();
    //console.log(groupName);
    //console.log(this.checkBoxValue);
    this.afService.createNewSecretSantaGroup(groupName);
    this.success = true;
    this.flashMessage = "Success: Secret Santa has been created";
    this.messageFlash();
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

  ngOnInit() {
  }

}
