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
import { CommonModule, NgForOf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee, faShare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { SearchComponent } from './search/search.component';
import { PaginationComponent } from './pagination/pagination.component';
import { AddCollectionComponent } from './add-collection/add-collection.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-collections',
  imports: [
    NgForOf,
    FontAwesomeModule,
    SearchComponent,
    PaginationComponent,
    AddCollectionComponent,
    ProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionsComponent implements OnInit, OnDestroy {
  collections = signal<Collection[] | undefined>(undefined);
  isLoading = signal(false);
  collectionFetchError = signal<string | null>(null);
  private destroy$ = new Subject<void>();
  page = signal(1);
  limit = signal(10);
  totalRecords = signal(0);
  faCoffee = faCoffee;
  faDotCircle = faEllipsisV;
  faShare = faShare;
  faTrash = faTrash;

  private collectionsService = inject(CollectionService);
  private userService = inject(UserService);

  openMenu: string | null = null;

  toggleMenu(title: string) {
    this.openMenu = this.openMenu === title ? null : title;
  }

  ngOnInit() {
    this.loadCollections();
  }

  deleteCollection(collection: Collection) {
    console.log('deleted');
    const collection_ID = collection._id;
    const user_ID = this.userService.getUserID();
    this.collectionsService
      .deleteCollection(collection_ID, user_ID ?? '')
      .subscribe({
        next: () => {
          console.log('Collection deleted successfully');
          this.collections.update((currentCollections) => {
            if (currentCollections) {
              return currentCollections.filter(
                (collection) => collection._id !== collection_ID
              );
            }
            return currentCollections;
          });
        },
        error: (err) => {
          console.error('Error deleting collection', err);
        },
      });
    this.openMenu = null;
  }

  shareCollection() {
    console.log('Share collection');
    this.openMenu = null;
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
      if (collection === undefined) {
        return [newCollection];
      } else {
        collection.push(newCollection);
        return collection;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
