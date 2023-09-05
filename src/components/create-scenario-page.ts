import m, { FactoryComponent } from 'mithril';
import Quill from 'quill';
import {
  FlatButton,
  ISelectOptions,
  Icon,
  InputCheckbox,
  ModalPanel,
  Select,
  TextInput,
  uniqueId,
} from 'mithril-materialized';
import { Dashboards, ID, Narrative, Scenario } from '../models';
import { MeiosisComponent, saveModel, setPage, t } from '../services';
import { deepCopy, getRandomValue } from '../utils';

const ToggleIcon: FactoryComponent<{
  on: string;
  off: string;
  value: boolean;
  disabled?: boolean;
  callback: (newValue: boolean) => void;
}> = () => {
  return {
    view: ({ attrs: { on, off, value, disabled, callback } }) => {
      const iconName = value ? on : off;
      return m(Icon, {
        className: `clickable${disabled ? ' grey-text' : ''}`,
        iconName,
        disabled,
        onclick: disabled ? {} : () => callback(!value),
      });
    },
  };
};

export const CategoryTable: MeiosisComponent<{
  catId: ID;
}> = () => {
  let lockState = false;

  return {
    view: ({ attrs }) => {
      const {
        catId,
        state: {
          model,
          excludedComps = {},
          lockedComps = {},
          curNarrative = {} as Narrative,
        },
      } = attrs;
      const {
        scenario: { categories = [], components: modelComps = [] },
      } = model;
      const multipleCategories = categories.length > 1;
      const category = categories.filter((c) => c.id === catId).shift();
      const componentIds = category && category.componentIds;
      const comps =
        componentIds &&
        modelComps.filter((c) => componentIds.indexOf(c.id) >= 0);

      const { components = {} } = curNarrative;

      return (
        category &&
        comps &&
        m('.scenario-table.row', [
          m('.col.s11', multipleCategories && m('h5', category.label)),
          m('.col.s1.icons', [
            // m(ToggleIcon, {
            //   on: 'visibility',
            //   off: 'visibility_off',
            //   value: true,
            //   callback: () => {
            //     attrs.update({
            //       excludedComps: (e = {}) => {
            //         category?.componentIds.forEach((id) => delete e[id]);
            //         return e;
            //       },
            //     });
            //   },
            // }),
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
                className: 'col s11',
                multiple: true,
                disabled:
                  typeof excludedComps[c.id] !== 'undefined' &&
                  excludedComps[c.id],
                checkedId: components[c.id],
                options: c.values,
                onchange: (ids) => {
                  if (!curNarrative.components) {
                    curNarrative.components = {};
                  }
                  curNarrative.components[c.id] = ids;
                  attrs.update({ curNarrative });
                },
              } as ISelectOptions<string>),
            ],
            m('.col.s1.icons', [
              // m(ToggleIcon, {
              //   on: 'visibility',
              //   off: 'visibility_off',
              //   disabled: c.manual,
              //   value: excludedComps[c.id] ? false : true,
              //   callback: (v) => {
              //     attrs.update({
              //       excludedComps: (e = {}) => {
              //         e[c.id] = !v;
              //         return e;
              //       },
              //     });
              //   },
              // }),
              m(ToggleIcon, {
                on: 'lock_open',
                off: 'lock',
                disabled: c.manual,
                value: c.manual || lockedComps[c.id] ? false : true,
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
  locked: Record<ID, ID[]> = {}
  // excludedComps: Record<ID, boolean> = {}
) => {
  const { categories, components, inconsistencies } = scenario;

  // const chosen = { ...locked } as Record<ID, ID>;
  let tries = 0;
  const generate = () => {
    const chosen = { ...locked } as Record<ID, ID[]>;
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
          if (
            chosenValue &&
            chosenValue.length &&
            inconsistencies.hasOwnProperty(chosenValue[0])
          ) {
            Object.keys(inconsistencies[chosenValue[0]]).forEach((id) =>
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
          chosen[catComp.id] = [value];
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
  let editor: Quill;

  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.CREATE_SCENARIO),
    view: ({ attrs }) => {
      const {
        state: { model, curNarrative = {} as Narrative, lockedComps = {} },
      } = attrs;
      const { categories = [] } = model.scenario;

      const narratives =
        model.scenario &&
        model.scenario.narratives &&
        model.scenario.narratives.filter((n) => n.included);

      return m('.create-scenario.row', [
        m('.col.s12', [
          m(FlatButton, {
            label: t('GENERATE_NARRATIVE'),
            iconName: 'refresh',
            onclick: () => {
              const { components = {} } = curNarrative;
              const locked = components
                ? Object.keys(lockedComps).reduce((acc, cur) => {
                    if (lockedComps[cur]) {
                      acc[cur] = components[cur];
                    }
                    return acc;
                  }, {} as Record<ID, ID[]>)
                : ({} as Record<ID, ID[]>);
              model.scenario.components
                .filter((c) => c.manual)
                .forEach((c) => {
                  locked[c.id] = components[c.id];
                });
              const narrative = generateNarrative(model.scenario, locked);
              if (!narrative) {
                alert('Narrative not generated in 100 tries');
              } else {
                attrs.update({ curNarrative: () => narrative });
              }
            },
          }),
          m(FlatButton, {
            label: t('CLEAR_NARRATIVE'),
            iconName: 'clear',
            style: 'margin-left: 10px;',
            onclick: () => {
              editor.setContents([] as any);
              attrs.update({
                lockedComps: () => ({}),
                curNarrative: () =>
                  ({ included: false, components: {} } as Narrative),
              });
            },
          }),
          m(FlatButton, {
            label: t('SAVE_NARRATIVE'),
            iconName: 'save',
            disabled:
              !curNarrative.label ||
              !curNarrative.components ||
              Object.keys(curNarrative.components).length === 0,
            onclick: () => {
              if (!curNarrative.id) curNarrative.id = uniqueId();
              if (!model.scenario.narratives) {
                curNarrative.saved = true;
                model.scenario.narratives = [curNarrative];
              } else {
                if (curNarrative.saved) {
                  model.scenario.narratives = model.scenario.narratives.map(
                    (n) => (n.id !== curNarrative.id ? n : curNarrative)
                  );
                } else {
                  curNarrative.saved = true;
                  model.scenario.narratives.push(curNarrative);
                }
              }
              saveModel(attrs, model);
            },
          }),
          curNarrative.saved && [
            m(FlatButton, {
              label: t('DELETE'),
              iconName: 'delete',
              modalId: 'deleteSavedNarrative',
            }),
            m(ModalPanel, {
              id: 'deleteSavedNarrative',
              title: t('DELETE_ITEM', 'title', { item: t('NARRATIVE') }),
              description: t('DELETE_ITEM', 'description', {
                item: t('NARRATIVE'),
              }),
              buttons: [
                {
                  label: t('CANCEL'),
                },
                {
                  label: t('OK'),
                  onclick: () => {
                    model.scenario.narratives =
                      model.scenario.narratives.filter(
                        (n) => n.id !== curNarrative.id
                      );
                    attrs.update({
                      curNarrative: () =>
                        ({ included: false, components: {} } as Narrative),
                    });
                    saveModel(attrs, model);
                  },
                },
              ],
            }),
          ],
          narratives &&
            m(Select, {
              className: 'right mb0',
              label: t('SELECT_NARRATIVE'),
              checkedId: curNarrative.saved ? curNarrative.id : undefined,
              placeholder: t('i18n', 'pickOne'),
              options: narratives,
              onchange: (v) => {
                if (v && v.length > 0) {
                  const newNarrative = narratives
                    .filter((n) => n.id === v[0])
                    .shift();
                  console.log(v[0]);
                  console.log(JSON.stringify(narratives, null, 2));
                  console.log(JSON.stringify(newNarrative, null, 2));
                  if (newNarrative) {
                    editor.setContents(
                      newNarrative.desc ? JSON.parse(newNarrative.desc) : []
                    );
                  }
                  // if (newNarrative) newNarrative.included = true;
                  attrs.update({
                    curNarrative: () => deepCopy(newNarrative),
                    lockedComps: () =>
                      model.scenario.components.reduce((acc, cur) => {
                        acc[cur.id] = true;
                        return acc;
                      }, {} as Record<ID, boolean>),
                  });
                }
              },
            } as ISelectOptions<string>),
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
        m(
          '.col.s12',
          {
            oncreate: () => {
              editor = new Quill('#editor', {
                // debug: 'info',
                modules: {
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                    [
                      { color: [] },
                      // , { background: [] }
                    ], // dropdown with defaults from theme
                    // [{ font: [] }],
                    [{ align: [] }],
                    ['image', 'code-block'],
                  ],
                },
                placeholder: t('EDITOR_PLACEHOLDER'),
                readOnly: false,
                theme: 'snow',
              });
              editor.on('text-change', () => {
                curNarrative.desc = JSON.stringify(editor.getContents());
                attrs.update({ curNarrative });
              });
            },
          },
          [
            m('.row', [
              m(TextInput, {
                className: 'col s4',
                initialValue: curNarrative.label,
                label: t('NAME_NARRATIVE'),
                required: true,
                onchange: (n) => {
                  curNarrative.label = n;
                  attrs.update({ curNarrative });
                },
              }),
              m(InputCheckbox, {
                className: 'col s4 mt25',
                checked: curNarrative.included,
                label: t('INCLUDE_NARRATIVE'),
                onchange: (n) => {
                  curNarrative.included = n;
                  attrs.update({ curNarrative });
                },
              }),
              m('.col.s4', []),
            ]),
            // m('#toolbar'),
            m('#editor', {}),
          ]
        ),
      ]);
    },
  };
};
