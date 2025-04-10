import { Resource } from './resource.model';

export interface ResourceAPIResponse {
  resources: {
    resources: Resource[];
    totalResources: number;
  };
}

export interface ResourceAddAPIResonse {
  resource: Resource;
}

export interface ResourceSearchAPIResponse {
  resources: Resource[];
}
