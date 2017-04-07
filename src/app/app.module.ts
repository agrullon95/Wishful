import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import {RouterModule, Routes} from "@angular/router";

import { AF } from './providers/angularfirebase';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { WishlistComponent } from './wishlist/wishlist.component';

export const firebaseConfig = {
  apiKey: "AIzaSyAAY5UcFeq8wz0S4zaCh2oNIjDejaYTTUM",
  authDomain: "wishful-55549.firebaseapp.com",
  databaseURL: "https://wishful-55549.firebaseio.com",
  storageBucket: "wishful-55549.appspot.com",
  messagingSenderId: "662992471379"
};

// Routes for application
const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegistrationPageComponent},
  { path: 'wishlists/:wishlistKey', component: WishlistComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    RegistrationPageComponent,
    WishlistComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routes),
    FormsModule,
    HttpModule,
    DropdownModule.forRoot()
  ],
  providers: [AF],
  bootstrap: [AppComponent]
})
export class AppModule { }
