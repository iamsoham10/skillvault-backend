import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Resource } from '../../../models/resource.model';

@Component({
  selector: 'app-resource-drawer',
  imports: [],
  templateUrl: './resource-drawer.component.html',
  styleUrl: './resource-drawer.component.css',
})
export class ResourceDrawerComponent {
  @Input() resource: Resource | null = null;
  @Output() saveResource = new EventEmitter<Resource>();
  @Output() cancel = new EventEmitter<void>();
}
