import m from 'mithril';
import 'material-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';
import './css/style.css';
import { routingSvc } from './services/routing-service';

// TODO connect this to language action
document.documentElement.setAttribute('lang', 'nl');

routingSvc.init();
m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());
