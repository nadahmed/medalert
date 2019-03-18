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
export class LoginPage implements OnInit {

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

    async ngOnInit() {
        let myState = await this.authService.authenticated();
        if (myState) { this.router.navigate(['/home']); }
    }


    async googleSignIn() {
        let loading = await this.presentLoading();
        loading.message = 'Logging in'
        loading.present();
        this.authService.signIn()
            .then(() => {
                loading.dismiss();
                this.router.navigate(['/home']);
            })
            .catch(async err => {
                await loading.dismiss();
                let alert = await this.presentAlert();
                alert.header = 'Error!';
                alert.buttons=['Dismiss'];
                alert.message = err;
                alert.present();
            });
    }


    emailSignIn() {
        this.username = 'i pressed';
        this.router.navigate(['/home']);
    }

    async facebookSignIn() {

    }

    async presentLoading() {
        return await this.loadingController.create();
    }
}

