import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

import { Trans } from '../../models/trans.model';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TransService {
  transCollection: AngularFirestoreCollection<Trans>;
  trans: Observable<Trans[]>;
  transDoc: AngularFirestoreDocument<Trans>;

  constructor(private afs: AngularFirestore) { 
    this.transCollection = this.afs.collection('trans');

    this.trans = this.afs.collection('trans').snapshotChanges().pipe(map(changes => {
      return changes.map(a=>{
        const data = a.payload.doc.data() as Trans
        data.tid = a.payload.doc.id;
        return data;
      });
    }));
  }

  getTrans(){
    return this.trans;
  }

  addTrans(trans: Trans){
    this.transCollection.add(trans);
  }
}
