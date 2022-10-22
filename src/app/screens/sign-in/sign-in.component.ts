import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Auth, RecaptchaVerifier, ConfirmationResult } from '@angular/fire/auth';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

enum State {
  LOADING, OTP_READY, UNINITIALISED,
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements AfterViewInit {
  confirmationResult: ConfirmationResult | null = null
  CountryISO = CountryISO;
  isRecaptchaReady = false;
  PhoneNumberFormat = PhoneNumberFormat;
  State = State
  state = State.UNINITIALISED
  authForm = new FormGroup({
    phoneNumber: new FormControl(undefined, [Validators.required]),
    code: new FormControl('', Validators.compose([Validators.minLength(6), Validators.maxLength(6)]))
  });

  constructor(
    private _authService: AuthenticationService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _userService: UserService,
  ) { }

  ngAfterViewInit(): void {
    (window as any).verifier = new RecaptchaVerifier('request-otp', {
      'size': 'invisible',
      'callback': (_response: any) => {
        console.log(_response)
        this.isRecaptchaReady = true;
      }
    }, this._authService.auth);
  }

  back() {
    this.state = State.UNINITIALISED
  }

  async requestOTP() {
    if(this.authForm.controls.phoneNumber.invalid){
      this._snackBar.open("Enter valid phone number");
      return;
    }
    this.state = State.LOADING
    try {
      this.confirmationResult = await this._authService.requestOTP((this.authForm.value.phoneNumber as any).e164Number, (window as any).verifier)
      this.state = State.OTP_READY
    } catch (error) {
      this._snackBar.open("Couldn't send code");
      this.back();
      console.log(error);
    }
  }

  async verifyOTP() {
    this.state = State.LOADING
    const user = await this.confirmationResult?.confirm(this.authForm.value.code as string)
    if (user) {
      const hasRegistered = await this._userService.getUserDetails(user.user.uid)
      if (hasRegistered)
        this._router.navigate([''])
      else
        this._router.navigate(['profile'])
    }
  }

}


