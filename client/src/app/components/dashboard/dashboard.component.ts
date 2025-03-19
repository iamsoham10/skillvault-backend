import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CollectionsComponent } from './collections/collections.component';
import { SearchComponent } from './collections/search/search.component';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, CollectionsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
