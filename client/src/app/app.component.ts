import { Component } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import {Toast} from 'primeng/toast';
import { ToastModule } from 'primeng/toast';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [Dialog, ButtonModule, InputTextModule, Toast, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService, PrimeIcons]
})
export class AppComponent {
  constructor(private messageService: MessageService) {}
  title = 'skillvault';
  visible: boolean = false;

  show() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Message Content',
      life: 3000,
    });
  }
  showDialog() {
    this.visible = true;
  }
  toggleDarkMode() {
    const element = document.querySelector('html');
    if(element !== null){
      element.classList.toggle('my-app-dark');
    }
}
}
