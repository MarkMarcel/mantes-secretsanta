import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Auth, RecaptchaVerifier } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-phone-number-input',
  templateUrl: './phone-number-input.component.html',
  styleUrls: ['./phone-number-input.component.sass']
})
export class PhoneNumberInputComponent implements AfterViewInit {
  
  
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	authForm = new FormGroup({
		phoneNumber: new FormControl(undefined, [Validators.required]),
    code: new FormControl('',Validators.compose([Validators.minLength(6),Validators.maxLength(6)]))
	});

  constructor(private authenticator:AngularFireAuth,private auth:Auth) {
    
    
   }
  ngAfterViewInit(): void {
    (window as any).verifier = new RecaptchaVerifier('test', {
      'size': 'invisible',
      'callback': (_response:any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        ;
      }
    },this.auth);
  }

  

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.authForm.value);
    this.authenticator.signInWithPhoneNumber((this.authForm.value.phoneNumber as any).e164Number,(window as any).verifier).then(confirmation => {
      confirmation.confirm(this.authForm.value.code as string)
    })
  }

}
