// Angular import
import { Component, NgZone } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// Project import
import { MantisConfig } from 'src/app/app-config';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  // public props
  config: object;
  navCollapsed: boolean;
  navCollapsedMob: boolean;
  windowWidth: number;
  submenuCollapse: boolean;
  userRole: string;
  isUserDemo: boolean = false;

  // Constructor
  constructor(private zone: NgZone, private location: Location, private locationStrategy: LocationStrategy) {
    this.config = MantisConfig;

    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }

    if (
      current_url === this.location['_baseHref'] + '/layout/theme-compact' ||
      current_url === this.location['_baseHref'] + '/layout/box'
    ) {
      this.config['theme-compact'] = true;
    }

    this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? MantisConfig.isCollapseMenu : false;
    this.navCollapsedMob = false;

    this.userRole = localStorage.getItem('role');
    console.log(this.userRole)
    if (this.userRole == '1'){
      this.isUserDemo = true;
      document.body.classList.add('demo-user');
    }else{
      document.body.classList.remove('demo-user');
    }
  }

  // public method
  navMobClick() {
    if (this.navCollapsedMob && (document.querySelector('app-navigation.coded-navbar') as HTMLDivElement).classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }
}
