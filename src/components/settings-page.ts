import m, { FactoryComponent } from 'mithril';
import {
  Dashboards,
  DataModel,
  ID,
  Inconsistencies,
  Scenario,
} from '../models';
import { MeiosisComponent, saveModel, setPage, t } from '../services';
import {
  FlatButton,
  Icon,
  ModalPanel,
  Select,
  Tabs,
} from 'mithril-materialized';
import { FormAttributes, LayoutForm, UIForm } from 'mithril-ui-form';

export const InconsistencyCheckbox: FactoryComponent<{
  inconsistencies: Inconsistencies;
  rowId: ID;
  colId: ID;
  callback: () => Promise<void>;
}> = () => {
  return {
    view: ({ attrs: { rowId, colId, inconsistencies, callback } }) => {
      const row = inconsistencies[rowId];
      const v = typeof row !== 'undefined' ? row[colId] : undefined;
      const iconName =
        typeof v === 'undefined'
          ? 'check_circle_outline'
          : v
          ? 'radio_button_unchecked'
          : 'blur_circular';
      return m(Icon, {
        className: 'clickable',
        iconName,
        onclick: async () => {
          switch (v) {
            case true:
              inconsistencies[rowId][colId] = inconsistencies[colId][rowId] =
                false;
              break;
            case false:
              delete inconsistencies[rowId][colId];
              delete inconsistencies[colId][rowId];
              break;
            default:
              if (!inconsistencies[rowId]) {
                inconsistencies[rowId] = {};
              }
              if (!inconsistencies[colId]) {
                inconsistencies[colId] = {};
              }
              inconsistencies[rowId][colId] = inconsistencies[colId][rowId] =
                true;
              break;
          }
          await callback();
        },
      });
    },
  };
};

export const SettingsPage: MeiosisComponent = () => {
  const form = [
    { id: 'id', autogenerate: 'id' },
    { id: 'label', type: 'text', label: t('NAME') },
    { id: 'desc', type: 'textarea', label: t('DESCRIPTION') },
    {
      id: 'components',
      type: [
        { id: 'id', autogenerate: 'id' },
        { id: 'label', type: 'text', className: 'col s6', label: t('NAME') },
        {
          id: 'desc',
          type: 'text',
          className: 'col s6',
          label: t('DESCRIPTION'),
        },
      ],
      repeat: true,
      pageSize: 100,
      label: t('DIMENSIONS'),
    },
    {
      id: 'categories',
      type: [
        { id: 'id', autogenerate: 'id' },
        { id: 'label', type: 'text', label: t('NAME') },
        { id: 'desc', type: 'textarea', label: t('DESCRIPTION') },
        {
          id: 'componentIds',
          type: 'select',
          multiple: true,
          label: t('DIMENSIONS'),
          options: 'components',
        },
      ],
      repeat: true,
      pageSize: 1,
      max: 2,
      label: t('CATEGORIES'),
    },
  ] as UIForm<Scenario>;
  let rowId: ID;
  let colId: ID;
  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.SETTINGS),
    view: ({ attrs }) => {
      const { model } = attrs.state;
      const { inconsistencies } = model.scenario;
      const rowComp =
        rowId &&
        model.scenario.components.filter((c) => c.id === rowId).shift();
      const colComp =
        colId &&
        model.scenario.components.filter((c) => c.id === colId).shift();
      return [
        m('.settings-page.row', [
          m(Tabs, {
            tabs: [
              {
                title: t('MODEL'),
                vnode: m('.model-settings.row', [
                  m(FlatButton, {
                    className: 'right',
                    iconName: 'delete',
                    label: t('DELETE'),
                    modalId: 'deleteModel',
                  }),
                  m(LayoutForm, {
                    obj: model.scenario,
                    form,
                    onchange: () => {
                      saveModel(attrs, model);
                    },
                  } as FormAttributes<Scenario>),
                ]),
              },
              {
                title: t('INCONSISTENCIES', 'title'),
                vnode: m('.inconsistencies-settings.row', [
                  m(Select, {
                    checkedId: rowId,
                    iconName: 'view_stream',
                    className: 'col s6 m4',
                    placeholder: t('i18n', 'pickOne'),
                    label: t('INCONSISTENCIES', 'SELECT_ROW'),
                    options: model.scenario.components,
                    onchange: (ids) => (rowId = ids[0] as string),
                  }),
                  m(Select, {
                    checkedId: colId,
                    iconName: 'view_week',
                    className: 'col s6 m4',
                    placeholder: t('i18n', 'pickOne'),
                    label: t('INCONSISTENCIES', 'SELECT_COL'),
                    options: model.scenario.components,
                    onchange: (ids) => (colId = ids[0] as string),
                  }),
                  m(
                    '.col.s12.m4',
                    m('.card', [
                      m('ul', [
                        m(
                          'li',
                          m(Icon, {
                            style: 'vertical-align: bottom',
                            iconName: 'check_circle_outline',
                          }),
                          t('COMBINATIONS', 'POSSIBLE')
                        ),
                        m(
                          'li',
                          m(Icon, {
                            style: 'vertical-align: bottom',
                            iconName: 'radio_button_unchecked',
                          }),
                          t('COMBINATIONS', 'IMPOSSIBLE')
                        ),
                        m(
                          'li',
                          m(Icon, {
                            style: 'vertical-align: bottom',
                            iconName: 'blur_circular',
                          }),
                          t('COMBINATIONS', 'IMPROBABLE')
                        ),
                      ]),
                    ])
                  ),
                  rowComp &&
                    colComp &&
                    m(
                      '.col.s12',
                      m('.row', [
                        m(
                          '.col.s12',
                          m('table.responsive-table.highlight', [
                            m(
                              'thead',
                              m('tr', [
                                m('th', `${rowComp.label} \\ ${colComp.label}`),
                                ...colComp.values.map((v) => m('th', v.label)),
                              ]),
                              rowComp.values.map((r) =>
                                m('tr', [
                                  m('td', r.label),
                                  ...colComp.values.map((c) =>
                                    m(
                                      'td',
                                      m(InconsistencyCheckbox, {
                                        rowId: r.id,
                                        colId: c.id,
                                        inconsistencies,
                                        callback: async () =>
                                          await saveModel(attrs, model),
                                      })
                                      // inconsistencies[key(r.id, c.id)] || 'NONE'
                                    )
                                  ),
                                ])
                              )
                            ),
                          ])
                        ),
                      ])
                    ),
                ]),
              },
            ],
          }),
          m(ModalPanel, {
            id: 'deleteModel',
            title: t('DELETE_ITEM', 'title', { item: t('MODEL') }),
            description: t('DELETE_ITEM', 'description', { item: t('MODEL') }),
            // options: { opacity: 0.7 },
            buttons: [
              {
                label: t('CANCEL'),
              },
              {
                label: t('OK'),
                onclick: () => {
                  const newModel = {
                    version: 1,
                    lastUpdate: Date.now(),
                    scenario: {
                      id: '',
                      label: '',
                      desc: '',
                      inconsistencies: {},
                      categories: [],
                      components: [],
                      narratives: [],
                    } as Scenario,
                  } as DataModel;
                  saveModel(attrs, newModel);
                },
              },
            ],
          }),
        ]),
      ];
    },
  };
};
