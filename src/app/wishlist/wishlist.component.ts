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
  public error: any;
  public currentWishlistKey;
  public title: FirebaseObjectObservable<any>;
  public items: FirebaseListObservable<any>;

  constructor(private afService: AF, private router: Router, private activatedRoute: ActivatedRoute) {
    let params: any = this.activatedRoute.snapshot.params;
    this.currentWishlistKey = params['wishlistKey'];

    this.afService.af.database.object('/wishlists/' + this.currentWishlistKey).$ref.once('value').then(snapshot => {
      this.title = snapshot.val().title;
      //this.items = snapshot.val().items;
      //console.log(this.currentWishlist);
    });

    this.items = this.afService.af.database.list('/wishlists/' + this.currentWishlistKey + '/items');

  }

  ngOnInit() {
  }



}
