import {Component, inject, OnDestroy, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EmailService} from '../../../services/email-service';
import { InputOtp } from 'primeng/inputotp';
import { FormsModule } from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-otp-section',
  imports: [FormsModule, InputOtp, Button, ReactiveFormsModule],
  templateUrl: './otp-section.component.html',
})

export class OtpSectionComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private otpService = inject(EmailService);
  private authService = inject(AuthService);

  email = this.otpService.email;
  otpForm: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6)]],
  });

  private otpFormState = signal({otp: ''});
  private otpFormSubmission = this.otpForm.valueChanges.subscribe(otpFormValue => {
    this.otpFormState.set(otpFormValue);
    // console.log(otpFormValue);
  });

  onOtpSubmit() {
    if (this.otpForm.valid) {
      const otpValidationObject = {
        email: this.email(),
        otp: this.otpForm.value.otp
      }
      console.log(this.otpForm.value.otp);
      this.authService.otp(otpValidationObject).subscribe({
        next: response => {
          console.log(response);

        },
        error: err => {
          console.log(err);
        }
      })
    }
  }
  ngOnDestroy() {
    this.otpFormSubmission.unsubscribe();
  }
}
