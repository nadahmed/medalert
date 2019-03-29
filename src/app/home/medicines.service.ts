import { AuthService } from './../services/user/auth.service';
import { Medicine } from './medicines.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';

@Injectable({
    providedIn: 'root'
})
export class MedicinesService {

    constructor(private authService: AuthService) { }

    defaultMed: Medicine = {
        id: '0',
        name: '',
        isChecked: true,
        time: [
            { beforeMeal: false, time: '00:00' }
        ]
    };

    addMedicine(med: Medicine) {
        const creds = this.authService.credentials();
        const rdb = firebase.database();
        med.id = rdb.ref('users').child(creds.uid).child('medicines').push().key;
        rdb.ref('users/' + creds.uid + '/medicines/' + med.id ).set(med)
        .catch((error) => {
            console.log(error);
        });
    }

    updateToggle(med: Medicine, toggle: boolean) {
        const creds = this.authService.credentials();
        const rdb = firebase.database();
        rdb.ref('/users/' + creds.uid + '/medicines/' + med.id).update({isChecked: toggle});
    }

    editMedicine(med: Medicine) {
        const creds = this.authService.credentials();
        const rdb = firebase.database();
        rdb.ref('users/' + creds.uid + '/medicines/' + med.id).set(med)
        .then(error => console.log(error));

    }

    deleteMedicine(med: Medicine) {
        const creds = this.authService.credentials();
        const rdb = firebase.database();
        rdb.ref('users').child(creds.uid).child('medicines').child(med.id).remove();
    }

    getMedicine(id: string): Observable<Medicine> {

        const creds = this.authService.credentials();
        const rdb = firebase.database();
        const ref = rdb.ref('users/' + creds.uid + '/medicines/' + id);
        return new Observable<Medicine>((observer) => {
            ref.on('value', (snapshot) => {
                    const meds: Medicine = {
                        id: snapshot.val().id,
                        isChecked: snapshot.val().isChecked,
                        name: snapshot.val().name,
                        time: snapshot.val().time,
                        notes: snapshot.val().notes,
                    };
                    observer.next(meds);
                    observer.complete();
                });

            });
    }

    getMedicines(): Observable<Medicine[]> {

        const creds = this.authService.credentials();
        return new Observable<Medicine[]>(observer => {
            const rdb = firebase.database();
            const ref = rdb.ref('/users/' + creds.uid + '/medicines/');
            const medicines: Medicine[] = [];
            ref.on('value', (snapshots) => {
                snapshots.forEach(data => {
                    const meds: Medicine = {
                        id: data.val().id,
                        isChecked: data.val().isChecked,
                        name: data.val().name,
                        time: data.val().time,
                        notes: data.val().notes,
                    };
                    medicines.push(meds);
                });
                observer.next(medicines);
                observer.complete();
            });
        });
    }
}
