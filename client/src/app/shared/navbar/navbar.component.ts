import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule, AvatarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  faSignOut = faSignOut;
  userName = 'Soham Chitale';
}
