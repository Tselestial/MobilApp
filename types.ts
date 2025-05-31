export interface MarkerData {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  images: string[];
}

export interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface MarkerImage {
  id: number;
  marker_id: number;
  uri: string;
  created_at: string;
}