import { AuthService } from './../services/user/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    username: string;
    password: string;
    password2: string;
    errorText: string;

    async createAccount() {
        if (this.password !== this.password2) {
            this.errorText = 'Password does not match.';
        } else if (this.username === '') {
            this.errorText = 'Please enter a valid email address';
        } else {
            this.errorText = '';
            this.authService.register(this.username, this.password)
            .then(async() => {
                await this.router.navigate(['/home']);
            }).catch(e => {
                this.errorText = e.message;
            });
        }

    }

    ngOnInit() {
    }

}
