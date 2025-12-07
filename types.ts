export interface Park {
  id: string;
  name: string;
  address: string;
  description: string;
  amenities: string[];
  equipment: string[];
  quickTip: string;
  hasShade: boolean;
  hasBenches: boolean;
  hasDogPark: boolean;
  hasRestrooms: boolean;
  hasParking: boolean;
  rating: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  distance?: string;
}

export interface SearchState {
  loading: boolean;
  results: Park[];
  error: string | null;
  searchedLocation: string;
}

export enum ViewMode {
  LIST = 'LIST',
  MAP = 'MAP'
}