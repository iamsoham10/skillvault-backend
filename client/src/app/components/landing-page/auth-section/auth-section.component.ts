import {Component, inject, OnDestroy, resource, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {single} from 'rxjs';

@Component({
  selector: 'app-auth-section',
  imports: [DialogModule, ButtonModule, InputTextModule, CommonModule, PasswordModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth-section.component.html',
  styleUrl: './auth-section.component.css'
})
export class AuthSectionComponent implements OnDestroy {
  value = ''
  visible = false;
  isLoginMode = true;

  showDialog(): void {
    this.visible = true;
  }

  onClose(): void {
    this.visible = false;
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  loginFormState = signal({email: '', password: ''}); // signal for form state
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // subscribe to form changes and update the signal
  private formSubmission = this.loginForm.valueChanges.subscribe(value => {
    this.loginFormState.set(value);
    console.log(this.loginFormState());
  })


  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      this.authService.login(this.loginForm.value).subscribe({
        next: response => {
          console.log(response);
        },
        error: err => {
          this.errorMessage.set(err.message);
          console.log(err);
        },
        complete: () => {
          this.loading.set(false);
        }
      })
    }
  }
  ngOnDestroy() {
    this.formSubmission.unsubscribe();
  }
}
