import m, { FactoryComponent } from 'mithril';
import { Dashboards, ID, Narrative, ScenarioComponent } from '../models';
import { MeiosisComponent, setPage, t } from '../services';
import { Select, ISelectOptions } from 'mithril-materialized';
import { deepCopy } from 'mithril-ui-form';

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
  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.SHOW_SCENARIO),
    view: ({ attrs }) => {
      const { state } = attrs;
      const { model, curNarrative } = state;

      const {
        scenario: { categories = [], components: modelComps = [] },
      } = model;

      return m('.show-scenario.row', [
        m('.col.s12', [
          model.scenario &&
            model.scenario.narratives &&
            model.scenario.narratives.length > 0 &&
            m(Select, {
              className: 'right mb0',
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
                    // editor.setContents(
                    //   newNarrative.desc ? JSON.parse(newNarrative.desc) : []
                    // );
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
        curNarrative &&
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
                  m(CategoryTable, { curNarrative, comps })
                );
              }),
            ])
          ),
      ]);
    },
  };
};
