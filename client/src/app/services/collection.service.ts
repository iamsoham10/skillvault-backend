import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Collection} from '../models/collection.model';

interface CollectionAPIResponse {
  AllCollections: {
    collections: Collection[];
  }
}

@Injectable({
  providedIn: "root"
})

export class CollectionService{
  private http = inject(HttpClient);

  getCollections(page: number, limit: number): Observable<CollectionAPIResponse>{
    return this.http.get<CollectionAPIResponse>(`${environment.COLLECTION_API}all-collection?page=${page}&limit=${limit}`);
  }
}
