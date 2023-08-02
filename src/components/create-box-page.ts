import m from 'mithril';
import {
  Dashboards,
  ContextualItem,
  ScenarioComponent,
  OsmTypes,
  ID,
} from '../models';
import {
  MeiosisComponent,
  mutateScenarioComponent,
  setPage,
} from '../services';
import { FlatButton, ModalPanel, Tabs } from 'mithril-materialized';
import { FormAttributes, LayoutForm, UIForm } from 'mithril-ui-form';

const form = [
  { id: 'id', autogenerate: 'id' },
  { id: 'name', type: 'text', label: 'NAME' },
  { id: 'desc', type: 'textarea', label: 'DESCRIPTION' },
  {
    id: 'context',
    type: 'select',
    label: 'CONTEXT',
    value: 'none',
    options: [
      { id: 'none', label: 'NONE' },
      { id: 'location', label: 'LOCATION' },
      { id: 'locationType', label: 'LOCATION_TYPE' },
    ],
  },
  {
    id: 'locationType',
    show: ['context=location'],
    type: 'select',
    label: 'Type of location',
    options: [
      { id: 'name', label: 'NAME' },
      { id: 'coords', label: 'COORDINATES' },
    ],
  },
  {
    id: 'location',
    show: ['context=location & locationType=name'],
    type: 'text',
    label: 'LOCATION_NAME',
  },
  {
    id: 'lat',
    show: ['context=location & locationType=coords'],
    type: 'number',
    label: 'LATITUDE',
  },
  {
    id: 'lon',
    show: ['context=location & locationType=coords'],
    type: 'number',
    label: 'LONGITUDE',
  },
  {
    id: 'locationTypeType',
    show: ['context=locationType'],
    type: 'select',
    label: 'Type of location',
    options: [
      { id: 'list', label: 'PICK_FROM_LIST' },
      { id: 'keyValue', label: 'ENTER_KEY_VALUE' },
    ],
  },
  {
    id: 'osmTypeId',
    show: ['context=locationType & locationTypeType=list'],
    type: 'select',
    label: 'NAME',
    options: OsmTypes.map(({ id, name: label }) => ({ id, label })),
  },
  {
    id: 'value',
    show: ['context=locationType & locationTypeType=keyValue'],
    type: 'text',
    label: 'KEY',
  },
  {
    id: 'key',
    show: ['context=locationType & locationTypeType=keyValue'],
    type: 'text',
    label: 'VALUE',
  },
] as UIForm<ContextualItem>;

const BoxItem: MeiosisComponent<{ id: ID; item: ContextualItem }> = () => {
  let obj: ContextualItem;
  return {
    oninit: ({ attrs: { item } }) => (obj = { ...item }),
    view: ({ attrs }) => {
      const { item, id } = attrs;
      return [
        m('li.kanban-item.card.widget', [
          m('.card-content', [
            m('span.card-title', item.name),
            m(FlatButton, {
              className: 'top-right widget-link',
              iconName: 'edit',
              iconClass: 'no-gutter',
              modalId: item.id,
            }),
          ]),
        ]),
        m(ModalPanel, {
          id: item.id,
          title: 'EDIT_COMPONENT',
          fixedFooter: true,
          description: m(LayoutForm, {
            form,
            obj,
          } as FormAttributes<ContextualItem>),
          // options: { opacity: 0.7 },
          buttons: [
            {
              label: 'CANCEL',
            },
            {
              label: 'DELETE',
              onclick: () => {
                mutateScenarioComponent(attrs, id, obj, 'delete');
              },
            },
            {
              label: 'OK',
              onclick: () => {
                mutateScenarioComponent(attrs, id, obj, 'update');
              },
            },
          ],
        }),
      ];
    },
  };
};

const BoxHeader: MeiosisComponent<{ sc: ScenarioComponent }> = () => {
  let obj = {} as ContextualItem;
  return {
    view: ({ attrs }) => {
      const { sc } = attrs;
      const { id } = sc;

      return [
        m('li.kanban-header.widget', [
          m('.span.title.truncate.left.ml10', sc.name),
          m(FlatButton, {
            className: 'widget-link',
            iconName: 'add',
            iconClass: 'no-gutter',
            modalId: sc.id,
          }),
        ]),
        m(ModalPanel, {
          id: sc.id,
          title: 'ADD_COMPONENT',
          fixedFooter: true,
          description: m(LayoutForm, {
            form,
            obj,
          } as FormAttributes<ContextualItem>),
          // options: { opacity: 0.7 },
          buttons: [
            {
              label: 'CANCEL',
            },
            {
              label: 'OK',
              onclick: () => {
                const item = { ...obj };
                obj = {} as ContextualItem;
                mutateScenarioComponent(attrs, id, item, 'create');
              },
            },
          ],
        }),
      ];
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
          sc.values.map((c) => m(BoxItem, { ...attrs, id: sc.id, item: c }))
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

export const CreateBoxPage: MeiosisComponent = () => {
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
