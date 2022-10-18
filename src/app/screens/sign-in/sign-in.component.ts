import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Auth, RecaptchaVerifier,RecaptchaParameters } from '@angular/fire/auth';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

enum State{
  LOADING,OTP_READY,UNINITIALISED,
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements AfterViewInit {
  confirmationResult:firebase.auth.ConfirmationResult | null = null
  CountryISO = CountryISO;
  isRecaptchaReady = false;
  PhoneNumberFormat = PhoneNumberFormat;
  State = State
  state = State.UNINITIALISED
	authForm = new FormGroup({
		phoneNumber: new FormControl(undefined, [Validators.required]),
    code: new FormControl('',Validators.compose([Validators.minLength(6),Validators.maxLength(6)]))
	});

  constructor(private auth:Auth, private authService:AuthenticationService, private router:Router) { }

  ngAfterViewInit(): void {
    (window as any).verifier = new RecaptchaVerifier('request-otp', {
      'size': 'invisible',
      'callback': (_response:any) => {
        this.isRecaptchaReady = true;
      }
    },this.auth);
  }

  back(){
    this.state = State.UNINITIALISED
  }

  async requestOTP(){
    this.state = State.LOADING
    this.confirmationResult = await this.authService.requestOTP((this.authForm.value.phoneNumber as any).e164Number,(window as any).verifier)
    this.state = State.OTP_READY
  }

  async verifyOTP(){
    this.state = State.LOADING
    const user = await this.confirmationResult?.confirm(this.authForm.value.code as string)
    if(user) this.router.navigate([''])
  }

}


