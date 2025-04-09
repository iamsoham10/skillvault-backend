import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Resource } from '../../models/resource.model';
import { ResourceService } from '../../services/resource.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-resources-page',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './resources-page.component.html',
  styleUrl: './resources-page.component.css',
})
export class ResourcesPageComponent implements OnInit {
  userResources = signal<Resource[] | undefined>(undefined);
  collection_ID: string | null = null;
  isResourcesLoading = signal(false);
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private resourceService = inject(ResourceService);

  loadResources(collection_ID: string): void {
    this.isResourcesLoading.set(true);
    this.resourceService
      .getResources(collection_ID, 1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.userResources.set(response.resources.resources);
          this.isResourcesLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.isResourcesLoading.set(false);
        },
      });
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
