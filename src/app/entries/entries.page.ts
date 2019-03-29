
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
        public router: Router
    ) { }

    private donePressed;
    private selection;
    disableDelete = true;
    observable: Subscription;
    id: string;
    medicines: Medicine[];
    times: string[];
    pb: PickerButton[];
    medicine: Medicine = { id: '0', name: '', isChecked: true, time: [], notes: '' };
    picker: HTMLIonPickerElement;


    async ionViewDidEnter() {

        const loading = await this.loadingController.create();
        loading.message = 'Please wait';

        this.id = this.activatedRoute.snapshot.paramMap.get('id');
        if ('new' !== this.id) {
            await loading.present();
            this.observable = this.medicineService.getMedicine(this.id).subscribe(res => {
                const obj: Medicine = {
                    id: res.id,
                    name: res.name,
                    isChecked: res.isChecked,
                    time: res.time,
                    notes: res.notes,
                };
                this.medicine = obj;
            },
                e => { },
                async () => {
                    await loading.dismiss();
                    this.disableDelete = false;
                    this.observable.unsubscribe();
                }
            );

        } else {
            this.disableDelete = true;
        }

    }
    selected(ev, index) {
        this.medicine.time[index].time = ev.detail.value.toString();
    }

    ionViewWillLeave() {
        if ('new' !== this.id) {
            this.observable.unsubscribe();
        }
    }

    addTime() {
        const d = new Date();
        const hours = d.getHours();
        const minutes = d.getMinutes();
        let hoursString: string = hours.toString();
        let minutesString: string = minutes.toString();

        if (hours < 10) { hoursString = '0' + hoursString; }
        if (minutes < 10) { minutesString = '0' + minutesString; }
        const obj = { beforeMeal: true, time: hoursString + ':' + minutesString };
        this.medicine.time.push(obj);
    }

    removeTime(index) {
        this.medicine.time.splice(index, 1);
    }

    mealHandler(ev, i) {

        this.medicine.time[i].beforeMeal = ev.detail.value === 'true';
    }

    toggleHandler(ev) {
        if ('new' !== this.id) {
        this.medicineService.updateToggle(this.medicine, ev.detail.checked);
        } else {
            this.medicine.isChecked = ev.detail.checked;
        }
     }

    // async snoozeTime() {
    //     this.picker = await this.pickerController.create({
    //         buttons: [{
    //             text: 'Done',
    //             handler: () => { this.pickerHandler(); return true; }
    //         }],
    //         columns: this.pickerOpts()
    //     });
    //     await this.picker.present();
    //     this.picker.onDidDismiss().then(() => {
    //         this.picker.getColumn('snooze')
    //             .then((res) => {
    //                 console.log(res);
    //                 console.log(res.selectedIndex);
    //                 if (this.donePressed) {
    //                     // tslint:disable-next-line: radix
    //                     this.medicine.snooze = parseInt(res.options[res.selectedIndex].value);
    //                     this.donePressed = false;
    //                     this.selection = res.selectedIndex;
    //                 }
    //             });
    //     });
    // }

    pickerHandler() {
        this.donePressed = true;
    }

    pickerOpts() {
        const columns: PickerColumn[] = [{
            name: 'snooze',
            options: [],
            selectedIndex: this.selection,
            prefix: 'Snooze for',
            suffix: 'minutes'
        }];

        for (let i = 1; i <= 60; i++) {
            const temp: PickerColumnOption = {
                text: i.toString(),
                value: i
            };
            columns[0].options.push(temp);
        }

        return columns;
    }

    async save() {
        const loading = await this.loadingController.create();
        loading.message = 'Saving';
        await loading.present();
        if (this.id !== 'new') {
            await this.medicineService.editMedicine(this.medicine);
        } else {
            await this.medicineService.addMedicine(this.medicine);
        }
        await loading.dismiss();
        await this.router.navigate(['/home']);
    }

    async deleteEntry() {
        const loading = await this.loadingController.create();
        loading.message = 'Removing entry';
        await loading.present();
        if (this.id !== 'new') {
            await this.medicineService.deleteMedicine(this.medicine);
        }
        await loading.dismiss();
        await this.router.navigate(['/home']);
    }
}


