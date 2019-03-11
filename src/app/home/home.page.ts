import { Component, OnDestroy } from '@angular/core';
import { OptionComponent } from '../settings/option/option.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy{
    public form = [
        { val: 'Paracetamol', isChecked: true },
        { val: 'Asprin', isChecked: false },
        { val: 'Pain killer', isChecked: false },
        { val: 'Anti-biotics', isChecked: false }
      ];

      constructor(public popoverController:PopoverController){

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
}
