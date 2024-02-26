// Angular import
import { Component, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {  NgxSliderModule, Options } from '@angular-slider/ngx-slider';
// project import
import { NavigationItem } from 'src/app/theme/layout/admin/navigation/navigation';
import { CardComponent } from "../card/card.component";
import { NgbModal, ModalDismissReasons, NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { VideosFilterComponent } from 'src/app/pages/videos/videos-filter/videos-filter.component';

interface RangeSliderModel {
  minValue: number;
  maxValue: number;
  options: Options;
}
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  imports: [CommonModule, RouterModule, CardComponent, FormsModule, ReactiveFormsModule, NgbDropdownModule, NgxSliderModule],

})
export class BreadcrumbComponent {
  // public props
  @Input() type: string;
  navigation;
  breadcrumbList: Array<string> = [];
  navigationList;
  filterForm: FormGroup
  content;
  closeResult = '';
  minValue = 50;
  maxValue = 200;
  value = 100;
  options: Options = {
    floor: 0,
    ceil: 200
  };

  // Constructor
  constructor(private _router: Router,
    public nav: NavigationItem,
    private titleService: Title,
    private modalService: NgbModal) {
    this.navigation = this.nav.get();
    this.setBreadcrumb();
    this.type = 'theme1';
  }
  // public method
  setBreadcrumb() {
    let routerUrl: string;
    this._router.events.subscribe((router: NavigationEnd) => {
      routerUrl = router.urlAfterRedirects;
      if (routerUrl && typeof routerUrl === 'string') {
        this.breadcrumbList.length = 0;
        const activeLink = router.url;
        this.filterNavigation(activeLink);
      }
    });
  }

  // open(content?: any) {
  //   this.modalService.open(VideosFilterComponent, {
  //     windowClass: "modal-md",
  //     backdrop: "static",
  //     keyboard: false,
  //   });
  // }

  private getDismissReason(reason): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  filterNavigation(activeLink) {
    let result: object;
    let title = 'Welcome';
     this.navigation.forEach(function (a) {
      if (a.type === 'item' && 'url' in a && a.url === activeLink) {
        result = [
          {
            url: 'url' in a ? a.url : false,
            title: a.title,
            breadcrumbs: 'breadcrumbs' in a ? a.breadcrumbs : true,
            type: a.type
          }
        ];
        
        title = a.title;
      } else {
        if (a.type === 'group' && 'children' in a) {
          a.children.forEach(function (b) {
            if (b.type === 'item' && 'url' in b && b.url === activeLink) {
              result = [
                {
                  url: 'url' in a ? a.url : false,
                  title: a.title,
                  breadcrumbs: 'breadcrumbs' in a ? a.breadcrumbs : true,
                  type: a.type
                },
                {
                  url: 'url' in b ? b.url : false,
                  title: b.title,
                  breadcrumbs: 'breadcrumbs' in b ? b.breadcrumbs : true,
                  type: b.type
                }
              ];
              title = b.title;
            } else {
              if (b.type === 'collapse' && 'children' in b) {
                b.children.forEach(function (c) {
                  if (c.type === 'item' && 'url' in c && c.url === activeLink) {
                    result = [
                      {
                        url: 'url' in b ? b.url : false,
                        title: b.title,
                        breadcrumbs: 'breadcrumbs' in b ? b.breadcrumbs : true,
                        type: b.type
                      },
                      {
                        url: 'url' in c ? c.url : false,
                        title: c.title,
                        breadcrumbs: 'breadcrumbs' in c ? c.breadcrumbs : true,
                        type: c.type
                      }
                    ];
                    title = c.title;
                  } else {
                    if (c.type === 'collapse' && 'children' in c) {
                      c.children.forEach(function (d) {
                        if (d.type === 'item' && 'url' in d && d.url === activeLink) {
                          result = [
                            {
                              url: 'url' in c ? c.url : false,
                              title: c.title,
                              breadcrumbs: 'breadcrumbs' in c ? c.breadcrumbs : true,
                              type: c.type
                            },
                            {
                              url: 'url' in d ? d.url : false,
                              title: d.title,
                              breadcrumbs: 'breadcrumbs' in d ? d.breadcrumbs : true,
                              type: d.type
                            }
                          ];
                          title = d.title;
                        }
                      });
                    }
                  }
                });
              }
            }
          });
        }
      }
    });
    this.navigationList = result;
    // this.titleService.setTitle(title);
  }
}
