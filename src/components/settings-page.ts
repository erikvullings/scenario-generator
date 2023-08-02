import m from 'mithril';
import { Dashboards, DataModel, Scenario } from '../models';
import { MeiosisComponent, saveModel, setPage, t } from '../services';
import { FlatButton, ModalPanel, Tabs } from 'mithril-materialized';
import { FormAttributes, LayoutForm, UIForm } from 'mithril-ui-form';

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
  return {
    oninit: ({ attrs }) => setPage(attrs, Dashboards.SETTINGS),
    view: ({ attrs }) => {
      const { model } = attrs.state;
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
              { title: t('INCONSISTENCIES') },
            ],
          }),
          m(ModalPanel, {
            id: 'deleteModel',
            title: t('DELETE_MODEL', 'title'),
            description: t('DELETE_MODEL', 'description'),
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
                      inconsistencies: [],
                      categories: [],
                      components: [],
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
