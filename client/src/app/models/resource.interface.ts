import { Resource } from './resource.model';

export interface ResourcecAPIResponse {
  resources: {
    resources: Resource[];
    totalResources: number;
  };
}

export interface ResourceSearchAPIResponse {
  resources: Resource[];
}
