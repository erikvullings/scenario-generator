import m, { FactoryComponent } from 'mithril';
import { Category, Dashboards, ID, ScenarioComponent } from '../models';
import { MeiosisComponent, setPage, t } from '../services';
import { ISelectOptions, Icon, Select } from 'mithril-materialized';

const ToggleIcon: FactoryComponent<{
  on: string;
  off: string;
  value: boolean;
  callback: (newValue: boolean) => void;
}> = () => {
  return {
    view: ({ attrs: { on, off, value, callback } }) => {
      const iconName = value ? on : off;
      return m(Icon, {
        className: 'clickable',
        iconName,
        onclick: () => callback(!value),
      });
    },
  };
};

export const CategoryTable: MeiosisComponent<{
  catId: ID;
  compValueIds: { [compId: ID]: ID };
}> = () => {
  let multipleCategories: boolean;
  let category: Category | undefined;
  let comps: ScenarioComponent[] | undefined;
  let lockState = false;
  return {
    oninit: ({ attrs }) => {
      const {
        catId,
        state: { model },
      } = attrs;
      const {
        scenario: { categories = [], components = [] },
      } = model;
      multipleCategories = categories.length > 1;
      category = categories.filter((c) => c.id === catId).shift();
      const componentIds = category && category.componentIds;
      comps =
        componentIds &&
        components.filter((c) => componentIds.indexOf(c.id) >= 0);
    },
    view: ({ attrs }) => {
      const {
        compValueIds = {},
        state: { model, excludedComps = {}, lockedComps = {} },
      } = attrs;
      return (
        category &&
        comps &&
        m('.scenario-table.row', [
          m('.col.s10', multipleCategories && m('h5', category.label)),
          m('.col.s2.icons', [
            m(ToggleIcon, {
              on: 'visibility',
              off: 'visibility_off',
              value: true,
              callback: () => {
                attrs.update({
                  excludedComps: (e = {}) => {
                    category?.componentIds.forEach((id) => delete e[id]);
                    return e;
                  },
                });
              },
            }),
            m(ToggleIcon, {
              on: 'lock_open',
              off: 'lock',
              value: lockState,
              callback: (v) => {
                lockState = v;
                attrs.update({
                  lockedComps: (l = {}) => {
                    category?.componentIds.forEach((id) => (l[id] = lockState));
                    return l;
                  },
                });
              },
            }),
          ]),
          comps.map((c) => [
            [
              m(Select, {
                label: c.label,
                key: `key${excludedComps[c.id]}`,
                placeholder: ' ',
                className: 'col s10',
                disabled:
                  typeof excludedComps[c.id] !== 'undefined' &&
                  excludedComps[c.id],
                checkedId: compValueIds[c.id],
                options: c.values,
                onchange: () => {},
              } as ISelectOptions<string>),
            ],
            m('.col.s2.icons', [
              m(ToggleIcon, {
                on: 'visibility',
                off: 'visibility_off',
                value: excludedComps[c.id] ? false : true,
                callback: (v) => {
                  attrs.update({
                    excludedComps: (e = {}) => {
                      e[c.id] = !v;
                      return e;
                    },
                  });
                },
              }),
              m(ToggleIcon, {
                on: 'lock_open',
                off: 'lock',
                value: lockedComps[c.id] ? false : true,
                callback: (v) => {
                  attrs.update({
                    lockedComps: (e = {}) => {
                      e[c.id] = !v;
                      return e;
                    },
                  });
                },
              }),
            ]),
          ]),
        ])
      );
    },
  };
};

export const CreateScenarioPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.CREATE_SCENARIO),
    view: ({ attrs }) => {
      const {
        state: { model },
      } = attrs;
      const { categories = [] } = model.scenario;
      return m('.create-scenario.row', [
        categories.map((c) =>
          m(
            '.col.s12',
            { className: `m${Math.round(12 / categories.length)}` },
            m(CategoryTable, {
              ...attrs,
              catId: c.id,
              compValueIds: {},
            })
          )
        ),
      ]);
    },
  };
};
