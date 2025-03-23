import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  OnDestroy,
} from '@angular/core';
import { CollectionService } from '../../../services/collection.service';
import { Collection } from '../../../models/collection.model';
import { NgForOf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faShare } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Subject, takeUntil } from 'rxjs';
import { SearchComponent } from './search/search.component';
import { PaginationComponent } from './pagination/pagination.component';
import { AddCollectionComponent } from './add-collection/add-collection.component';

@Component({
  selector: 'app-collections',
  imports: [
    NgForOf,
    FontAwesomeModule,
    Menu,
    SearchComponent,
    PaginationComponent,
    AddCollectionComponent,
  ],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsComponent implements OnInit, OnDestroy {
  collections = signal<Collection[]>([]);
  isLoading = signal(false);
  collectionFetchError = signal<string | null>(null);
  private destroy$ = new Subject<void>();
  page = signal(1);
  limit = signal(10);
  totalRecords = signal(0);
  faCoffee = faCoffee;
  faDotCircle = faEllipsisV;
  faShare = faShare;
  items: MenuItem[] | undefined;

  private collectionsService = inject(CollectionService);

  ngOnInit() {
    this.items = [
      {
        items: [
          {
            label:
              '<div class="flex items-center gap-2"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M400 255.4l0-15.4 0-32c0-8.8-7.2-16-16-16l-32 0-16 0-46.5 0c-50.9 0-93.9 33.5-108.3 79.6c-3.3-9.4-5.2-19.8-5.2-31.6c0-61.9 50.1-112 112-112l48 0 16 0 32 0c8.8 0 16-7.2 16-16l0-32 0-15.4L506 160 400 255.4zM336 240l16 0 0 48c0 17.7 14.3 32 32 32l3.7 0c7.9 0 15.5-2.9 21.4-8.2l139-125.1c7.6-6.8 11.9-16.5 11.9-26.7s-4.3-19.9-11.9-26.7L409.9 8.9C403.5 3.2 395.3 0 386.7 0C367.5 0 352 15.5 352 34.7L352 80l-16 0-32 0-16 0c-88.4 0-160 71.6-160 160c0 60.4 34.6 99.1 63.9 120.9c5.9 4.4 11.5 8.1 16.7 11.2c4.4 2.7 8.5 4.9 11.9 6.6c3.4 1.7 6.2 3 8.2 3.9c2.2 1 4.6 1.4 7.1 1.4l2.5 0c9.8 0 17.8-8 17.8-17.8c0-7.8-5.3-14.7-11.6-19.5c0 0 0 0 0 0c-.4-.3-.7-.5-1.1-.8c-1.7-1.1-3.4-2.5-5-4.1c-.8-.8-1.7-1.6-2.5-2.6s-1.6-1.9-2.4-2.9c-1.8-2.5-3.5-5.3-5-8.5c-2.6-6-4.3-13.3-4.3-22.4c0-36.1 29.3-65.5 65.5-65.5l14.5 0 32 0zM72 32C32.2 32 0 64.2 0 104L0 440c0 39.8 32.2 72 72 72l336 0c39.8 0 72-32.2 72-72l0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64c0 13.3-10.7 24-24 24L72 464c-13.3 0-24-10.7-24-24l0-336c0-13.3 10.7-24 24-24l64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L72 32z"/></svg><span> Share</span></div>',
            escape: false,
            command: (event) => this.shareCollection(),
          },
          {
            label: `<div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg><span> Delete</span></div>`,
            escape: false,
            command: (event) => this.deleteCollection(),
          },
        ],
      },
    ];
    this.loadCollections();
  }

  deleteCollection() {
    console.log('Delete collection');
  }

  shareCollection() {
    console.log('Share collection');
  }

  loadPage(newPage: number): void {
    this.page.set(newPage);
    this.loadCollections();
  }

  loadCollections(): void {
    this.isLoading.set(true);
    this.collectionFetchError.set(null);

    this.collectionsService
      .getCollections(this.page(), this.limit())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.collections.set(response.AllCollections.collections);
          this.totalRecords.set(response.AllCollections.totalNoOfCollections);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.collectionFetchError.set('Failed to load collections');
          this.isLoading.set(false);
          console.error('Error loading collections', err);
        },
      });
  }

  updateCollections(newCollections: Collection[]): void {
    this.collections.set(newCollections);
  }

  onCollectionAdded(newCollection: Collection) {
    this.collections.update((collection) => {
      collection.push(newCollection);
      return collection;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
