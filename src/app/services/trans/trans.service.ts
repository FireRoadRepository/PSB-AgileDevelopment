import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { Trans } from '../../models/trans.model';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class TransService {
  transCollection: AngularFirestoreCollection<Trans>;
  trans: Observable<Trans[]>;

  constructor(private afs: AngularFirestore) { 
  }

  ngOnInit() {
    this.transCollection = this.afs.collection('trans');
    this.trans = this.transCollection.valueChanges();
  }

  getTrans(){
    return this.trans;
  }
}
