
import { MedicinesService } from './../home/medicines.service';
import { Medicine } from './../home/medicines.interface';
import { Component } from '@angular/core';
import { PickerController, LoadingController } from '@ionic/angular';
import { PickerButton, PickerColumn, PickerColumnOption } from '@ionic/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-entries',
    templateUrl: './entries.page.html',
    styleUrls: ['./entries.page.scss'],
})
export class EntriesPage {

    constructor(
        public pickerController: PickerController,
        private activatedRoute: ActivatedRoute,
        private medicineService: MedicinesService,
        private loadingController: LoadingController,
        public router:Router
    ) { }

    private donePressed;
    private selection;
    observable: Subscription;
    id: string;
    medicines: Medicine[];
    times:string[];
    pb: PickerButton[];
    medicine: Medicine = { id: '1', name: '', isChecked: true, time: [], snooze: 2, notes: '' };
    picker: HTMLIonPickerElement;


    async ionViewDidEnter() {
        
        let loading = await this.loadingController.create();
        loading.message = 'Please wait';

        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        if ('new' != this.id) {
            await loading.present();
            this.observable = this.medicineService.getMedicine(this.id).subscribe(res => {
                 let obj:Medicine={
                    id: res.id,
                    name: res.name,
                    isChecked: res.isChecked,
                    time: res.time,
                    snooze: res.snooze,
                    notes: res.notes,  
                 } 
                 this.medicine = obj;
            },
                e => { },
                async () => {
                    await loading.dismiss();
                    this.observable.unsubscribe();
                    console.log(this.medicine.time);
                }
            );
            this.selection = this.medicine.snooze - 1;

        }


    }
    selected(ev, index){
        this.medicine.time[index]=ev.detail.value.toString();
        //this.medicine.time[index]='01:20';
        console.log(ev.detail.value);
        console.log(this.medicine.time);
      }

    ionViewWillLeave() {
        if ('new' != this.id) {
        this.observable.unsubscribe();
        }
    }

    addTime() {
        let d = new Date();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let hoursString: string = hours.toString();
        let minutesString: string = minutes.toString();

        if (hours < 10) { hoursString = "0" + hoursString; }
        if (minutes < 10) { minutesString = "0" + minutesString; }

        this.medicine.time.push(hoursString + ':' + minutesString);
        console.log(hoursString + ':' + minutesString);
    }


    async snoozeTime() {
        this.picker = await this.pickerController.create({
            buttons: [{
                text: 'Done',
                handler: () => { this.pickerHandler(); return true }
            }],
            columns: this.pickerOpts()
        })
        await this.picker.present();
        this.picker.onDidDismiss().then(() => {
            this.picker.getColumn('snooze')
                .then((res) => {
                    console.log(res);
                    console.log(res.selectedIndex);
                    if (this.donePressed) {
                        this.medicine.snooze = parseInt(res.options[res.selectedIndex].value);
                        this.donePressed = false;
                        this.selection = res.selectedIndex;
                    }
                })
        });
    }

    pickerHandler() {
        console.log('done button pressed');
        this.donePressed = true;
    }

    pickerOpts() {
        let columns: PickerColumn[] = [{
            name: 'snooze',
            options: [],
            selectedIndex: this.selection,
            prefix: 'Snooze for',
            suffix: 'minutes'
        }];

        for (let i = 1; i <= 60; i++) {
            let temp: PickerColumnOption = {
                text: i.toString(),
                value: i
            }
            columns[0].options.push(temp);
        }

        return columns;
    }

    async save() {
        let loading = await this.loadingController.create();
        loading.message = 'Saving';
        await loading.present();
        console.log(this.medicine);
        console.log(this.medicine.time);
        await this.medicineService.addMedicine(this.medicine);
        await loading.dismiss();
        await this.router.navigate(['/home']);
    }
}


