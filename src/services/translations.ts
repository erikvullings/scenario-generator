import translate from 'translate.js';
import { plural_EN } from 'translate.js/pluralize';

const messages = {
  home: 'home',
  home_route: '/home',
  about: 'about',
  about_route: '/about',
  DEFINE_BOX: 'Define',
  define_box_route: '/define',
  DOWNLOAD: 'Download',
  UPLOAD: 'Upload',
  CLEAR: 'Clear',
};

const options = {
  // These are the defaults:
  debug: true, //[Boolean]: Logs missing translations to console and add "@@" around output, if `true`.
  array: true, //[Boolean]: Returns translations with placeholder-replacements as Arrays, if `true`.
  resolveAliases: true, //[Boolean]: Parses all translations for aliases and replaces them, if `true`.
  pluralize: plural_EN, //[Function(count)]: Provides a custom pluralization mapping function, should return a string (or number)
  useKeyForMissingTranslation: true, //[Boolean]: If there is no translation found for given key, the key is used as translation, when set to false, it returns undefiend in this case
};

export const t = translate(messages, options);
