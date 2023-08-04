import { I18n } from 'mithril-ui-form';
import translate, { Options, Translate } from 'translate.js';
import { plural_EN } from 'translate.js/pluralize';

export type Languages = 'nl' | 'en';

export const messages = {
  HOME: { TITLE: 'home', ROUTE: '/home' },
  ABOUT: { TITLE: 'about', ROUTE: '/about' },
  DEFINE_BOX: { TITLE: 'Define', ROUTE: '/define' },
  SETTINGS: { TITLE: 'Settings', ROUTE: '/settings' },
  CREATE_SCENARIO: { TITLE: 'Create', ROUTE: '/create' },
  SHOW_SCENARIO: { TITLE: 'Show', ROUTE: '/home' },
  DOWNLOAD: 'Download',
  UPLOAD: 'Upload',
  CLEAR: 'Clear',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  YES: 'Yes',
  NO: 'No',
  OK: 'Ok',
  NAME: 'Name',
  DESCRIPTION: 'Description',
  CATEGORIES: 'Categories',
  DIMENSIONS: 'Dimensions',
  CONTEXT: 'Context',
  NONE: 'None',
  LOCATION: 'Location',
  LOCATION_TYPE: 'Location type',
  COORDINATES: 'Coordinates',
  LOCATION_NAME: 'Location name',
  LATITUDE: 'Latitude',
  LONGITUDE: 'Longitude',
  Type: 'Type',
  PICK_FROM_LIST: 'Pick from list',
  ENTER_KEY_VALUE: 'Enter key value',
  EDIT_COMPONENT: 'Edit component',
  ADD_COMPONENT: 'Add component',
  GENERATE_NARRATIVE: 'Generate narrative',
  CLEAR_NARRATIVE: 'Clear narrative',
  KEY: 'Key',
  VALUE: 'Value',
  MODEL: 'Model',
  DIMENSION: 'Dimension',
  SELECTION: 'Selected value',
  COMBINATIONS: {
    POSSIBLE: 'Combinations are possible',
    IMPOSSIBLE: 'Combinations are impossible',
    IMPROBABLE: 'Combinations are improbable',
  },
  DELETE_MODEL: {
    title: 'Delete model',
    description:
      'Are you certain you want to delete this model. There is no turning back?',
  },
  CLEAR_MODEL: {
    title: 'Do you really want to delete everything?',
    description: 'Are you sure that you want to delete your model?',
  },
  INCONSISTENCIES: {
    title: 'Edit inconsistencies',
    SELECT_ROW: 'Select row',
    SELECT_COL: 'Select column',
  },
  saveButton: {
    label: 'Save',
    tooltip: 'Save unsaved changes',
  },
  i18n: {
    /** Label for the edit button of the RepeatList */
    editRepeat: 'Edit',
    /** Label for the create button of the RepeatList */
    createRepeat: 'Add',
    /** Label for the delete button of the RepeatList */
    deleteItem: 'Delete',
    /** Label for the agree button of the RepeatList */
    agree: 'Yes',
    /** Label for the disagree button of the RepeatList */
    disagree: 'No',
    /** Pick one */
    pickOne: 'Pick one',
    /** Pick one or more */
    pickOneOrMore: 'Pick one or more',
    /** Cancel button text */
    cancel: 'Cancel',
    /** Save button text */
    save: 'Save',
  },
};

export const messagesNL: typeof messages = {
  HOME: { TITLE: 'home', ROUTE: '/home' },
  ABOUT: { TITLE: 'over', ROUTE: '/over' },
  DEFINE_BOX: { TITLE: 'Definieer', ROUTE: '/definieer' },
  SETTINGS: { TITLE: 'Instellingen', ROUTE: '/instellingen' },
  CREATE_SCENARIO: { TITLE: 'Maak', ROUTE: '/maak' },
  SHOW_SCENARIO: { TITLE: 'Toon', ROUTE: '/toon' },
  DOWNLOAD: 'Downloaden',
  UPLOAD: 'Uploaden',
  CLEAR: 'Wis',
  CANCEL: 'Afbreken',
  DELETE: 'Verwijderen',
  YES: 'Ja',
  NO: 'Nee',
  OK: 'Ok',
  NAME: 'Naam',
  DESCRIPTION: 'Omschrijving',
  CATEGORIES: 'Categoriën',
  DIMENSIONS: 'Dimensies',
  CONTEXT: 'Context',
  NONE: 'Geen',
  LOCATION: 'Locatie',
  LOCATION_TYPE: 'Locatietype',
  COORDINATES: 'Coordinaten',
  LOCATION_NAME: 'Locatienaam',
  LATITUDE: 'Latitude',
  LONGITUDE: 'Longitude',
  Type: 'Type',
  PICK_FROM_LIST: 'Kies uit de lijst',
  ENTER_KEY_VALUE: 'Vul een sleutel en waarde in',
  EDIT_COMPONENT: 'Bewerk optie',
  ADD_COMPONENT: 'Nieuwe optie',
  GENERATE_NARRATIVE: 'Genereer verhaallijn',
  CLEAR_NARRATIVE: 'Wis verhaallijn',
  KEY: 'Sleutel',
  VALUE: 'Waarde',
  MODEL: 'Model',
  DIMENSION: 'Dimensie',
  SELECTION: 'Geselecteerde waarde',
  COMBINATIONS: {
    POSSIBLE: 'Combinaties zijn mogelijk',
    IMPOSSIBLE: 'Combinaties zijn onmogelijk',
    IMPROBABLE: 'Combinaties zijn onwaarschijnlijk',
  },
  DELETE_MODEL: {
    title: 'Verwijder model',
    description:
      'Weet u zeker dat u dit model wilt verwijderen? Dit kan niet ongedaan gemaakt worden.',
  },
  CLEAR_MODEL: {
    title: 'Alles wissen',
    description:
      'Weet u zeker dat u dit model wilt wissen, en met een standaard model wilt beginnen? Er is geen weg terug.',
  },
  INCONSISTENCIES: {
    title: 'Bewerk inconsistencies',
    SELECT_ROW: 'Selecteer rij',
    SELECT_COL: 'Selecteer kolom',
  },
  saveButton: {
    label: 'Opslaan',
    tooltip: 'Sla aanpassingen op',
  },
  i18n: {
    /** Label for the edit button of the RepeatList */
    editRepeat: 'Bewerk',
    /** Label for the create button of the RepeatList */
    createRepeat: 'Nieuw',
    /** Label for the delete button of the RepeatList */
    deleteItem: 'Verwijder',
    /** Label for the agree button of the RepeatList */
    agree: 'Ja',
    /** Label for the disagree button of the RepeatList */
    disagree: 'Nee',
    /** Pick one */
    pickOne: 'Kies één',
    /** Pick one or more */
    pickOneOrMore: 'Kies één of meer',
    /** Cancel button text */
    cancel: 'Afbreken',
    /** Save button text */
    save: 'Opslaan',
  },
};

const setGuiLanguage = (language: Languages) => {
  const options = {
    // These are the defaults:
    debug: true, //[Boolean]: Logs missing translations to console and add "@@" around output, if `true`.
    array: true, //[Boolean]: Returns translations with placeholder-replacements as Arrays, if `true`.
    resolveAliases: true, //[Boolean]: Parses all translations for aliases and replaces them, if `true`.
    pluralize: plural_EN, //[Function(count)]: Provides a custom pluralization mapping function, should return a string (or number)
    useKeyForMissingTranslation: true, //[Boolean]: If there is no translation found for given key, the key is used as translation, when set to false, it returns undefiend in this case
  };
  return translate(
    language === 'nl' ? messagesNL : messages,
    options
  ) as Translate<typeof messages, Options>;
};

export type TextDirection = 'rtl' | 'ltr';

export type Locale = {
  /** Friendly name */
  name: string;
  /** Fully qualified name, e.g. 'en-UK' */
  fqn: string;
  /** Text direction: Left to right or right to left */
  dir?: TextDirection;
  /** Is the default language */
  default?: boolean;
};

export type Locales = Record<Languages, Locale>;
// export type Locales = {
//   [key: Languages]: Locale | string;
// } & {
//   /** Default URL to load the language files, e.g. '/lang/{locale}.json' */
//   url?: string;
// };

export type Listener = (locale: string, dir: TextDirection) => void;

const onChangeLocale = [] as Listener[];

export const i18n = {
  defaultLocale: 'en' as Languages,
  currentLocale: 'en' as Languages,
  locales: {} as Locales,
  init,
  addOnChangeListener,
  loadAndSetLocale,
  i18n: {} as I18n,
  // } as {
  //   defaultLocale: Languages;
  //   currentLocale: Languages;
  //   locales: Locales;
  //   t: Translate<typeof messages, Options>;
};

export let t: Translate<typeof messages, Options>;

async function init(locales: Locales, selectedLocale: Languages) {
  i18n.locales = locales;
  const defaultLocale = (Object.keys(locales) as Languages[])
    .filter((l) => (locales[l] as Locale).default)
    .shift();
  if (defaultLocale) {
    i18n.defaultLocale = defaultLocale || selectedLocale;
  }
  await loadAndSetLocale(selectedLocale);
}

function addOnChangeListener(listener: Listener) {
  onChangeLocale.push(listener);
}

async function loadAndSetLocale(newLocale: Languages) {
  if (i18n.currentLocale === newLocale) {
    return;
  }

  const resolvedLocale = supported(newLocale) ? newLocale : i18n.defaultLocale;
  i18n.currentLocale = resolvedLocale;
  t = setGuiLanguage(newLocale);
  i18n.i18n = {
    editRepeat: t('i18n', 'editRepeat'),
    createRepeat: t('i18n', 'createRepeat'),
    deleteItem: t('i18n', 'deleteItem'),
    agree: t('i18n', 'agree'),
    disagree: t('i18n', 'disagree'),
    pickOne: t('i18n', 'pickOne'),
    pickOneOrMore: t('i18n', 'pickOneOrMore'),
    cancel: t('i18n', 'cancel'),
    save: t('i18n', 'save'),
  } as I18n;
  onChangeLocale.forEach((listener) => listener(i18n.currentLocale, dir()));
}

function supported(locale: Languages) {
  return Object.keys(i18n.locales).indexOf(locale) >= 0;
}

function dir(locale = i18n.currentLocale) {
  return (i18n.locales[locale] as Locale).dir || 'ltr';
}
