import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Resource } from '../../models/resource.model';
import { ResourceService } from '../../services/resource.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PaginationComponent } from '../../shared/navbar/pagination/pagination.component';
import { AddResourceComponent } from './add-resource/add-resource.component';

@Component({
  selector: 'app-resources-page',
  imports: [
    NavbarComponent,
    CommonModule,
    ProgressSpinnerModule,
    PaginationComponent,
    AddResourceComponent,
  ],
  templateUrl: './resources-page.component.html',
  styleUrl: './resources-page.component.css',
})
export class ResourcesPageComponent implements OnInit {
  userResources = signal<Resource[] | undefined>(undefined);
  collection_ID: string | null = null;
  isResourcesLoading = signal(false);
  totalResources = signal(0);
  page = signal(1);
  limit = signal(10);
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private resourceService = inject(ResourceService);

  loadResources(collection_ID: string): void {
    this.isResourcesLoading.set(true);
    this.resourceService
      .getResources(collection_ID, this.page(), this.limit())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.userResources.set(response.resources.resources);
          this.totalResources.set(response.resources.totalResources);
          this.isResourcesLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isResourcesLoading.set(false);
        },
      });
  }
  loadPage(newPage: number): void {
    this.page.set(newPage);
    this.loadResources(this.collection_ID!);
  }

  onResourceAdded(newResource: Resource) {
    this.loadResources(this.collection_ID!);
  }

  ngOnInit(): void {
    this.collection_ID = this.route.snapshot.paramMap.get('collection_ID');
    if (this.collection_ID) {
      this.loadResources(this.collection_ID);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
