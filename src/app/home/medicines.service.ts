import { AuthService } from './../services/user/auth.service';
import { Medicine } from './medicines.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
    providedIn: 'root'
})
export class MedicinesService {

    constructor(private authService: AuthService) { }

    defaultMed: Medicine = { id: '1', name: 'Paracetamol', isChecked: true, time: ['12:00', '23:50'], snooze: 8 };

    addMedicine(med: Medicine) {
        const creds = this.authService.credentials();
        const db = firebase.firestore();
        db.collection('users').doc(creds.uid).collection('medicines').add(med)
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    }

    editMedicine(med: Medicine) {
        const creds = this.authService.credentials();
        const db = firebase.firestore();
        db.collection('users').doc(creds.uid).collection('medicines').doc(med.id.toString()).set(med)
            .catch(function (error) {
                console.error('Error adding document: ', error);
            });
    }

    deleteMedicine(med: Medicine) {
        const creds = this.authService.credentials();
        const db = firebase.firestore();
        db.collection('users').doc(creds.uid).collection('medicines').doc(med.id.toString()).delete();
    }

    getMedicine(id: string): Observable<Medicine> {

        const creds = this.authService.credentials();
        const db = firebase.firestore();
        const Ref = db.collection('users').doc(creds.uid);
        return new Observable<Medicine>((observer) => {
            Ref.get().then(() => {
                Ref.collection('medicines').doc(id).get().then(data => {
                    const meds: Medicine = {
                        id : data.id,
                        isChecked: data.data().isChecked,
                        name : data.data().name,
                        time : data.data().time,
                        snooze : data.data().snooze,
                        notes : data.data().notes,
                };
                    observer.next(meds);
                    observer.complete();
                });

            });

        });
    }

    getMedicines(): Observable<Medicine[]> {

        const creds = this.authService.credentials();
        return new Observable<Medicine[]>(observer => {
            const db = firebase.firestore();
            const Ref = db.collection('users').doc(creds.uid);
            Ref.get().then(res => {
                // console.log(res.data());
            });
            Ref.collection('medicines').onSnapshot(res => {
                const medicines: Medicine[] = [];
                res.forEach(data => {
                    const meds: Medicine = {
                        id : data.id,
                        isChecked: data.data().isChecked,
                        name : data.data().name,
                        time : data.data().time,
                        snooze : data.data().snooze,
                        notes : data.data().notes,
                };
                    medicines.push(meds);
                });

                observer.next(medicines);
                observer.complete();
            });
        });
    }
}
