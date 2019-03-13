import { Medicines } from './medicines.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicinesService {

  constructor() { }

form:Medicines[] = [
    { id: 1, name: 'Paracetamol', isChecked: true, time: ['12:00', '23:50'], snooze: 8 },
    { id: 2, name: 'Asprin', isChecked: true, time: ['01:00'], snooze: 3,  },
    { id: 3, name: 'Pain killer', isChecked: true, time: ['15:00'], snooze: 5},
    { id: 4, name: 'Anti-biotics', isChecked: true, time: ['16:00'], snooze: 4}
  ];

  getMedicines(){
      return new Promise<Medicines[]>((resolve,reject)=>{
            resolve(this.form);
      });
  }

 
}
