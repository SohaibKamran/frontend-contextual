import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { StorageService } from '../services/storage.service';
import { ToolbarHelpers } from './toolbar.helpers';
// import { menuItems } from '../sidemenu/menuItems';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cdk-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() sidenav;
  @Input() sidebar;
  @Input() drawer;
  @Input() matDrawerShow;
  isMobileForHome = false;
  title = "";
  @Input() currentRoute;

  searchOpen = false;
  toolbarHelpers = ToolbarHelpers;
  constructor(public storageService: StorageService, public sharedService: SharedService, private router: Router, private media: MediaObserver) {
  }


  logout = () => {
    this.storageService.removeItem("token")
    this.router.navigate(["/login"])
  }

  @HostListener("window:resize", [])
  private onResize() {
    this.toggleToolbar()
  }

  toggleToolbar() {
    if (this.media.isActive('lt-sm')) {
      this.isMobileForHome = true;
    }
    else if (this.media.isActive('gt-sm') || this.media.isActive('gt-xs')) {
      this.isMobileForHome = false;
    }
  }

  ngOnInit() {
    this.toggleToolbar()
  }

  ngOnChanges(){
    this.checkUrl()
  }

  checkUrl() {
    // for (const x in menuItems) {
    //   if (menuItems[x].link == this.currentRoute) {
    //     this.title = menuItems[x].name
    //   }
    // }
  }
}
