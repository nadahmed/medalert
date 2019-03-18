
import { AuthService } from './../../services/user/auth.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database'
import { MedicinesService } from 'src/app/home/medicines.service';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent implements OnInit {

  constructor(private authService:AuthService, private medicines:MedicinesService) { }

  ngOnInit() {}

  signOut(){
    firebase.auth().signOut();
  }

  async showCredentials(){
    let cred = await this.authService.credentials();
    console.log(cred);
  }

  showDatabase(){
      this.medicines.getMedicines().subscribe(result=>{
          console.log(result);
      });
  }

}
