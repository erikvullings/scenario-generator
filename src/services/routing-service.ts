import m, { RouteDefs } from 'mithril';
import { Dashboards, IDashboard } from '../models';
import { Layout } from '../components/layout';
import { AboutPage, CreateBoxPage, HomePage } from '../components';
import { cells } from './state-mgmt';
import { t } from './translations';

class RoutingService {
  private dashboards!: ReadonlyArray<IDashboard>;

  constructor() {}

  public init() {
    const routes = [
      {
        id: Dashboards.HOME,
        title: t('home'),
        icon: 'home',
        route: t('home_route'),
        visible: true,
        component: HomePage,
      },
      {
        id: Dashboards.DEFINE_BOX,
        title: t('DEFINE_BOX'),
        icon: 'grid_view',
        route: t('define_box_route'),
        visible: true,
        component: CreateBoxPage,
      },
      {
        id: Dashboards.ABOUT,
        title: t('about'),
        icon: 'info',
        route: t('about_route'),
        visible: true,
        component: AboutPage,
      },
      // {
      //   id: Dashboards.SETTINGS,
      //   title: t('settings'),
      //   icon: 'settings',
      //   iconClass: 'blue-text',
      //   route: t('settings_route'),
      //   visible: true,
      //   component: SettingsPage,
      // },
    ];
    // console.log(JSON.stringify(routes, null, 2));
    this.setList(routes);
    // console.log(JSON.stringify(this.dashboards, null, 2));
  }

  public getList() {
    return this.dashboards;
  }

  public setList(list: IDashboard[]) {
    this.dashboards = Object.freeze(list);
  }

  public get defaultRoute() {
    const dashboard = this.dashboards.filter((d) => d.default).shift();
    return dashboard ? dashboard.route : this.dashboards[0].route;
  }

  public route(
    dashboardId: Dashboards,
    query?: { [key: string]: string | number | undefined }
  ) {
    const dashboard = this.dashboards
      .filter((d) => d.id === dashboardId)
      .shift();
    return dashboard
      ? '#!' + dashboard.route + (query ? '?' + m.buildQueryString(query) : '')
      : this.defaultRoute;
  }

  public href(dashboardId: Dashboards, params = '' as string | number) {
    const dashboard = this.dashboards
      .filter((d) => d.id === dashboardId)
      .shift();
    return dashboard
      ? `#!${dashboard.route.replace(/:\w*/, '')}${params}`
      : this.defaultRoute;
  }

  public switchTo(
    dashboardId: Dashboards,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined }
  ) {
    const dashboard = this.dashboards
      .filter((d) => d.id === dashboardId)
      .shift();
    if (dashboard) {
      const url =
        dashboard.route + (query ? '?' + m.buildQueryString(query) : '');
      m.route.set(url, params);
    }
  }

  public routingTable() {
    return this.dashboards.reduce((p, c) => {
      p[c.route] =
        c.hasNavBar === false
          ? {
              render: () => m(c.component, cells()),
            }
          : {
              // onmatch:
              //   c.id === Dashboards.LOGIN
              //     ? undefined
              //     : () => {
              //         if (c.id !== Dashboards.HOME && !Auth.isLoggedIn()) m.route.set('/login');
              //       },
              render: () => m(Layout, cells(), m(c.component, cells())),
            };
      return p;
    }, {} as RouteDefs);
  }
}

export const routingSvc: RoutingService = new RoutingService();
