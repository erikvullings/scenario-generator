import m, { FactoryComponent } from 'mithril';
import { meiosisSetup } from 'meiosis-setup';
import { i18n, routingSvc } from '.';
import {
  ContextualItem,
  Dashboards,
  DataModel,
  ID,
  Narrative,
  defaultModel,
} from '../models';
import { ldb } from '../utils/local-ldb';
import { MeiosisCell, Update } from 'meiosis-setup/types';
import { LANGUAGE, SAVED } from '../utils';

const MODEL_KEY = 'SG_MODEL';
const SCENARIO_TITLE = 'SG_JOURNAL_TITLE';

export type State = {
  page: Dashboards;
  model: DataModel;
  title: string;
  language: string;
  activeTooltip?: string;
  /** Current narrative that we are working on */
  curNarrative?: Narrative;
  /** Components that have been excluded from the narrative */
  excludedComps?: Record<ID, boolean>;
  /** Components that have been given a fixed value in the narrative */
  lockedComps?: Record<ID, boolean>;
};

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

export const saveModel = async (
  cell: MeiosisCell<State>,
  model: DataModel,
  reset = false
) => {
  localStorage.setItem(SAVED, 'false');
  model.lastUpdate = Date.now();
  await ldb.set(MODEL_KEY, JSON.stringify(model));
  // console.log(JSON.stringify(model, null, 2));
  if (reset) {
    cell.update({
      model: () => model,
      activeTooltip: '',
      title: model.scenario.label,
      curNarrative: () => undefined,
      excludedComps: () => ({}),
      lockedComps: () => ({}),
    });
  } else {
    cell.update({ model: () => model });
  }
};

export const mutateScenarioComponent = (
  cell: MeiosisCell<State>,
  scenarioComponentId: ID,
  item: ContextualItem,
  mutation: 'update' | 'create' | 'delete'
) => {
  const { model } = cell.state;
  const {
    scenario: { components },
  } = model;
  const comp = components.filter((c) => c.id === scenarioComponentId).shift();
  if (!comp) {
    console.error('Scenario component not found!');
    return;
  }
  const { values } = comp;
  comp.values =
    mutation === 'update'
      ? values.map((c) => (c.id === item.id ? item : c))
      : mutation === 'delete'
      ? values.filter((c) => c.id !== item.id)
      : [...values, item];
  saveModel(cell, model);
};

/** Move the position of a scenario component before or after another scenario component */
export const moveScenarioComponent = (
  cell: MeiosisCell<State>,
  componentId: ID,
  moveId: ID,
  dropId: ID,
  moveBefore: boolean
) => {
  const { model } = cell.state;
  const {
    scenario: { components },
  } = model;
  const comp = components.filter((c) => c.id === componentId).shift();
  if (!comp) {
    console.error('Scenario component not found!');
    return;
  }
  const { values } = comp;
  const itemToMove = values.find((item) => item.id === moveId);
  if (!itemToMove) return;

  comp.values = values
    .filter((i) => i.id !== moveId)
    .reduce((acc, cur) => {
      if (cur.id === dropId) {
        if (moveBefore) {
          acc.push(itemToMove);
          acc.push(cur);
        } else {
          acc.push(cur);
          acc.push(itemToMove);
        }
      } else {
        acc.push(cur);
      }
      return acc;
    }, [] as ContextualItem[]);
  saveModel(cell, model);
};

export const setLanguage = async (locale = i18n.currentLocale) => {
  localStorage.setItem(LANGUAGE, locale);
  await i18n.loadAndSetLocale(locale);
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
    // t: setGuiLanguage('en'),
  } as State,
};
export const cells = meiosisSetup<State>({ app });
initialize(cells().update);

cells.map(() => m.redraw());
