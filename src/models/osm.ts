export type OsmType = { name: string; key: string; value: string };

export const OsmTypes: OsmType[] = [
  { name: 'Airport', key: 'aeroway', value: 'aerodrome' },
  { name: 'Cafe', key: 'amenity', value: 'bar' },
  { name: 'Church', key: 'building', value: 'church' },
  { name: 'City square', key: 'place', value: 'square' },
  { name: 'Flats', key: '"building:levels"', value: '"([6-9]|d{2,})"' },
  { name: 'Gas station', key: 'amenity', value: 'fuel' },
  { name: 'Hospital', key: 'amenity', value: 'hospital' },
  { name: 'Hotel', key: 'tourism', value: 'hotel' },
  { name: 'Palace', key: 'castle_type', value: 'palace' },
  { name: 'Parking', key: 'amenity', value: 'parking' },
  { name: 'Restaurant', key: 'amenity', value: 'restaurant' },
  { name: 'Shopping street', key: 'highway', value: 'pedestrian' },
  { name: 'Stadspoort', key: 'historic', value: 'city_gate' },
  { name: 'Statue', key: 'memorial', value: 'statue' },
];
