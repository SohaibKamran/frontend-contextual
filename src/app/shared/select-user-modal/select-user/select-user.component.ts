import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';

@Component({
  selector: 'app-select-user',
  standalone: true,
  imports: [CommonModule, NgbDropdown, NgSelectModule, NgbModule],
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss']
})
export class SelectUserComponent {
  @Input() redirectUrl
  users = []
  totalUserCount = 0;
  fetchedUserCount = 0;
  userId: number = null
  userPagination: { pageNo: number, limit: number, offset?: number } = { pageNo: 1, limit: 10 }
  constructor(private activeModal: NgbActiveModal, private router: Router, private apiService: ApiService) { }
  currentUser: any = null
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('userId'))
    this.users.push({ id: this.currentUser, fullName: 'Myself' })
    this.getUsers()
  }

  getUsers() {
    const body = {
      pageNo: this.userPagination.pageNo,
      limit: this.userPagination.limit,
      userType: 1
    }
    if (this.totalUserCount != this.fetchedUserCount || this.totalUserCount == 0) {
      this.apiService.sendRequest(requests.getUserListing, 'post', body).subscribe(async (res: any) => {
        this.totalUserCount = await res?.data?.count
        if (res?.data?.rows != 0)
          this.users = this.users?.concat(res?.data?.rows)
      })
    }
  }

  onUserScrollEnd(e) {
    this.userPagination.pageNo++
    this.getUsers()
  }

  onChange(user) {
    this.userId = user?.id
  }

  selectUser() {
    localStorage.setItem('simulateduserid', this.userId.toString())
    const showId = JSON.parse(sessionStorage.getItem('showId'))
    if (showId)
      sessionStorage.removeItem('showId')
    this.router.navigate([`${this.redirectUrl}`])
    this.activeModal.close('close')
  }

  CloseModal() {
    this.activeModal.close('close')
  }
}
