import { AuthService } from './services/user/auth.service';
import { AuthGuard } from './services/user/auth.guard';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'

export const firebaseConfig = {
    apiKey: "AIzaSyCmJN9aeUk2OccxSUaLcJwSP34oqmqjfkE",
    authDomain: "medalert-fd67a.firebaseapp.com",
    databaseURL: "https://medalert-fd67a.firebaseio.com",
    projectId: "medalert-fd67a",
    storageBucket: "medalert-fd67a.appspot.com",
    messagingSenderId: "690959688562"
}

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      AngularFireModule.initializeApp(firebaseConfig),
      
      AngularFireAuthModule,
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    GooglePlus,
    AuthGuard,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
