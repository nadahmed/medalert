import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import  * as firebase from 'firebase'
import { JsonPipe } from '@angular/common';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    username:string;
    password:string;

  constructor(public googlePlus: GooglePlus, public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }
emailSignIn(){
    this.username = 'i pressed'
}

facebookSignIn(){

}

googleSignIn(){
    
        const provider = new firebase.auth.GoogleAuthProvider();
        const log = this.afAuth.auth.signInWithPopup(provider);
        log.then(res=>{this.username='This is the result:' + JSON.stringify(res)})
        .catch(e=>{
            this.username = 'This is the error' + JSON.stringify(e);
        })
        // const Gplus = this.googlePlus.login({
        //     'webClientId': '690959688562-067djvtm6sp6f9a75lu64a6fhj7m7bin.apps.googleusercontent.com',
        //     'offline' : true,
        //     'scopes' : 'profile email'
        // })
        // this.username = 'it worked i guess';
        //     this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(Gplus.idToken));
    
    }

}

