import { AuthService } from './../services/user/auth.service';
import { Platform, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    username:string;
    password:string;

  constructor(
        public googlePlus: GooglePlus,
        public afAuth: AngularFireAuth,
        private platform:Platform,
        private loadingController:LoadingController,
        public router:Router,
        public alertController: AlertController,
        private authService:AuthService,
        ) { }

async ngOnInit() {
      let myState=await this.authService.authenticated();
      if (myState){this.router.navigate(['/home']);}
  }

  async presentAlert(mess:string) {
    const alert = await this.alertController.create({
      header: 'Alert!',
      message: mess,
      buttons: ['OK']
    });

    await alert.present();
  }

async googleSignIn(){
    const loading = await this.loadingController.create({
		message: 'Please wait...'
    });
    loading.present();
    
    this.platform.ready().then(() => {
    
        if (this.platform.is('cordova')) {
          // make your native API calls
          this.googlePlus.login({
            'webClientId': '690959688562-067djvtm6sp6f9a75lu64a6fhj7m7bin.apps.googleusercontent.com',
            'offline' : true,
            'scopes' : 'profile email'
        }).then(async user =>{
//            await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(user.idToken));
            await firebase.auth().signInAndRetrieveDataWithCredential(firebase.auth.GoogleAuthProvider.credential(user.idToken))
            
            let mess= user.email +', ' + user.userId + ', ' + user.displayName;
            

            loading.message = 'You are logged in!';
            await loading.dismiss();
            //this.presentAlert(mess);
            this.router.navigate(['/home']);            
        }).catch(err=>{
            console.dir(err);
        })
        } else {
            const provider = new firebase.auth.GoogleAuthProvider();
            this.afAuth.auth.signInWithPopup(provider)
            .then(async res=>{
                loading.message = 'You are logged in!';
                loading.dismiss();
                await this.presentAlert(JSON.stringify(res));
                this.router.navigate(['/home']);
                
            })
            .catch(err=>{
                console.dir(err);
                loading.dismiss();
                this.presentAlert(err);
                
            })
        }
      });
    }
    emailSignIn(){
        this.username = 'i pressed';
        this.router.navigate(['/home']);
    }
    
    async facebookSignIn(){
     
    }
    
}

