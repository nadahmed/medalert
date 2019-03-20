import { AuthService } from './../services/user/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import 'firebase/auth';




@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage {

    username: string;
    password: string;

    constructor(
        public googlePlus: GooglePlus,
        public afAuth: AngularFireAuth,
        private loadingController: LoadingController,
        public router: Router,
        public alertController: AlertController,
        private authService: AuthService,
    ) { }

    async presentAlert() {
        return await this.alertController.create({
            buttons: ['OK']
        });
    }

    async ionViewWillEnter() {
        const myState = await this.authService.authenticated();
        if (myState) { this.router.navigate(['/home']); }
    }


    async googleSignIn() {
        const loading = await this.presentLoading();
        loading.message = 'Logging in';
        loading.present();
        this.authService.googleSignIn()
            .then(() => {
                loading.dismiss();
                this.router.navigate(['/home']);
            })
            .catch(async err => {
                await loading.dismiss();
                const alert = await this.presentAlert();
                alert.header = 'Error!';
                alert.buttons = ['Dismiss'];
                alert.message = err;
                alert.present();
            });
    }


    emailSignIn() {
        this.authService.emailSignIn(this.username, this.password)
        .then(async() => {
            this.router.navigate(['/home']);
        })
        .catch(e => {
            console.log(e);
        });
    }

    async facebookSignIn() {

    }

    async presentLoading() {
        return await this.loadingController.create();
    }
}

