import { MedicinesService } from './medicines.service';
import { Medicines } from './medicines.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { OptionComponent } from '../settings/option/option.component';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy, OnInit{
    
    
      constructor(public popoverController:PopoverController, public router:Router, public medicineService:MedicinesService){

      }
    form:Medicines[];
    
async ngOnInit(){
        this.form = await this.medicineService.getMedicines()
      }

      ngOnDestroy(){
          this.popoverController.dismiss();
      }

      async presentPopover(ev: any) {
        const popover = await this.popoverController.create({
          component: OptionComponent,
          event: ev,
          translucent: false
        });
        return await popover.present();
      }

      edit(entry){
            this.router.navigate(['/entries/'+entry.id]);
      }

      toggle(entry){
          console.log(this.form[entry.id-1]);
          this.medicineService.form[entry.id-1].isChecked = entry.isChecked;
      }

      fabButton(){
          this.router.navigate(['/entries/'+(this.form.length+1)]);
      }
}
