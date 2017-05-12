import { Component, OnInit } from '@angular/core';
import {Router, Params, ActivatedRoute} from "@angular/router";
import { AF } from '../../providers/angularfirebase';
import {FirebaseListObservable, FirebaseObjectObservable} from "angularfire2";

@Component({
  selector: 'app-santa-register',
  templateUrl: './santa-register.component.html',
  styleUrls: ['./santa-register.component.css']
})
export class SantaRegisterComponent implements OnInit {
  public checkBoxValue: boolean = false;

  constructor(public afService: AF) {

  }

  newSecretSantaGroup (event, groupName){
    event.preventDefault();
    console.log(groupName);
    console.log(this.checkBoxValue);
    this.afService.createNewSecretSantaGroup(groupName);
  }

  checkboxChange(){
    if(this.checkBoxValue == true){
      this.checkBoxValue = false;
    }
    else {
      this.checkBoxValue = true;
    }
  }

  ngOnInit() {
  }

}
