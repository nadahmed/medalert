import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerButton, PickerColumn, PickerColumnOption } from '@ionic/core';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.page.html',
  styleUrls: ['./entries.page.scss'],
})
export class EntriesPage implements OnInit {

  constructor(public pickerController: PickerController) { }

  ngOnInit() {
  }
pb:PickerButton[];


  async snoozeTime(){
     this.openPicker(); 
  }

  async openPicker() {
    const picker = await this.pickerController.create({
      buttons: [{
        text: 'Done',
      }],
      columns: this.pickerOpts()
    });
    await picker.present();
  }

  pickerOpts(){
      let columns:PickerColumn[] = [{
          name: 'snooze',
          options: []
      }];

      for (let i=1; i<=60 ; i++){
          let temp:PickerColumnOption = {
              text: i.toString(),
              value: i
          }
        columns[0].options.push(temp);
      }

      return columns;
  }
}


