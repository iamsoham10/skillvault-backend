import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection } from '../models/collection.model';

interface CollectionAPIResponse {
  AllCollections: {
    collections: Collection[];
    totalNoOfCollections: number;
  };
}
interface CollectionSearchAPIResponse {
  collections: Collection[];
}

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private http = inject(HttpClient);

  getCollections(
    page: number,
    limit: number
  ): Observable<CollectionAPIResponse> {
    return this.http.get<CollectionAPIResponse>(
      `${environment.COLLECTION_API}all-collection?page=${page}&limit=${limit}`
    );
  }

  searchCollections(search: string): Observable<CollectionSearchAPIResponse> {
    return this.http.post<CollectionSearchAPIResponse>(
      `${environment.COLLECTION_API}search-collection?search=${search}`,
      {}
    );
  }
}
