// Angular import
import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { environment } from 'src/environments/environment';

// project import
import { NavigationItem } from '../navigation';
import { MantisConfig } from 'src/app/app-config';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit, AfterViewInit {
  // public props
  @Output() NavCollapsedMob: EventEmitter<string> = new EventEmitter();
  @Output() SubmenuCollapse: EventEmitter<string> = new EventEmitter();
  @Output() NavCollapse: EventEmitter<any> = new EventEmitter();

  // version
  title = 'Demo application for version numbering';
  // currentApplicationVersion = environment.appVersion;

  config: object;
  navigation;
  prevDisabled: string;
  nextDisabled: string;
  contentWidth: number;
  wrapperWidth: number;
  scrollWidth: number;
  windowWidth: number;
  subMenuCollapsed: boolean;
  themeLayout: string;
  collapseItem: '';
  roleId: number;
  

  @ViewChild('navbarContent', { static: false }) navbarContent!: ElementRef;
  @ViewChild('navbarWrapper', { static: false }) navbarWrapper!: ElementRef;

  // Constructor
  constructor(public nav: NavigationItem, private zone: NgZone, private location: Location, private locationStrategy: LocationStrategy) {
    this.config = MantisConfig;
    this.windowWidth = window.innerWidth;
    this.themeLayout = MantisConfig.layout;

    this.navigation = this.nav.get();
    this.prevDisabled = 'disabled';
    this.nextDisabled = '';
    this.scrollWidth = 0;
    this.contentWidth = 0;
  }

  // Life cycle events
  ngOnInit() {
    this.roleId = JSON.parse(localStorage.getItem('role'));
    this.navigation = this.nav.get().filter(x => x.role === this.roleId  || x.role === 'common');
    if (this.windowWidth < 1025) {
      setTimeout(() => {
        (document.querySelector('.coded-navbar') as HTMLDivElement).classList.add('menupos-static');
        (document.querySelector('#nav-ps-mantis') as HTMLElement).style.maxHeight = '100%';
      }, 500);
    }
  }

  // public method
  ngAfterViewInit() {
    if (MantisConfig.layout === 'horizontal') {
      this.contentWidth = this.navbarContent.nativeElement.clientWidth;
      this.wrapperWidth = this.navbarWrapper.nativeElement.clientWidth;
    }
  }

  scrollPlus() {
    this.scrollWidth = this.scrollWidth + (this.wrapperWidth - 80);
    if (this.scrollWidth > this.contentWidth - this.wrapperWidth) {
      this.scrollWidth = this.contentWidth - this.wrapperWidth + 80;
      this.nextDisabled = 'disabled';
    }
    this.prevDisabled = '';
    (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
  }

  scrollMinus() {
    this.scrollWidth = this.scrollWidth - this.wrapperWidth;
    if (this.scrollWidth < 0) {
      this.scrollWidth = 0;
      this.prevDisabled = 'disabled';
    }
    this.nextDisabled = '';
    (document.querySelector('#side-nav-horizontal') as HTMLElement).style.marginLeft = '-' + this.scrollWidth + 'px';
  }

  fireLeave() {
    const sections = document.querySelectorAll('.coded-hasmenu');
    for (let i = 0; i < sections.length; i++) {
      sections[i].classList.remove('active');
      sections[i].classList.remove('coded-trigger');
    }

    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        last_parent.classList.add('active');
      }
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('coded-hasmenu')) {
        if (MantisConfig.layout === 'vertical') {
          parent.classList.add('coded-trigger');
        }
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('coded-hasmenu')) {
        if (MantisConfig.layout === 'vertical') {
          up_parent.classList.add('coded-trigger');
        }
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('coded-hasmenu')) {
        if (MantisConfig.layout === 'vertical') {
          last_parent.classList.add('coded-trigger');
        }
        last_parent.classList.add('active');
      }
    }
  }

  navMob() {
    if (this.windowWidth < 1025 && document.querySelector('app-navigation.coded-navbar').classList.contains('mob-open')) {
      this.NavCollapsedMob.emit();
    }
  }

  subMenuCollapse(subMenuContent) {
    this.SubmenuCollapse.emit(subMenuContent);
    this.collapseItem = subMenuContent;
  }
  navCollapse(data){
    this.NavCollapse.emit(true)
  }
}
