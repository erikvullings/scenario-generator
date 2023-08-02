export type OsmType = { id?: string; name: string; key: string; value: string };

export const OsmTypes: OsmType[] = [
  { id: 'airport', name: 'Airport', key: 'aeroway', value: 'aerodrome' },
  { id: 'cafe', name: 'Cafe', key: 'amenity', value: 'bar' },
  { id: 'church', name: 'Church', key: 'building', value: 'church' },
  { id: 'city_square', name: 'City square', key: 'place', value: 'square' },
  {
    id: 'flats',
    name: 'Flats',
    key: '"building:levels"',
    value: '"([6-9]|d{2,})"',
  },
  { id: 'gas_station', name: 'Gas station', key: 'amenity', value: 'fuel' },
  { id: 'hospital', name: 'Hospital', key: 'amenity', value: 'hospital' },
  { id: 'hotel', name: 'Hotel', key: 'tourism', value: 'hotel' },
  { id: 'palace', name: 'Palace', key: 'castle_type', value: 'palace' },
  { id: 'parking', name: 'Parking', key: 'amenity', value: 'parking' },
  { id: 'restaurant', name: 'Restaurant', key: 'amenity', value: 'restaurant' },
  {
    id: 'shopping_street',
    name: 'Shopping street',
    key: 'highway',
    value: 'pedestrian',
  },
  { id: 'stadspoort', name: 'Stadspoort', key: 'historic', value: 'city_gate' },
  { id: 'statue', name: 'Statue', key: 'memorial', value: 'statue' },
];
