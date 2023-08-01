export interface OverpassResultTags {
  amenity?: string;
  cuisine?: string;
  name: string;
}

export interface OverpassCoords {
  lat: number;
  lon: number;
}

export interface OverpassResult {
  id: string;
  tags: OverpassResultTags;
  center: OverpassCoords;
}
