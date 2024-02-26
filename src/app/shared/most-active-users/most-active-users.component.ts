import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { UserAccountsService } from 'src/app/pages/user-accounts/user-accounts.service';

@Component({
  standalone: true,
  imports: [CommonModule, CoreModule],
  selector: 'app-most-active-users',
  templateUrl: './most-active-users.component.html',
  styleUrls: ['./most-active-users.component.scss']
})
export class MostActiveUsersComponent implements OnInit, OnDestroy {
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 10, pageNo: 1 }
  activeUsers: any = []
  totalImpressions: number
  totalUsers = 0
  count = 0
  @Input() navigateTo: string
  @Input() cardHeight: string
  body: any
  constructor(public apiService: ApiService, public router: Router, private userAccountService: UserAccountsService) {
  }
  ngOnInit(): void {
    this.body = {
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit
    }
    this.fetchData()

  }
  fetchData() {
    if (this.count != this.totalUsers || this.count == 0) {
      this.apiService.sendRequest(requests.getMostActiveUsers, 'post', this.body).subscribe((res: any) => {
        // this.activeUsers = res
        // console.log("Active Users",this.activeUsers)
        for (let i = 0; i < res?.data?.rows?.length; i++) {
          this.count = res?.data?.count
          this.activeUsers[this.totalUsers] = res?.data?.rows[i]?.User
          this.activeUsers[this.totalUsers].totalImpressions = res?.data.rows[i]?.pauseImpression
          this.totalUsers++
          // console.log(this.totalImpressions)
        }
        console.log(this.activeUsers)
      })
    }
  }

  ngOnDestroy(): void {

  }

  routeToUserAccounts(user: any = null, flag?:boolean) {
    if (user) {
      this.apiService.sendRequest(requests.getMostActiveUsers, 'post', this.body)
        .subscribe((res: any) => {
          // console.log(res);
          console.log(res)
          sessionStorage.setItem('user', JSON.stringify({
            pageNo: res?.data?.pageNoOfUser,
            count: res?.data?.count
          }))
          if(!this.navigateTo){
            this.userAccountService.userClicked.next(true)
          }
          else {
            this.router.navigate([this.navigateTo])
          }
        })
    }
    else {
      if(this.navigateTo)
      this.router.navigate([this.navigateTo])
    }
  }
  fetchPageNumber(user: any, flag?: boolean) {
    this.body = {
      ...this.body,
      clickedOnViewerId: user.id,
      limitOfUserListing: this.pagination.limit
    }
    this.userAccountService.setUserId(user.id)
    this.routeToUserAccounts(user, flag)

  }
  onScrollEnd(e) {
    // console.log(e.endReached);
    console.log(e.endReached);
    if (e.endReached) {
      this.pagination.pageNo++
      this.body = {
        ...this.body, pageNo: this.pagination.pageNo
      }
      this.fetchData()
    }
  }
  
}
