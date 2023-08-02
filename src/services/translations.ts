import translate, { Options, Translate } from 'translate.js';
import { plural_EN } from 'translate.js/pluralize';

export type Languages = 'nl' | 'en';

export const messages = {
  home: 'home',
  home_route: '/home',
  about: 'about',
  about_route: '/about',
  DEFINE_BOX: 'Create',
  define_box_route: '/create',
  DOWNLOAD: 'Download',
  UPLOAD: 'Upload',
  CLEAR: 'Clear',
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

export const messagesNL = {
  home: 'home',
  home_route: '/home',
  about: 'over',
  about_route: '/over',
  DEFINE_BOX: 'Maak',
  define_box_route: '/maak',
  DOWNLOAD: 'Downloaden',
  UPLOAD: 'Uploaden',
  CLEAR: 'Wis',
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
} as typeof messages;

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
  onChangeLocale.forEach((listener) => listener(i18n.currentLocale, dir()));
}

function supported(locale: Languages) {
  return Object.keys(i18n.locales).indexOf(locale) >= 0;
}

function dir(locale = i18n.currentLocale) {
  return (i18n.locales[locale] as Locale).dir || 'ltr';
}
