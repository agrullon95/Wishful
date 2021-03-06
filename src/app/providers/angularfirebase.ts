import {Injectable} from "@angular/core";
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import {FirebaseObjectFactoryOpts} from "angularfire2/interfaces";

@Injectable()
export class AF {
  //public messages: FirebaseListObservable<any>;
  public users: FirebaseListObservable<any>;
  public name: string;
  public displayName: string;
  public email: string;
  public user: FirebaseObjectObservable<any>;
  public wishlists: FirebaseListObservable<any>;
  public secretSantaGroups: FirebaseListObservable<any>;

  constructor(public af: AngularFire) {
    this.af.auth.subscribe(
      (auth) => {
        if (auth != null) {
          this.user = this.af.database.object('users/' + auth.uid);
        }
      });

    this.wishlists = this.af.database.list('wishlists');
    this.users = this.af.database.list('users');
    this.secretSantaGroups = this.af.database.list('secretSantaGroups');
  }

  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
  loginWithGoogle() {
    return this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    });
  }

  /**
   * Logs out the current user
   */
  logout() {
    return this.af.auth.logout();
  }

  /**
   * For Google Login
   */
  addUserInfo(){
    //We saved their auth info now save the rest to the db.
    this.users.push({
      email: this.email,
      displayName: this.name
    });
  }

  /**
   *
   * @param model
   * @returns {firebase.Promise<void>}
   */
  registerUser(email, password) {
    //console.log(email)
    return this.af.auth.createUser({
      email: email,
      password: password
    });


  }

  /**
   * Save other user info into database
   * @param uid
   * @param model
   * @returns {firebase.Promise<void>}
   */
  saveUserInfoFromForm(uid, name, email) {
    //console.log(name);
    return this.af.database.object('registeredUsers/' + uid).set({
      name: name,
      email: email,
    });
  }

  /**
   * Logs the user in using their Email/Password combo
   * @param email
   * @param password
   * @returns {firebase.Promise<FirebaseAuthState>}
   */
  loginWithEmail(email, password) {
    return this.af.auth.login({
        email: email,
        password: password,
      },
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password,
      });
  }

  /**
   * Saves a wishlist to the Firebase Realtime Database
   * @param title
   */
  createNewWishlist(title) {
    var wishlist = {
      title: title,
      ownerEmail: this.email,
      ownerName: this.name,
      timestamp: Date.now(),
      shared: false,
      editable: false
    };
    this.wishlists.push(wishlist);
  }

  /**
   * Saves a secret santa group to the Firebase Realtime Database
   * @param title, blindValue
   */
  createNewSecretSantaGroup(title, blindValue) {
    var secretSantaGroup = {
      title: title,
      ownerEmail: this.email,
      ownerName: this.name,
      timestamp: Date.now(),
      blind: blindValue,
      participants: [encodeURIComponent(this.email).replace(/\./g, '%2E')]
    };
    this.secretSantaGroups.push(secretSantaGroup);
  }

  /**
   * Reset password
   * @param email
   */
   sendPasswordResetToEmail(emailAddress) {
   }

} // End of export AF class
