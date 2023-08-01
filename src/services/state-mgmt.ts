import m, { FactoryComponent } from 'mithril';
import { meiosisSetup } from 'meiosis-setup';
import { routingSvc } from '.';
import { Dashboards, DataModel, defaultModel } from '../models';
import { ldb } from '../utils/local-ldb';
import { MeiosisCell, Update } from 'meiosis-setup/types';

const MODEL_KEY = 'SG_MODEL';
const SCENARIO_TITLE = 'SG_JOURNAL_TITLE';

export interface State {
  page: Dashboards;
  model: DataModel;
  title: string;
  language: string;
}

export type MeiosisComponent<T = {}> = FactoryComponent<MeiosisCell<State> & T>;

const setTitle = (title: string) => {
  document.title = `Scenario Generator: ${title}`;
};

/* Actions */

export const setPage = (cell: MeiosisCell<State>, page: Dashboards) =>
  cell.update({ page });

export const changePage = (
  cell: MeiosisCell<State>,
  page: Dashboards,
  params?: Record<string, string | number | undefined>,
  query?: Record<string, string | number | undefined>
) => {
  routingSvc && routingSvc.switchTo(page, params, query);
  cell.update({ page });
};

export const saveModel = (cell: MeiosisCell<State>, model: DataModel) => {
  model.lastUpdate = Date.now();
  model.version = model.version ? ++model.version : 1;
  ldb.set(MODEL_KEY, JSON.stringify(model));
  // console.log(JSON.stringify(model, null, 2));
  cell.update({ model: () => model });
};

export const setLanguage = async (
  cell: MeiosisCell<State>,
  language: string
) => {
  localStorage.setItem('SG_LANGUAGE', language);
  // await i18n.loadAndSetLocale(locale);
  cell.update({ language });
};

/* END OF Actions */

const initialize = async (update: Update<State>) => {
  const ds = await ldb.get(MODEL_KEY);
  const model = ds ? JSON.parse(ds) : defaultModel;
  const t = await ldb.get(SCENARIO_TITLE);
  const title = t ? t : '';
  setTitle(title);

  update({
    model: () => ({ ...model }),
    title,
  });
};

const app = {
  initial: {
    title: '',
    page: Dashboards.HOME,
    model: defaultModel,
  } as State,
};
export const cells = meiosisSetup<State>({ app });
initialize(cells().update);

cells.map(() => m.redraw());
