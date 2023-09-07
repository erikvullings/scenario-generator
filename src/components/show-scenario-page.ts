import m, { FactoryComponent } from 'mithril';
import { Dashboards, ID, Narrative, ScenarioComponent } from '../models';
import { MeiosisComponent, setPage, t } from '../services';
import { Select, ISelectOptions } from 'mithril-materialized';
import { deepCopy } from 'mithril-ui-form';
import Quill from 'quill';

const CategoryTable: FactoryComponent<{
  curNarrative?: Narrative;
  comps: ScenarioComponent[];
}> = () => {
  return {
    view: ({ attrs: { curNarrative = {}, comps } }) => {
      const { components } = curNarrative;
      const lookup = comps.reduce((acc, cur) => {
        cur.values &&
          cur.values.forEach((v) => {
            acc[v.id] = v.label;
          });
        return acc;
      }, {} as Record<string, string>);
      return m('table', [
        m('tr', [m('th', t('DIMENSION')), m('th', t('KEY_VALUE'))]),
        components &&
          comps.map((c) => {
            return m('tr', [
              m('td', c.label),
              m('td', components[c.id].map((id) => lookup[id]).join(', ')),
            ]);
          }),
      ]);
    },
  };
};

export const ShowScenarioPage: MeiosisComponent = () => {
  let editor: Quill;

  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.SHOW_SCENARIO),
    view: ({ attrs }) => {
      const { state } = attrs;
      const { model, curNarrative } = state;

      const {
        scenario: { categories = [], components: modelComps = [] },
      } = model;
      const multipleCategories = categories.length > 1;
      if (
        (!curNarrative || !curNarrative.saved) &&
        model.scenario.narratives &&
        model.scenario.narratives.length > 0
      ) {
        const newNarrative = model.scenario.narratives[0];
        attrs.update({
          curNarrative: () => deepCopy(newNarrative),
        });
        return;
      }

      return m('.show-scenario.row', [
        m('.col.s12', [
          model.scenario &&
            model.scenario.narratives &&
            model.scenario.narratives.length > 0 &&
            m(Select, {
              className: 'right mb0 w30',
              label: t('SELECT_NARRATIVE'),
              checkedId:
                curNarrative && curNarrative.saved
                  ? curNarrative.id
                  : undefined,
              placeholder: t('i18n', 'pickOne'),
              options: model.scenario.narratives,
              onchange: (v) => {
                if (v && v.length > 0) {
                  const newNarrative = model.scenario.narratives
                    .filter((n) => n.id === v[0])
                    .shift();
                  if (newNarrative) {
                    editor.setContents(
                      newNarrative.desc ? JSON.parse(newNarrative.desc) : []
                    );
                  }
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
        curNarrative && [
          m(
            '.col.s12',
            m('.row', [
              categories.map((category) => {
                const componentIds = category && category.componentIds;
                const comps =
                  componentIds &&
                  modelComps.filter((c) => componentIds.indexOf(c.id) >= 0);
                return m(
                  '.col',
                  {
                    className: `s${12 / categories.length}`,
                  },
                  multipleCategories && m('h5', category.label),
                  m(CategoryTable, { curNarrative, comps })
                );
              }),
            ])
          ),
          m(
            '.col.s12',
            {
              oncreate: () => {
                editor = new Quill('#editor', {
                  // debug: 'info',
                  modules: {
                    toolbar: false,
                  },
                  placeholder: t('EDITOR_PLACEHOLDER'),
                  readOnly: true,
                  theme: 'snow',
                });
                editor.setContents(
                  curNarrative.desc ? JSON.parse(curNarrative.desc) : []
                );

                // editor.on('text-change', () => {
                //   curNarrative.desc = JSON.stringify(editor.getContents());
                //   attrs.update({ curNarrative });
                // });
              },
            },
            [
              m('.row', [
                // m(TextInput, {
                //   disabled: true,
                //   className: 'col s4',
                //   initialValue: curNarrative.label,
                //   label: t('NAME_NARRATIVE'),
                //   required: true,
                //   onchange: (n) => {
                //     curNarrative.label = n;
                //     attrs.update({ curNarrative });
                //   },
                // }),
                // m(InputCheckbox, {
                //   disabled: true,
                //   className: 'col s4 mt25',
                //   initialValue: curNarrative.included,
                //   label: t('INCLUDE_NARRATIVE'),
                //   onchange: (n) => {
                //     curNarrative.included = n;
                //     attrs.update({ curNarrative });
                //   },
                // }),
                // m('.col.s4', []),
              ]),
              // m('#toolbar'),
              m('#editor', {}),
            ]
          ),
        ],
      ]);
    },
  };
};
