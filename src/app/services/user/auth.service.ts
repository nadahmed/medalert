import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import 'firebase/database';
import 'firebase/firestore';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authState: boolean;

    private creds = {
        'webClientId': '690959688562-067djvtm6sp6f9a75lu64a6fhj7m7bin.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
    };

    constructor(
        private googlePlus: GooglePlus,
        private afAuth: AngularFireAuth,
        private platform: Platform,
        private router: Router,
    ) {

    }

    register(email: string, pass: string ): Promise<firebase.auth.UserCredential> {
        return firebase.auth().createUserWithEmailAndPassword(email, pass);
    }

    emailSignIn(email: string, pass: string ) {
        return firebase.auth().signInWithEmailAndPassword(email, pass);
    }

    googleSignIn(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            this.platform.ready().then(() => {

                if (this.platform.is('cordova')) {
                    // make your native API calls
                    this.googlePlus.login(this.creds)
                        .then(async user => {

                            await firebase.auth().signInAndRetrieveDataWithCredential(
                                firebase.auth.GoogleAuthProvider.credential(user.idToken));
                            resolve(user);
                        }).catch(err => {
                            reject(err);
                        });
                } else {
                    const provider = new firebase.auth.GoogleAuthProvider();
                    this.afAuth.auth.signInWithPopup(provider)
                        .then(async res => {
                            resolve(res);
                        })
                        .catch(err => {
                            reject(err);
                        });
                }
            });

        });
    }


    authenticated(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged(async (user: firebase.User) => {
                if (user) {
                    resolve(true);
                } else {
                    // console.log('User is not logged in');
                    await this.router.navigate(['/login']);
                    resolve(false);
                }
            });
        });
    }

    credentials() {
        return firebase.auth().currentUser;
    }
}
