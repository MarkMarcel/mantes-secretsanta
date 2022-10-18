import { Injectable } from '@angular/core';
import { AngularFireAuth, } from '@angular/fire/compat/auth';
import { RecaptchaVerifier } from '@angular/fire/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private authenticator: AngularFireAuth) { }

  async signOut(): Promise<void> {
    return await this.authenticator.signOut()
  }

  async requestOTP(phoneNumber: string, verifier: RecaptchaVerifier): Promise<firebase.auth.ConfirmationResult> {
    return await this.authenticator.signInWithPhoneNumber(phoneNumber, verifier)
  }

}
