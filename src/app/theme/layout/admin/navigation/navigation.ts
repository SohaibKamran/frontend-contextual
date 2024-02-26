import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;

  title: string;
  type: 'item' | 'collapse' | 'group' | 'toggle' | 'header' | 'menu';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  role?: 5 | 4 | 2 | 1;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'Admin',
    title: 'ADMIN',
    type: 'group',
    icon: 'icon-navigation',
    role: 4,
    children: [
      {
        id: 'home',
        title: 'Home',
        type: 'item',
        url: '/',
        classes: 'nav-item',
        // icon: 'ti ti-home'
        icon: 'icon-home'
      },
      {
        id: 'videos',
        title: 'Video Catalog',
        type: 'item',
        url: '/videos',
        classes: 'nav-item',
        icon: 'icon-video-icon'
      },
      {
        id: 'streamer-dashboard',
        title: 'Streamer Dashboard',
        type: 'item',
        url: '/streamer-dashboard',
        classes: 'nav-item',
        icon: 'icon-video-icon'
      },
      {
        id: 'database',
        title: 'Database',
        type: 'item',
        url: '/database',
        classes: 'nav-item',
        // icon: 'ti ti-home'
        icon: 'bi-database'
      },
      {
        id: 'ad-Inventory',
        title: 'Ad Inventory',
        type: 'item',
        url: '/demo',
        classes: 'nav-item',
        // icon: 'ti ti-home'
        icon: 'bi-badge-ad'
      },
      {
        id: 'manage-advertisers',
        title: 'Manage Advertisers',
        type: 'item',
        url: '/manage-advertisers',
        classes: 'nav-item',
        // icon: 'ti ti-home'
        icon: 'bi-buildings'
      },
      {
        id: 'manage-streamer',
        title: 'Manage Streamers',
        type: 'item',
        url: '/manage-streamer',
        classes: 'nav-item',
        // icon: 'ti ti-home'
        icon: 'bi-buildings'
      },
      {
        id: 'manage-annotators',
        title: 'Manage Annotators',
        type: 'item',
        url: '/manage-annotators',
        classes: 'nav-item',
        // icon: 'ti ti-home'
        icon: 'bi-briefcase'
      },
      {
        id: 'user-accounts',
        title: 'User Accounts',
        type: 'item',
        url: '/user-accounts',
        classes: 'nav-item',
        // icon: 'ti ti-home'
        icon: 'bi-people'
      },
      {
        id: 'scene-mapping',
        title: 'Scene Mapping',
        type: 'item',
        url: '/scene-mapping',
        classes: 'nav-item',
        // icon: 'ti ti-home'
        icon: 'bi-people'
      },
    ]
  },
  {
    id: 'Indexing',
    title: 'INDEXING',
    type: 'group',
    icon: 'icon-navigation',
    role: 4,
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/indexer',
        classes: 'nav-item',
        icon: 'icon-dashboard'
      },
      {
        id: 'annotator',
        title: 'Annotator',
        type: 'item',
        url: '/tagger',
        classes: 'nav-item',
        icon: 'icon-product'
      },
    ]
  },
  {
    id: 'demo',
    title: 'DEMO USER',
    type: 'group',
    icon: 'icon-navigation',
    role: 4,
    children: [
      {
        id: 'watchvideo',
        title: 'Watch Video',
        type: 'item',
        url: '/user/player',
        classes: 'nav-item',
        icon: 'icon-arrow-up-circle'
      },
      {
        id: 'shoping',
        title: 'My Shopping',
        type: 'item',
        url: 'user/shopping',
        classes: 'nav-item',
        icon: 'bi-heart'
      },
      {
        id: 'email',
        title: 'My Email',
        type: 'item',
        url: 'user/my-emails',
        classes: 'nav-item',
        icon: 'bi-envelope'
      },
    ]
  },
  // TODO: STREAMER DEMO
  // {
  //   id: 'streamer',
  //   title: 'STREAMER DEMO',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: 4,
  //   children: [
  //     {
  //       id: 'dashbaord',
  //       title: 'Dashboard',
  //       type: 'item',
  //       url: '/user/dashboard',
  //       classes: 'nav-item',
  //       icon: 'bi-bar-chart'
  //     },
  //     {
  //       id: 'ad',
  //       title: 'Ad Match',
  //       type: 'collapse',
  //       url: '/email',
  //       classes: 'nav-item',
  //       icon: 'bi-search',
  //       children: [
  //         {
  //         id: 'ad1',
  //         title: 'By Advertiser',
  //         type: 'item',
  //         url: '/email',
  //         classes: 'nav-item',
  //         // icon: 'icon-Heart-Empty',
  //       },
  //         {
  //         id: 'ad2',
  //         title: 'By Video',
  //         type: 'item',
  //         url: '/email',
  //         classes: 'nav-item',
  //         // icon: 'icon-Heart-Empty',
  //       },
  //         {
  //         id: 'ad3',
  //         title: 'By Actor',
  //         type: 'item',
  //         url: '/email',
  //         classes: 'nav-item',
  //         // icon: 'icon-Heart-Empty',
  //       },
  //     ]
  //     },
  //   ]
  // },
  {
    id: 'Indexing',
    title: 'INDEXING',
    type: 'group',
    icon: 'icon-navigation',
    role: 2,
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/indexer',
        classes: 'nav-item',
        icon: 'icon-dashboard'
      },
      {
        id: 'annotator',
        title: 'Annotator',
        type: 'item',
        url: '/tagger',
        classes: 'nav-item',
        icon: 'icon-product'
      },
    ]
  },
  {
    id: 'demo',
    title: 'DEMO USER',
    type: 'group',
    icon: 'icon-navigation',
    role: 2,
    children: [
      {
        id: 'watchvideo',
        title: 'Watch Video',
        type: 'item',
        url: '/user/player',
        classes: 'nav-item',
        icon: 'icon-arrow-up-circle'
      },
      {
        id: 'shoping',
        title: 'My Shopping',
        type: 'item',
        url: 'user/shopping',
        classes: 'nav-item',
        icon: 'bi-heart'
      },
      {
        id: 'email',
        title: 'My Email',
        type: 'item',
        url: 'user/my-emails',
        classes: 'nav-item',
        icon: 'bi-envelope'
      },
    ]
  },
  // TODO: STREAMER DEMO
  // {
  //   id: 'streamer',
  //   title: 'STREAMER DEMO',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: 2,
  //   children: [
  //     {
  //       id: 'dashbaord',
  //       title: 'Dashboard',
  //       type: 'item',
  //       url: '/user/dashboard',
  //       classes: 'nav-item',
  //       icon: 'bi-bar-chart'
  //     },
  //     {
  //       id: 'ad',
  //       title: 'Ad Match',
  //       type: 'collapse',
  //       url: '/email',
  //       classes: 'nav-item',
  //       icon: 'bi-search',
  //       children: [
  //         {
  //         id: 'ad1',
  //         title: 'By Advertiser',
  //         type: 'item',
  //         url: '/email',
  //         classes: 'nav-item',
  //         // icon: 'icon-Heart-Empty',
  //       },
  //         {
  //         id: 'ad2',
  //         title: 'By Video',
  //         type: 'item',
  //         url: '/email',
  //         classes: 'nav-item',
  //         // icon: 'icon-Heart-Empty',
  //       },
  //         {
  //         id: 'ad3',
  //         title: 'By Actor',
  //         type: 'item',
  //         url: '/email',
  //         classes: 'nav-item',
  //         // icon: 'icon-Heart-Empty',
  //       },
  //     ]
  //     },
  //   ]
  // },
  {
    id: 'demo',
    title: 'DEMO USER',
    type: 'group',
    icon: 'icon-navigation',
    role: 1,
    children: [
      {
        id: 'watchvideo',
        title: 'Watch Video',
        type: 'item',
        url: '/user/player',
        classes: 'nav-item',
        icon: 'icon-arrow-up-circle'
      },
      {
        id: 'shoping',
        title: 'My Shopping',
        type: 'item',
        url: 'user/shopping',
        classes: 'nav-item',
        icon: 'bi-heart'
      },
      {
        id: 'email',
        title: 'My Email',
        type: 'item',
        url: 'user/my-emails',
        classes: 'nav-item',
        icon: 'bi-envelope'
      },
    ]
  },
  // TODO: STREAMER DEMO
  // {
  //   id: 'streamer',
  //   title: 'STREAMER DEMO',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   role: 1,
  //   children: [
  //     {
  //       id: 'dashbaord',
  //       title: 'Dashboard',
  //       type: 'item',
  //       url: '/user/dashboard',
  //       classes: 'nav-item',
  //       icon: 'bi-bar-chart'
  //     },
  //     {
  //       id: 'ad',
  //       title: 'Ad Match',
  //       type: 'collapse',
  //       url: '/email',
  //       classes: 'nav-item',
  //       icon: 'bi-search',
  //       children: [
  //         {
  //         id: 'ad1',
  //         title: 'By Advertiser',
  //         type: 'item',
  //         url: '/email',
  //         classes: 'nav-item',
  //         // icon: 'icon-Heart-Empty',
  //       },
  //         {
  //         id: 'ad2',
  //         title: 'By Video',
  //         type: 'item',
  //         url: '/email',
  //         classes: 'nav-item',
  //         // icon: 'icon-Heart-Empty',
  //       },
  //         {
  //         id: 'ad3',
  //         title: 'By Actor',
  //         type: 'item',
  //         url: '/email',
  //         classes: 'nav-item',
  //         // icon: 'icon-Heart-Empty',
  //       },
  //     ]
  //     },
  //   ]
  // },
  {
    id: 'Streamer',
    title: 'STREAMER',
    type: 'group',
    icon: 'icon-navigation',
    role: 4,
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: 'streamer/dashboard',
        classes: 'nav-item',
        icon: 'bi-bar-chart'
      },{
        id: 'keyManagement',
        title: 'Manage Keys',
        type: 'item',
        url: 'streamer/manage-keys',
        classes: 'nav-item',
        icon: 'bi-key'
      },
    ]
  },
  {
    id: 'Streamer',
    title: 'STREAMER',
    type: 'group',
    icon: 'icon-navigation',
    role: 5,
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: 'streamer/dashboard',
        classes: 'nav-item',
        icon: 'bi-bar-chart'
      },{
        id: 'keyManagement',
        title: 'Manage Keys',
        type: 'item',
        url: 'streamer/manage-keys',
        classes: 'nav-item',
        icon: 'bi-key'
      },
    ]
  },
  {
    id: 'Account',
    title: 'ACCOUNT',
    type: 'group',
    icon: 'icon-navigation',
    role: "common",
    children: [
      {
        id: 'profile',
        title: 'Profile',
        type: 'item',
        url: '/profile',
        classes: 'nav-item',
        // icon: 'ti ti-user'
        icon: 'icon-person-circle'
      },
      {
        id: 'logout',
        title: 'Logout',
        type: 'item',
        url: '/asd',
        classes: 'nav-item',
        // icon: 'ti ti-logout'
        icon: 'icon-logout'
      },
      {
        id: 'justArrow',
        title: 'Collapse',
        type: 'toggle',
        url: '',
        classes: 'nav-item',
        // icon: 'fa fa-arrow-left'
        icon: 'icon-chevron-double-left'
      }
    ]
  },

];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
