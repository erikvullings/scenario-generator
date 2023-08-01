export type DataModel = {
  version?: number;
  lastUpdate?: number;
  scenario: Scenario;
};

export type InconsistencyType = 'partly' | 'totally';

export type Inconsistency = {
  ids: [from: string, to: string];
  type: InconsistencyType;
};

export type Item = {
  id: ID;
  name: string;
  /** Description of the item, may use markdown */
  desc: string;
};

export type Narrative = Item & {
  /** componentID => a component's valueId */
  components: { [key: string]: string };
  /** Is the narrative included in the final set of narratives or a temporary scenario, just in case */
  included: boolean;
};

export type Scenario = Item & {
  inconsistencies: Inconsistency[];
  categories: Category[];
  components: ScenarioComponent[];
  // components: ScenarioComponent[];
};

export type Category = Item & {
  componentIds: ID[];
};

export type ScenarioComponent = Item & {
  values: Item[];
};

export const defaultModel = {
  version: 1,
  lastUpdate: new Date().valueOf(),
  scenario: {
    id: 'demo1',
    name: 'Demo',
    desc: 'Demo scenario',
    inconsistencies: [] as Inconsistency[],
    categories: [
      {
        id: 'threat',
        name: 'Threat',
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
        name: 'Context',
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
        name: 'Threat direction',
        values: [
          { id: 'df62efe6', name: 'Hannibal' },
          { id: '70630364', name: 'The Romans' },
          { id: '82d5d4f5', name: 'Verweggistan' },
        ],
      },
      {
        id: 'Impact',
        name: 'Impact',
        values: [
          { id: '5c532a23', name: 'Low' },
          { id: '16ad9a77', name: 'Medium' },
          { id: 'b894abb6', name: 'High' },
        ],
      },
      {
        id: 'Motivation',
        name: 'Motivation',
        values: [
          { id: 'f4ab7a7a', name: 'Money' },
          { id: 'ff550f8f', name: 'Justice' },
          { id: '22b4867e', name: 'Revenge' },
        ],
      },
      {
        id: 'ModusOperandiDuringExecution',
        name: 'Modus operandi during execution',
        values: [
          {
            id: '7ed25fa5',
            name: 'Sniper attack',
            type: 'ModusOperandiDuringExecution',
          },
          {
            id: '1f9b68c9',
            name: 'Kidnapping',
            type: 'ModusOperandiDuringExecution',
          },
          {
            id: '5cc5e352',
            name: 'Singing',
            type: 'ModusOperandiDuringExecution',
          },
        ],
      },
      {
        id: 'Equipment',
        name: 'Equipment',
        values: [
          { id: 'b4218a1f', name: 'None' },
          { id: '8f6185f7', name: 'Drone' },
          { id: 'cb02878d', name: 'Bomb' },
          { id: '9d645efb', name: 'Helicopter' },
          { id: '3a4398c7', name: 'Hammer' },
        ],
      },
      {
        id: 'Responsibility',
        name: 'Responsibility',
        values: [
          { id: 'f44d22be', name: 'Private' },
          { id: '20f9a6ed', name: 'Public' },
        ],
      },
      {
        id: 'WeatherType',
        name: 'Weather type',
        values: [
          { id: 'b9fe2b73', name: 'Rainy' },
          { id: '478581c1', name: 'Sunny' },
          { id: 'b855ac10', name: 'Windy' },
          { id: '24c73f36', name: 'Cloudy' },
        ],
      },
      {
        id: 'WeatherBehaviour',
        name: 'Weather behaviour',
        values: [
          { id: '0ff8041e', name: 'Stable' },
          { id: '894a9bcb', name: 'Changing' },
        ],
      },
      {
        id: 'TypeOfObject',
        name: 'Type of object',
        values: [
          { id: '29a303b3', name: 'Church' },
          { id: '2e7df143', name: 'Park' },
          { id: 'e11282fb', name: 'Palace' },
          { id: '9a1b3256', name: 'Airport' },
        ],
      },
      {
        id: 'AvailableBudget',
        name: 'Available budget',
        values: [
          { id: '90e1ba48', name: 'Knowledge' },
          { id: 'f961174c', name: 'Water' },
        ],
      },
      {
        id: 'OpenCompartments',
        name: 'Open compartments',
        values: [
          { id: '01c3940a', name: 'Open' },
          { id: '56b7fa45', name: 'Closed' },
        ],
      },
      {
        id: 'Location',
        name: 'Location',
        values: [
          { id: 'ea57f820', name: 'Vietnam' },
          { id: 'b8bd8bc3', name: 'Washington' },
          { id: '8fb1e1ab', name: 'Buitenpost' },
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
