import m from 'mithril';
import { Dashboards } from '../models';
import { MeiosisComponent, setPage } from '../services';
import { render } from 'mithril-ui-form';

const md = `#### Over deze applicatie`;

export const AboutPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.ABOUT),
    view: ({}) => {
      return [m('.row', []), m('.row.markdown', m.trust(render(md)))];
    },
  };
};
