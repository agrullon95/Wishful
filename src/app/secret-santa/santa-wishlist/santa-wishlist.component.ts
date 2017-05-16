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

  public currentWishlistKey: any;
  public title: FirebaseObjectObservable<any>;
  public ownerEmail: FirebaseObjectObservable<any>;
  public ownerName: FirebaseObjectObservable<any>;

  constructor(private afService: AF, private router: Router, private activatedRoute: ActivatedRoute) {
    // retrieve wishlist key from url
    let params: any = this.activatedRoute.snapshot.params;
    this.currentWishlistKey = params['wishlistKey'];

    
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

}
