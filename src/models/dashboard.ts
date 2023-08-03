import { ComponentTypes } from 'mithril';

export type IconType = () => string | string;

export type IconResolver = () => string;

export interface IDashboard {
  id: Dashboards;
  default?: boolean;
  hasNavBar?: boolean;
  title: string | (() => string);
  icon: string | IconResolver;
  iconClass?: string;
  route: string;
  visible: boolean | (() => boolean);
  component: ComponentTypes<any, any>;
}

export enum Dashboards {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  DEFINE_BOX = 'DEFINE_BOX',
  GENERATE_SCENARIO = 'GENERATE_SCENARIO',
  SHOW_SCENARIO = 'SHOW_SCENARIO',
  SETTINGS = 'SETTINGS',
  HELP = 'HELP',
}
