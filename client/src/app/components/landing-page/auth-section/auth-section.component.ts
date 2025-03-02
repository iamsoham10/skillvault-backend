import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-auth-section',
  imports: [DialogModule, ButtonModule, InputTextModule, CommonModule, PasswordModule],
  templateUrl: './auth-section.component.html',
  styleUrl: './auth-section.component.css'
})
export class AuthSectionComponent {
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
}
