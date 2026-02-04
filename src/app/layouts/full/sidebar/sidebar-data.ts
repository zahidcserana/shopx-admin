import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:atom-line-duotone',
    route: '/dashboard',
  },


  {
    navCap: 'Company',
  },
  {
    displayName: 'Client',
    iconName: 'solar:planet-2-linear',
    route: 'authentication',
    children: [
      {
        displayName: 'List',
        iconName: 'tabler:point',
        route: '/client',
      },
      {
        displayName: 'New',
        iconName: 'tabler:point',
        route: '/client/create',
      },
    ]
  },
  {
    displayName: 'Shop',
    iconName: 'solar:shop-2-linear',
    route: 'authentication',
    children: [
      {
        displayName: 'List',
        iconName: 'tabler:point',
        route: '/shop',
      },
      {
        displayName: 'New',
        iconName: 'tabler:point',
        route: '/shop/create',
      },
    ]
  },

  {
    navCap: 'Management',
  },
  {
    displayName: 'User',
    iconName: 'solar:lock-keyhole-unlocked-outline',
    route: '/ui-components/badge',
  },

  {
    navCap: 'Settings',
  },
  {
    displayName: 'Client',
    iconName: 'solar:file-text-line-duotone',
    route: '/ui-components/forms',
  },
  {
    displayName: 'Shop',
    iconName: 'solar:tablet-line-duotone',
    route: '/ui-components/tables',
  },

  {
    navCap: 'Security',
  },
  {
    displayName: 'Settings',
    iconName: 'solar:settings-linear',
    route: 'authentication',
    children: [
      {
        displayName: 'Coupon',
        iconName: 'tabler:point',
        route: '/authentication/login',
      },
      {
        displayName: 'Subscription',
        iconName: 'tabler:point',
        route: '/authentication/login',
      }
    ]
  },
  {
    displayName: 'Payments',
    iconName: 'solar:dollar-linear',
    route: 'authentication',
    children: [
      {
        displayName: 'List',
        iconName: 'tabler:point',
        route: '/authentication/register',
      }
    ]
  },


  {
    navCap: 'Accounts',
  },
  {
    displayName: 'Income',
    iconName: 'solar:widget-line-duotone',
    route: 'https://angular.tailwind-admin.com/dashboards/dashboard1',
    chip: true,
    external: true,
    chipClass: 'bg-light-secondary text-secondary',
    chipContent: 'Pro',
  },
  {
    displayName: 'expenditure',
    iconName: 'solar:bolt-line-duotone',
    route: 'front-pages',
    children: [
      {
        displayName: 'Home Page',
        iconName: 'tabler:point',
        chip: true,
        external: true,
        chipClass: 'bg-light-secondary text-secondary',
        chipContent: 'Pro',
        route: 'https://angular.tailwind-admin.com/front-pages/homepage',
      },
    ]
  },

];
