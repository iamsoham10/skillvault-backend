import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CollectionSearchAPIResponse } from '../models/collection.interface';
import { Observable } from 'rxjs';
import {
  ResourcecAPIResponse,
  ResourceSearchAPIResponse,
} from '../models/resource.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private http = inject(HttpClient);

  getResources(
    collection_id: string,
    page: number,
    limit: number
  ): Observable<ResourcecAPIResponse> {
    return this.http.get<ResourcecAPIResponse>(
      `${environment.RESOURCE_API}all-resources?collection_id=${collection_id}&page=${page}&limit=${limit}`
    );
  }

  searchResources(
    collection_id: string,
    search: string
  ): Observable<ResourceSearchAPIResponse> {
    return this.http.post<ResourceSearchAPIResponse>(
      `${environment.RESOURCE_API}search?collection_id=${collection_id}&search=${search}`,
      {}
    );
  }
}
