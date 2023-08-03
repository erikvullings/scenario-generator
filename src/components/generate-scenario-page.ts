import m from 'mithril';
import { Dashboards } from '../models';
import { MeiosisComponent, setPage } from '../services';

export const GenerateScenarioPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.GENERATE_SCENARIO),
    view: ({}) => {
      return m('.generate-scenario.row', ['GENERATE_SCENARIO']);
    },
  };
};
