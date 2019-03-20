import { Subscription } from 'rxjs';
import { AuthService } from './../services/user/auth.service';
import { MedicinesService } from './medicines.service';
import { Medicine } from './medicines.interface';
import { Component } from '@angular/core';
import { OptionComponent } from '../settings/option/option.component';
import { PopoverController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    medicines: Medicine[];
    private observable: Subscription;

    constructor(
        public popoverController: PopoverController,
        public router: Router,
        public medicineService: MedicinesService,
        public authService: AuthService,
        public loadingController: LoadingController
    ) { }

    user = {
        displayName: '',
        email: '',
        photoURL: ''
    };
private temp: Medicine[];
    async ionViewDidEnter() {
        const loading = await this.loadingController.create();
        loading.message = 'Getting your prescriptions';
        await loading.present();
        this.observable = this.medicineService.getMedicines().subscribe(res => {
            this.temp = res;
        }, e => {},
        async () => {
            this.medicines = this.temp;
            await loading.dismiss();
        });
        this.user = this.authService.credentials();
    }

    async ionViewDidLeave() {
        this.medicines = [];
        this.observable.unsubscribe();
    }

    async presentPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: OptionComponent,
            event: ev,
            translucent: false
        });
        popover.onclick = async () => await popover.dismiss();
        return await popover.present();
    }

    async edit(entry) {
        await this.router.navigate(['/entries', entry.id]);
    }

    toggle(entry) {
        console.log(this.medicines.indexOf(entry));
        // this.medicineService.form[entry.id - 1].isChecked = entry.isChecked;
    }

    async fabButton() {
        await this.router.navigate(['/entries', 'new']);
    }

}
