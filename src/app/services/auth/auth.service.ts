import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  user$: Observable<User>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) { 
        this.user$ = this.afAuth.authState.pipe(
          switchMap(user => {
            if (user) {
              return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
            } else {
              return of(null);
            }
          })
        )
 
    }

    async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
      this.router.navigate(['dashboard']);
      return this.updateUserDataInit(credential.user);
    }
  
    public updateUserDataInit(user) {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

      let data: User = {
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName, 
        photoURL: user.photoURL
      };
        
      return userRef.set(data, { merge: true });
    }
  
    public updateUserData(user) {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

      console.log(user.income + " " + user.expenses);
      let data: User = {
        uid: user.uid, 
        email: user.email, 
        displayName: user.displayName, 
        photoURL: user.photoURL,
        income: user.income,
        expenses: user.expenses
      };
      
      return userRef.set(data, { merge: true });
    }

    async signOut() {
      await this.afAuth.auth.signOut();
      this.router.navigate(['login']);
    }
}
