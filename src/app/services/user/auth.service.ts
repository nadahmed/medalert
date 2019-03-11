
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import * as firebase from "firebase/app"
import 'firebase/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    authState:firebase.User;
    
  constructor(
     
      private router: Router,
  ) {
        firebase.auth().onAuthStateChanged((user : firebase.User)=>{
        if(user!==null){this.authState=user;}
        else{this.authState=null;}
      });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }
}
