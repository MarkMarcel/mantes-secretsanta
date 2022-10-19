import { Injectable } from '@angular/core';
import { ConfirmationResult, getAuth, RecaptchaVerifier, signInWithPhoneNumber,signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly auth = getAuth()

  constructor() { }

  async signOut(): Promise<void> {
    return await signOut(this.auth)
  }

  async requestOTP(phoneNumber: string, verifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    return await signInWithPhoneNumber(this.auth,phoneNumber, verifier)
  }

}
