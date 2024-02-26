// angular import
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  // public props
  windowWidth: number;

  // constructor
  constructor() {
    this.windowWidth = window.innerWidth;
  }

  // public method
  component = [
    {
      title: 'Alerts'
    },
    {
      title: 'Accordions'
    },
    {
      title: 'Avatars'
    },
    {
      title: 'Badges'
    },
    {
      title: 'Breadcrumbs'
    },
    {
      title: 'Button'
    },
    {
      title: 'Buttons Groups'
    }
  ];

  component2 = [
    {
      title: 'Menus'
    },
    {
      title: 'Media Sliders / Carousel'
    },
    {
      title: 'Modals'
    },
    {
      title: 'Pagination'
    },
    {
      title: 'Progress Bars / Graphs'
    },
    {
      title: 'Search Bar'
    },
    {
      title: 'Tabs'
    }
  ];

  component3 = [
    {
      title: 'Advanced Stats'
    },
    {
      title: 'Advanced Cards'
    },
    {
      title: 'Lightbox'
    },
    {
      title: 'Notification'
    }
  ];

  drop_item = [
    {
      icon: 'ti ti-user',
      title: 'My Account'
    },
    {
      icon: 'ti ti-settings',
      title: 'Settings'
    },
    {
      icon: 'ti ti-headset',
      title: 'Support'
    },
    {
      icon: 'ti ti-lock',
      title: 'Lock Screen'
    },
    {
      icon: 'ti ti-power',
      title: 'Logout'
    }
  ];

  profile = [
    {
      icon: 'ti ti-edit-circle',
      title: 'Edit Profile'
    },
    // {
    //   icon: 'ti ti-user',
    //   title: 'View Profile'
    // },
    // {
    //   icon: 'ti ti-clipboard',
    //   title: 'Social Profile'
    // },
    // {
    //   icon: 'ti ti-edit-circle',
    //   title: 'Billing'
    // },
    {
      icon: 'ti ti-power',
      title: 'Logout'
    }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'History'
    }
  ];
}
