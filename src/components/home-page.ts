import m from 'mithril';
import {
  Button,
  Icon,
  InputCheckbox,
  ModalPanel,
  RadioButtons,
  padLeft,
} from 'mithril-materialized';
import background from '../assets/background.webp';
import DutchFlag from '../assets/flag-nl.png';
import EnglishFlag from '../assets/flag-en.png';
import {
  MeiosisComponent,
  changePage,
  routingSvc,
  saveModel,
  setLanguage,
  setPage,
  t,
} from '../services';
import { Dashboards, DataModel, OldDataModel, defaultModels } from '../models';
import { convertFromOld, formatDate } from '../utils';
// import { padLeft } from '';

export const HomePage: MeiosisComponent = () => {
  const readerAvailable =
    window.File && window.FileReader && window.FileList && window.Blob;
  let selectedId = 0;
  let removeAllKeyValues = false;

  return {
    oninit: ({ attrs }) => {
      setPage(attrs, Dashboards.HOME);
      // const uriModel = m.route.param('model');
      // if (!uriModel) {
      //   return;
      // }
      // try {
      //   const decompressed = lz.decompressFromEncodedURIComponent(uriModel);
      //   if (!decompressed) {
      //     return;
      //   }
      //   const model = JSON.parse(decompressed);
      //   saveModel(model);
      //   changePage(Dashboards.OVERVIEW);
      // } catch (err) {
      //   console.error(err);
      // }
    },
    view: ({ attrs }) => {
      const isCleared = false;
      const { model, language } = attrs.state;
      const {
        scenario: { narratives = [], components },
      } = model;

      console.log(narratives);
      const selectedNarratives = narratives
        .filter((n) => n.included)
        .sort((a, b) => (a.label || '').localeCompare(b.label));
      const lookup = components.reduce((acc, cur) => {
        cur.values &&
          cur.values.forEach((v) => {
            acc[v.id] = v.label;
          });
        return acc;
      }, {} as Record<string, string>);
      return [
        m('div', { style: 'padding-top: 1rem;position: relative;' }, [
          m(
            '.row',
            m(
              '.col.s12',
              m('img.responsive-img.center[alt=fountain pen]', {
                src: background,
              })
            )
          ),
          m('.buttons.center', { style: 'margin: 10px auto;' }, [
            [
              m(
                '.language-option',
                {
                  onclick: () => setLanguage('nl'),
                },
                [
                  m('img', {
                    src: DutchFlag,
                    alt: 'Nederlands',
                    title: 'Nederlands',
                    disabled: language === 'nl',
                    class: language === 'nl' ? 'disabled-image' : 'clickable',
                  }),
                  m('span', 'Nederlands'),
                ]
              ),
              m(
                '.language-option',
                {
                  onclick: () => setLanguage('en'),
                },
                [
                  m('img', {
                    src: EnglishFlag,
                    alt: 'English',
                    title: 'English',
                    disabled: language === 'en',
                    class: language === 'en' ? 'disabled-image' : 'clickable',
                  }),
                  m('span', 'English'),
                ]
              ),
            ],
            m(Button, {
              iconName: 'clear',
              disabled: isCleared,
              className: 'btn-large',
              label: t('CLEAR'),
              modalId: 'clearAll',
            }),
            m('a#downloadAnchorElem', { style: 'display:none' }),
            m(Button, {
              iconName: 'download',
              disabled: isCleared,
              className: 'btn-large',
              label: t('DOWNLOAD'),
              onclick: () => {
                const dlAnchorElem =
                  document.getElementById('downloadAnchorElem');
                if (!dlAnchorElem) {
                  return;
                }
                const version =
                  typeof model.version === 'undefined' ? 1 : ++model.version;
                const dataStr =
                  'data:text/json;charset=utf-8,' +
                  encodeURIComponent(JSON.stringify({ ...model, version }));
                dlAnchorElem.setAttribute('href', dataStr);
                dlAnchorElem.setAttribute(
                  'download',
                  `${formatDate()}_v${padLeft(
                    version,
                    3
                  )}_scenario_generator.json`
                );
                dlAnchorElem.click();
              },
            }),
            m('input#selectFiles[type=file][accept=.json]', {
              style: 'display:none',
            }),
            // m('input#selectFiles[type=file][accept=.json,.pdf]', { style: 'display:none' }),
            readerAvailable &&
              m(Button, {
                iconName: 'upload',
                className: 'btn-large',
                label: 'Upload',
                onclick: () => {
                  const fileInput = document.getElementById(
                    'selectFiles'
                  ) as HTMLInputElement;
                  fileInput.onchange = () => {
                    if (!fileInput) {
                      return;
                    }
                    const files = fileInput.files;
                    if (!files || (files && files.length <= 0)) {
                      return;
                    }
                    const data = files && files.item(0);
                    const isJson = data && /json$/i.test(data.name);
                    const reader = new FileReader();
                    reader.onload = async (e: ProgressEvent<FileReader>) => {
                      if (isJson) {
                        const result = (e &&
                          e.target &&
                          e.target.result) as string;
                        const json = JSON.parse(result.toString()) as
                          | DataModel
                          | OldDataModel;
                        if (json) {
                          const dataModel = json.version
                            ? (json as DataModel)
                            : convertFromOld(json as OldDataModel);
                          saveModel(attrs, dataModel);
                          changePage(attrs, Dashboards.DEFINE_BOX);
                        }
                        // json &&
                        //   json.version &&
                        //   saveModel(attrs, json as DataModel);
                        // changePage(attrs, Dashboards.HOME);
                      }
                    };
                    if (data) {
                      isJson
                        ? reader.readAsText(data)
                        : reader.readAsArrayBuffer(data);
                    }
                  };
                  fileInput.click();
                },
              }),
            // m(Button, {
            //   iconName: 'link',
            //   className: 'btn-large',
            //   label: 'Permalink',
            //   onclick: () => {
            //     const permLink = document.createElement('input') as HTMLInputElement;
            //     document.body.appendChild(permLink);
            //     if (!permLink) {
            //       return;
            //     }
            //     const compressed = lz.compressToEncodedURIComponent(JSON.stringify(model));
            //     const url = `${window.location.href}${
            //       /\?/.test(window.location.href) ? '&' : '?'
            //     }model=${compressed}`;
            //     permLink.value = url;
            //     permLink.select();
            //     permLink.setSelectionRange(0, 999999); // For mobile devices
            //     try {
            //       const successful = document.execCommand('copy');
            //       if (successful) {
            //         M.toast({
            //           html: 'Copied permanent link to clipboard.',
            //           classes: 'yellow black-text',
            //         });
            //       }
            //     } catch (err) {
            //       M.toast({
            //         html: 'Failed copying link to clipboard: ' + err,
            //         classes: 'red',
            //       });
            //     } finally {
            //       document.body.removeChild(permLink);
            //     }
            //   },
            // }),
          ]),
          selectedNarratives.length > 0 &&
            m(
              '.row.narratives',
              m(
                '.col.s12',
                selectedNarratives.map((n) =>
                  m(
                    'ul',
                    m('li.narrative', [
                      m('.title', n.label),
                      m(
                        'p',
                        n.components &&
                          components
                            .map(
                              (c) =>
                                `${c.label}: ${n.components[c.id]
                                  .map((id) => lookup[id])
                                  .join(', ')}`
                            )
                            .join(', ') + '.'
                      ),
                    ])
                  )
                )
              )
            ),
          m(
            '.section.white',
            m('.row.container.center', [
              m('.row', m('.col.s12.align-center', 'TODO')),
              m('.row', [
                m(
                  '.col.s12.m4',
                  m('.icon-block', [
                    m('.center', m(Icon, { iconName: 'visibility' })),
                    m('h5.center', 'Beeldvorming'),
                    m('p', 'TODO'),
                  ])
                ),
                m(
                  '.col.s12.m4',
                  m('.icon-block', [
                    m('.center', m(Icon, { iconName: 'balance' })),
                    m('h5.center', 'Beoordeel'),
                    m('p', `TODO`),
                  ])
                ),
                m(
                  '.col.s12.m4',
                  m('.icon-block', [
                    m('.center', m(Icon, { iconName: 'edit_note' })),
                    m('h5.center', 'Beslis'),
                    m('p', 'TODO'),
                  ])
                ),
              ]),
            ])
          ),
          m(ModalPanel, {
            id: 'clearAll',
            title: t('NEW_MODEL', 'title'),
            description: m('.row', [
              m('.col.s12', [t('NEW_MODEL', 'description')]),
              m('.col.s12', [
                m(
                  '.row',
                  m(RadioButtons, {
                    label: t('NEW_MODEL', 'choose'),
                    checkedId: 1,
                    options: defaultModels.map((_, i) => ({
                      id: i + 1,
                      label: `<strong>${t('MODEL_NAMES', i)}: </strong>${t(
                        'MODEL_DESC',
                        i
                      )}`,
                    })),
                    onchange: (i) => (selectedId = (i as number) - 1),
                  })
                ),
                m(
                  '.row',
                  m(InputCheckbox, {
                    label: t('NEW_MODEL', 'remove'),
                    checked: removeAllKeyValues,
                    onchange: (v) => (removeAllKeyValues = v),
                  })
                ),
              ]),
            ]),
            buttons: [
              {
                label: t('YES'),
                iconName: 'delete',
                onclick: () => {
                  saveModel(attrs, defaultModels[selectedId]);
                  routingSvc.switchTo(Dashboards.HOME);
                },
              },
              { label: t('NO'), iconName: 'cancel' },
            ],
          }),
        ]),
      ];
    },
  };
};
