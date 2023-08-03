import m from 'mithril';
import { Dashboards } from '../models';
import { MeiosisComponent, setPage } from '../services';

export const ShowScenarioPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.SHOW_SCENARIO),
    view: ({}) => {
      return m('.show-scenario.row', ['SHOW_SCENARIO']);
    },
  };
};
