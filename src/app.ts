import m from 'mithril';
import 'material-icons/iconfont/filled.css';
import 'materialize-css/dist/css/materialize.min.css';
import './css/style.css';
import 'quill/dist/quill.snow.css';
import { routingSvc } from './services/routing-service';
import { Languages, i18n } from './services';

// TODO connect this to language action
document.documentElement.setAttribute('lang', 'nl');

// routingSvc.init();
// m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());
console.log('APP');

i18n.addOnChangeListener((locale: string) => {
  console.log(`Language loaded`);
  document.documentElement.setAttribute('lang', locale);
  routingSvc.init();
  m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());
});
i18n.init(
  {
    en: { name: 'English', fqn: 'en-UK', default: true },
    nl: { name: 'Nederlands', fqn: 'nl-NL' },
  },
  (window.localStorage.getItem('SG_LANGUAGE') || 'nl') as Languages
);
