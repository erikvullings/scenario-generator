import m from 'mithril';
import { Dashboards, Item, ScenarioComponent } from '../models';
import { MeiosisComponent, setPage } from '../services';
import { FlatButton, ModalPanel, Tabs } from 'mithril-materialized';

const BoxItem: MeiosisComponent<{ item: Item }> = () => {
  return {
    view: ({ attrs }) => {
      const { item } = attrs;

      return m('li.kanban-item.card', [
        m('.card-content', [m('span.card-title', item.name)]),
      ]);
    },
  };
};

const BoxHeader: MeiosisComponent<{ sc: ScenarioComponent }> = () => {
  return {
    view: ({ attrs }) => {
      const { sc } = attrs;

      return m('li.kanban-header', [
        m('.span.title.truncate.left.ml10', sc.name),
        m(FlatButton, {
          // className: 'right',
          iconName: 'add',
          iconClass: 'no-gutter',
          modalId: sc.id,
        }),
        m(ModalPanel, {
          id: sc.id,
          title: 'ADD_COMPONENT',
          description: sc.name,
          options: { opacity: 0.7 },
          buttons: [
            {
              label: 'CANCEL',
            },
            {
              label: 'OK',
              onclick: () => {},
            },
          ],
        }),
      ]);
    },
  };
};

const BoxRow: MeiosisComponent<{ sc: ScenarioComponent }> = () => {
  return {
    view: ({ attrs }) => {
      const { sc } = attrs;

      return m('li', [
        m(
          'ul.kanban-row',
          m(BoxHeader, { ...attrs, sc }),
          sc.values.map((c) => m(BoxItem, { ...attrs, item: c }))
        ),
      ]);
    },
  };
};

const BoxView: MeiosisComponent<{ categoryId: number }> = () => {
  return {
    view: ({ attrs }) => {
      const {
        categoryId,
        state: {
          model: { scenario },
        },
      } = attrs;
      const { categories, components } = scenario;
      const category = categories[categoryId];
      const scs = components.filter(
        (c) => category.componentIds.indexOf(c.id) >= 0
      );

      return m('ul.kanban', [
        // m(
        // '.kanban-row',
        scs.map((sc) => m(BoxRow, { ...attrs, sc })),
        // ),
      ]);
    },
  };
};

export const DefineBoxPage: MeiosisComponent = () => {
  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.DEFINE_BOX),
    view: ({ attrs }) => {
      const {
        model: { scenario },
      } = attrs.state;
      const { categories } = scenario;

      return [
        m('.row', []),
        m(
          '.row',
          categories.length > 1
            ? m(Tabs, {
                tabs: categories.map((c, categoryId) => ({
                  id: c.id,
                  title: c.name,
                  vnode: m(BoxView, { ...attrs, categoryId }),
                })),
              })
            : categories.length === 1
            ? m(BoxView, { ...attrs, categoryId: 0 })
            : 'FIRST DEFINE SOME COMPONENT CATEGORIES'
        ),
      ];
    },
  };
};
