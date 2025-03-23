import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CollectionsComponent } from './collections/collections.component';
import {AddCollectionComponent} from './collections/add-collection/add-collection.component';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, CollectionsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
