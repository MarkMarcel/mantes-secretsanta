import { Injectable } from '@angular/core';
import { ConfirmationResult, getAuth, RecaptchaVerifier, signInWithPhoneNumber,signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly auth = getAuth()

  constructor(private router:Router) { }

  async signOut(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['auth']);
  }

  async requestOTP(phoneNumber: string, verifier: RecaptchaVerifier): Promise<ConfirmationResult> {
    return await signInWithPhoneNumber(this.auth,phoneNumber, verifier);
  }

}
