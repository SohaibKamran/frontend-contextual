/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, Input } from '@angular/core';
import { requests } from 'src/app/core/config/config';
import { ApiService } from 'src/app/core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagetitle',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss']
})

/**
 * Page Title Component
 */
export class PagetitleComponent implements OnInit {

  @Input()
  breadcrumbItems!: Array<{
    active?: boolean;
    label?: string;
    url?: string
  }>;
  lastLogin: any
  userRole: string;
  userImage: any;
  @Input() title: string | undefined;


  constructor(private apiService: ApiService, private router: Router) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.lastLogin = localStorage.getItem('lastLogin') || '{}'
    this.lastLogin = this.lastLogin.replace(/\T.*/, '');
    if (this.title?.includes('Welcome Back')) {
      if(localStorage.getItem('user'))
        this.title = this.title + localStorage.getItem('user') + '!'
      else 
        this.title = this.title + '!'
      const simulatedtaggerid = JSON.parse(localStorage.getItem('simulatedtaggerid'))
       const simulateduserid = JSON.parse(localStorage.getItem('simulateduserid'))
       let userId = JSON.parse(localStorage.getItem('userId'))
       if (simulatedtaggerid)
         userId = Object.assign(simulatedtaggerid)
       else if (simulateduserid){
         userId = Object.assign(simulateduserid)
        }
      }

    const userId = JSON.parse(localStorage.getItem('userId'))
    if(!this.title){
      this.lastLogin=null
    }
    if(!localStorage.getItem('profilePicture') || localStorage.getItem('profilePicture') === 'null'){
      this.apiService.sendRequest(requests.getUserById, 'post', { userId }).subscribe(
        (res: any) => {
          localStorage.setItem('profilePicture', res?.data?.profilePicture)
          this.userImage = res?.data?.profilePicture
          });
    }
    else {
      this.userImage = localStorage.getItem('profilePicture')
    }
    if(!this.title)
      this.lastLogin=null
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.router.navigate(['/login']);
    localStorage.clear();
    sessionStorage.clear();
  }
}
