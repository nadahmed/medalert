import { MedicinesService } from './../home/medicines.service';
import { Medicines } from './../home/medicines.interface';
import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerButton, PickerColumn, PickerColumnOption } from '@ionic/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';

@Component({
    selector: 'app-entries',
    templateUrl: './entries.page.html',
    styleUrls: ['./entries.page.scss'],
})
export class EntriesPage implements OnInit {

    constructor(
        public pickerController: PickerController,
        private activatedRoute: ActivatedRoute,
        private medicineService: MedicinesService
    ) { }

    private donePressed;
    private selection;
    id: string;
    medicines: Medicines[];
    pb: PickerButton[];
    medicine: Medicines = { id: 1, name: 'None', isChecked: true, time: ['12:00'], snooze: 2, notes: 'Null' };
    picker:HTMLIonPickerElement;

    async ngOnInit() {
        this.medicines = [];
        this.id = await this.activatedRoute.snapshot.paramMap.get('id');
        await this.medicineService.getMedicines()
            .then(res => {
                this.medicines = res;
                this.medicine = this.medicines.map(item => Object.assign({}, item))[parseInt(this.id) - 1];
            });
        this.selection = this.medicine.snooze-1;
    }

    addTime(){

 
    let d= new Date();
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let hoursString:string = hours.toString();
    let minutesString:string = minutes.toString();

    if (hours   < 10) {hoursString   = "0"+hoursString;}
    if (minutes < 10) {minutesString = "0"+minutesString;}
    
        
        this.medicine.time.push(hoursString+':'+minutesString);
        console.log(hoursString+':'+ minutesString);
    }
    register(form) {
        console.log(form);
    }

    async snoozeTime() {
        this.picker= await this.pickerController.create({
            buttons: [{
                text: 'Done',
                handler: ()=>{this.pickerHandler(); return true}
            }],
            columns: this.pickerOpts()
        })
            await this.picker.present();
            this.picker.onDidDismiss().then(()=>{
                this.picker.getColumn('snooze')
                .then((res) => {
                    console.log(res);

                    console.log(res.selectedIndex);
                    if (this.donePressed){
                        this.medicine.snooze = res.options[res.selectedIndex].value;
                        this.donePressed=false;
                        this.selection=res.selectedIndex;
                    }
                })
                .catch(e=>{
                    console.error(e);
                });
            
        });
    
    }

    pickerHandler() {
        console.log('done button pressed');
        this.donePressed=true;
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

    save() {
        console.log(this.medicine);
        console.log(this.medicines[parseInt(this.id) - 1])
    }
}


