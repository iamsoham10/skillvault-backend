import {Component, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-auth-section',
  imports: [DialogModule, ButtonModule, InputTextModule, CommonModule, PasswordModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth-section.component.html',
  styleUrl: './auth-section.component.css'
})
export class AuthSectionComponent {
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

  loginForm: FormGroup;
  loginFormState = signal({email: '', password: ''});
  constructor(private fb: FormBuilder, private authService: AuthService ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    // subscribe to form changes and update the signal
    this.loginForm.valueChanges.subscribe(value => {
      this.loginFormState.set(value);
    })
  }
  onSubmit(){
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      })
    }
  }
}
