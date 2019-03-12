import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from "firebase/app"
import 'firebase/auth'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    authState: boolean;

    constructor(

        private router: Router,
    ) {

    }

    authenticated(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged((user: firebase.User) => {
                if (user) {
                    resolve(true);
                } else {
                    console.log('User is not logged in');
                    this.router.navigate(['/login']);
                    resolve(false);
                }
            });
        });
    }
}