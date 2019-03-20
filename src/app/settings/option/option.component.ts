
import { AuthService } from './../../services/user/auth.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { MedicinesService } from 'src/app/home/medicines.service';

@Component({
    selector: 'app-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss'],
})
export class OptionComponent implements OnInit {

    constructor(private authService: AuthService, private medicines: MedicinesService) { }

    ngOnInit() { }

    async signOut() {
        await firebase.auth().signOut();
    }

    showCredentials() {
    }

    showDatabase() {
    }

}
