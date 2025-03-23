import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  imports: [FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  faSignOut = faSignOut;
}
