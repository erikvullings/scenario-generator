import m, { FactoryComponent } from 'mithril';
import {
  Category,
  Dashboards,
  ID,
  Narrative,
  Scenario,
  ScenarioComponent,
} from '../models';
import { MeiosisComponent, setPage, t } from '../services';
import {
  Button,
  FlatButton,
  ISelectOptions,
  Icon,
  Select,
  uniqueId,
} from 'mithril-materialized';
import { getRandomValue } from '../utils';

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
        state: {
          model,
          excludedComps = {},
          lockedComps = {},
          curNarrative = {} as Narrative,
        },
      } = attrs;
      const { components = {} } = curNarrative;

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
                checkedId: components[c.id],
                options: c.values,
                onchange: (ids) => {
                  if (!curNarrative.components) {
                    curNarrative.components = {};
                  }
                  curNarrative.components[c.id] = ids[0];
                  attrs.update({ curNarrative });
                },
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

const generateNarrative = (
  scenario: Scenario,
  locked: Record<ID, ID> = {}
  // excludedComps: Record<ID, boolean> = {}
) => {
  const { categories, components, inconsistencies } = scenario;

  // const chosen = { ...locked } as Record<ID, ID>;
  let tries = 0;
  const generate = () => {
    const chosen = { ...locked } as Record<ID, ID>;
    for (const category of categories) {
      const catComps = components
        .filter((c) => category.componentIds.includes(c.id))
        .map((c) => ({ ...c, inc: inconsistencies[c.id] }))
        .sort((a, b) =>
          a.inc && b.inc
            ? Object.keys(a.inc).length > Object.keys(b.inc).length
              ? 1
              : -1
            : a.inc
            ? 1
            : b.inc
            ? -1
            : 1
        );
      const excluded: ID[] = [];
      for (const catComp of catComps) {
        if (chosen.hasOwnProperty(catComp.id)) {
          const chosenValue = chosen[catComp.id];
          if (inconsistencies.hasOwnProperty(chosenValue)) {
            Object.keys(inconsistencies[chosenValue]).forEach((id) =>
              excluded.push(id)
            );
          }
          continue;
        }
        const valuesToChooseFrom = catComp.values
          .map(({ id }) => id)
          .filter((id) => !excluded.includes(id));
        if (valuesToChooseFrom.length === 0) return false;
        const value = getRandomValue(valuesToChooseFrom);
        if (value) {
          chosen[catComp.id] = value;
        } else {
          return false;
        }
      }
    }
    return chosen;
  };

  do {
    const components = generate();
    if (components) {
      const narrative = {
        id: uniqueId(),
        components,
        included: false,
      } as Narrative;
      return narrative;
    }
    tries++;
  } while (tries < 100);
  return false;
};

export const CreateScenarioPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.CREATE_SCENARIO),
    view: ({ attrs }) => {
      const {
        state: { model, curNarrative = {} as Narrative, lockedComps = {} },
      } = attrs;
      const { categories = [] } = model.scenario;
      return m('.create-scenario.row', [
        m('.col.s12', [
          m(Button, {
            label: t('GENERATE_NARRATIVE'),
            onclick: () => {
              const { components } = curNarrative;
              const locked = components
                ? Object.keys(lockedComps).reduce((acc, cur) => {
                    if (lockedComps[cur]) {
                      acc[cur] = components[cur];
                    }
                    return acc;
                  }, {} as Record<ID, ID>)
                : ({} as Record<ID, ID>);
              const narrative = generateNarrative(model.scenario, locked);
              if (!narrative) {
                alert('Narrative not generated in 100 tries');
              } else {
                attrs.update({ curNarrative: () => narrative });
              }
            },
          }),
          m(Button, {
            label: t('CLEAR_NARRATIVE'),
            style: 'margin-left: 10px;',
            onclick: () => {
              attrs.update({
                curNarrative: (n) => {
                  if (n) {
                    n.components = {};
                    return n;
                  }
                  return { included: false, components: {} } as Narrative;
                },
              });
            },
          }),
        ]),
        categories.map((c) =>
          m(
            '.col.s12',
            { className: `m${Math.round(12 / categories.length)}` },
            m(CategoryTable, {
              ...attrs,
              catId: c.id,
            })
          )
        ),
      ]);
    },
  };
};
