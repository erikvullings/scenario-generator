export type DataModel = {
  version?: number;
  lastUpdate?: number;
  scenario: Scenario;
};

export type InconsistencyType = 'partly' | 'totally';

/** Old inconsistency type */
export type Inconsistency = {
  ids: [from: string, to: string];
  type: InconsistencyType;
};

/**
 * New inconsistency type, where the key
 * is a combination of the row ID and col ID,
 * sorted alphabetically.
 */
export type Inconsistencies = {
  [key: string]: boolean;
};

export type Item = {
  id: ID;
  label: string;
  /** Description of the item, may use markdown */
  desc: string;
};

export type ContextType = 'none' | 'location' | 'locationType';
export type LocationType = 'name' | 'coords';
export type LocationTypeType = 'list' | 'keyValue';

export type ContextualItem = Item & {
  context: ContextType;
  /** Location name, e.g. the name of a city or landmark */
  location?: string;
  /** Type of location when the context is location, e.g. name or coordinates */
  locationType?: LocationType;
  /** Type of location when the context is locationType, e.g. pick from a default list or OSM key value */
  locationTypeType?: LocationType;
  /** Location's latitude, WGS84 */
  lat?: number;
  /** Location's longitude, WGS84 */
  lon?: number;
  /** OSM type */
  osmTypeId?: string;
  /** OSM attribute key */
  key?: string;
  /** OSM attribute value */
  value?: string;
};

export type Narrative = Item & {
  /** componentID => a component's valueId */
  components: { [key: string]: string };
  /** Is the narrative included in the final set of narratives or a temporary scenario, just in case */
  included: boolean;
};

export type Scenario = Item & {
  inconsistencies: Inconsistencies;
  categories: Category[];
  components: ScenarioComponent[];
  // components: ScenarioComponent[];
};

export type Category = Item & {
  componentIds: ID[];
};

export type ScenarioComponent = Item & {
  values: ContextualItem[];
};

export const defaultModel = {
  version: 1,
  lastUpdate: new Date().valueOf(),
  scenario: {
    id: 'demo1',
    label: 'Demo',
    desc: 'Demo scenario',
    inconsistencies: {} as Inconsistencies,
    categories: [
      {
        id: 'threat',
        label: 'Threat',
        componentIds: [
          'ThreatDirection',
          'Impact',
          'Motivation',
          'ModusOperandiDuringExecution',
          'Equipment',
          'Responsibility',
        ],
      },
      {
        id: 'context',
        label: 'Context',
        componentIds: [
          'WeatherType',
          'WeatherBehaviour',
          'TypeOfObject',
          'AvailableBudget',
          'OpenCompartments',
          'Location',
        ],
      },
    ],
    components: [
      {
        id: 'ThreatDirection',
        label: 'Threat direction',
        values: [
          { id: 'df62efe6', label: 'Hannibal' },
          { id: '70630364', label: 'The Romans' },
          { id: '82d5d4f5', label: 'Verweggistan' },
        ],
      },
      {
        id: 'Impact',
        label: 'Impact',
        values: [
          { id: '5c532a23', label: 'Low' },
          { id: '16ad9a77', label: 'Medium' },
          { id: 'b894abb6', label: 'High' },
        ],
      },
      {
        id: 'Motivation',
        label: 'Motivation',
        values: [
          { id: 'f4ab7a7a', label: 'Money' },
          { id: 'ff550f8f', label: 'Justice' },
          { id: '22b4867e', label: 'Revenge' },
        ],
      },
      {
        id: 'ModusOperandiDuringExecution',
        label: 'Modus operandi during execution',
        values: [
          {
            id: '7ed25fa5',
            label: 'Sniper attack',
            type: 'ModusOperandiDuringExecution',
          },
          {
            id: '1f9b68c9',
            label: 'Kidnapping',
            type: 'ModusOperandiDuringExecution',
          },
          {
            id: '5cc5e352',
            label: 'Singing',
            type: 'ModusOperandiDuringExecution',
          },
        ],
      },
      {
        id: 'Equipment',
        label: 'Equipment',
        values: [
          { id: 'b4218a1f', label: 'None' },
          { id: '8f6185f7', label: 'Drone' },
          { id: 'cb02878d', label: 'Bomb' },
          { id: '9d645efb', label: 'Helicopter' },
          { id: '3a4398c7', label: 'Hammer' },
        ],
      },
      {
        id: 'Responsibility',
        label: 'Responsibility',
        values: [
          { id: 'f44d22be', label: 'Private' },
          { id: '20f9a6ed', label: 'Public' },
        ],
      },
      {
        id: 'WeatherType',
        label: 'Weather type',
        values: [
          { id: 'b9fe2b73', label: 'Rainy' },
          { id: '478581c1', label: 'Sunny' },
          { id: 'b855ac10', label: 'Windy' },
          { id: '24c73f36', label: 'Cloudy' },
        ],
      },
      {
        id: 'WeatherBehaviour',
        label: 'Weather behaviour',
        values: [
          { id: '0ff8041e', label: 'Stable' },
          { id: '894a9bcb', label: 'Changing' },
        ],
      },
      {
        id: 'TypeOfObject',
        label: 'Type of object',
        values: [
          { id: '29a303b3', label: 'Church' },
          { id: '2e7df143', label: 'Park' },
          { id: 'e11282fb', label: 'Palace' },
          { id: '9a1b3256', label: 'Airport' },
        ],
      },
      {
        id: 'AvailableBudget',
        label: 'Available budget',
        values: [
          { id: '90e1ba48', label: 'Knowledge' },
          { id: 'f961174c', label: 'Water' },
        ],
      },
      {
        id: 'OpenCompartments',
        label: 'Open compartments',
        values: [
          { id: '01c3940a', label: 'Open' },
          { id: '56b7fa45', label: 'Closed' },
        ],
      },
      {
        id: 'Location',
        label: 'Location',
        values: [
          { id: 'ea57f820', label: 'Vietnam' },
          { id: 'b8bd8bc3', label: 'Washington' },
          { id: '8fb1e1ab', label: 'Buitenpost' },
        ],
      },
    ],
  },
} as DataModel;

export type ID = string;

export type User = {
  id: ID;
  name: string;
  phone?: string;
  email?: string;
  url?: string;
  isAuthor?: boolean;
};

export type PageInfo = {
  offsetX: number;
  offsetY: number;
  fontHeight: number;
  line: string;
};

export type EnrichedPageInfo = PageInfo & {
  style: string;
  indented: boolean;
  join: boolean;
  startParagraph: boolean;
  /** Timestamp of the subsequent content blocks */
  timestamp?: number;
};

export type Page = {
  pageNumber: number;
  pageInfo: PageInfo[];
};

export type Log = {
  timestamp?: number;
  author?: string;
  grip?: number;
  blocks: EnrichedPageInfo[];
};

export type TimelineEventType = {
  /** Number representing a JS date */
  timestamp: number;
  /** Index in the logbook that use this timestamp */
  logIndex: number;
  // kind: 'melding' | 'bob' | 'gms' | 'edit';
  // summary?: string;
  author?: string;
};
