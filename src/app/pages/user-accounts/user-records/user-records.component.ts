import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/core/api.service';
import { requests } from 'src/app/core/config/config';
import { ROLES } from 'src/app/account/register/roles';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared.service';
import { UserAccountsService } from '../user-accounts.service';
import { AddUserModalComponent } from 'src/app/shared/add-user-modal/add-user-modal.component';
import { Subscription } from 'rxjs';
const FILTER_PAG_REGEX = /[^0-9]/g;
@Component({
  selector: 'app-user-records',
  templateUrl: './user-records.component.html',
  styleUrls: ['./user-records.component.scss']
})
export class UserRecordsComponent implements AfterViewInit, OnDestroy {
  users = []
  tableHeadings = []
  userStatuses = [];
  statuses = [];
  selectedItems = [];
  dropdownSettings: any = {};
  isChildActive = false;
  pagination: { pageNo: number, limit: number, offset?: number } = { limit: 100, pageNo: 1 }
  totalCount: any = 0;
  body: any
  searchName = ""
  backendHeadings = []
  Statuses = []
  selectedIndex: any = null
  clicked = true
  selectedFilter: any = null
  loader: boolean = true
  user: any
  refreshObs: Subscription

  @ViewChild('target', { static: true, read: ElementRef }) target: ElementRef;
  constructor(public modalService: NgbModal, private apiService: ApiService, private sharedService: SharedService, private userAccountService: UserAccountsService) { }
  ngOnInit() {
    this.refreshUsers()
    this.getUserRecords()
    this.getUserId()
    console.log(this.user, "USER")
    this.Statuses = [
      {
        id: 1,
        title: "Active",
        class: "approved"
      },
      {
        id: 2,
        title: "Inactive",
        class: "returned"
      },
      {
        id: 3,
        title: "Onboarding",
        class: "inprogress"
      },
    ]


    this.tableHeadings = [{ name: "User Name", order: "" }, { name: "Last Seen", order: "" }, { name: "Total Video Plays", order: "" }, { name: "Total Pauses", order: "" }, { name: "Total Ad Views", order: "" }, { name: "Total Ad Saves", order: "" }, { name: "Discovery Impressions", order: "" } ,{ name: "Retargeting Impressions", order: "" }, { name: "Email Impressions", order: "" }, { name: "Total Clicks", order: "" }, { name: "User Status", order: "" }]
    this.statuses = [
      { item_id: 3, text: 'Onboarding', class: "inprogress" },
      { item_id: 1, text: 'Active', class: "approved" },
      { item_id: 2, text: 'Inactive', class: "returned" }
    ];
    this.backendHeadings = ["fullName", "totalPlays", "pauseImpression", "adViews", "adSaves", "discoveryImpression", "retargetImpression", "emailImpression", "totalClicks", "userStatusId"]
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 1,
      enableCheckAll: false
    };

  }
  ngAfterViewInit(): void {
    console.log("View called")
    if (this.user) {
    }
  }

  getUserRecords() {
    this.user = JSON.parse(sessionStorage.getItem('user'));
    if (!this.user) {
      console.log("without session storage")
      this.body = {
        pageNo: this.pagination.pageNo,
        limit: this.pagination.limit,
        userType: ROLES.viewer,
      }
      this._fetchUserListing()
    }
    else {
      sessionStorage.removeItem('user')
      this.pagination.pageNo = this.user.pageNo
      this.body = {
        pageNo: this.pagination.pageNo,
        limit: this.pagination.limit,
        userType: ROLES.viewer,
      }
      this.totalCount = this.user?.count
      this._fetchUserListing()

    }
  }
  userClickedObs: Subscription
  getUserId() {
    this.userClickedObs = this.userAccountService.userClicked.subscribe((res => {
      if (res) {
        this.getUserRecords()
      }
    }))
  }
  scrollToElement() {
    setTimeout(() => {
      const element = document.getElementById(this.userAccountService.getUserId() + "");
      console.log(element)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  // onItemSelect(item: any,userId:number) {
  //   // console.log('onItemSelect', item);
  //   this.updateUser(item.item_id,userId)
  // }
  updateStatus($event: any, userId: number) {
    this.apiService.sendRequest(requests.updateTaggerStatus, 'post', {
      statusId: $event.id,
      userId: userId
    }).subscribe((res) => {
      // // console.log(res)
      this._fetchUserListing()
    })
  }

  closeModal(e) {
    // this.selectedIndex = null
    this.setChild(this.selectedIndex)
    if (e != 'Cancel')
      this._fetchUserListing()
    // this.clicked = !this.clicked
  }
  filterUsingStatus(item: any) {
    console.log(this.userStatuses)
    console.log(item)
    const statusIds = this.userStatuses.map(item => item.item_id)
    this.body = {
      ...this.body,
      userStatusIds: statusIds.length != 0 ? statusIds : undefined
    }
    // console.log(this.selectedFilter)
    this._fetchUserListing()
  }
  deSelectUserFilter($event) {
    this.body = {
      ...this.body,
      userStatusIds: this.userStatuses.length != 0 ? this.userStatuses.map(item => item.item_id) : undefined
    }
    // console.log(this.selectedFilter)
    this._fetchUserListing()
  }
  selectPage(page: string) {
    const tempPage = parseInt(page, 10) || 1;
    // console.log(tempPage)
    // console.log(this.totalCount / this.pagination.limit)
    if (tempPage <= Math.ceil(this.totalCount / this.pagination.limit)) {
      this.pagination.pageNo = tempPage
      this.body = {
        ...this.body,
        pageNo: this.pagination.pageNo,
        limit: this.pagination.limit,
        userType: ROLES.viewer,
      }
      this._fetchUserListing()
    }
  }
  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
  filterUsingName() {
    if (this.searchName == "")
      this.body.fullName = undefined
    else
      this.body.fullName = this.searchName
    this._fetchUserListing()
  }
  onPageChange(event: any) {
    this.pagination.pageNo = event;
    this.body = {
      ...this.body,
      pageNo: this.pagination.pageNo,
      limit: this.pagination.limit,
      userType: ROLES.viewer,
    }
    this._fetchUserListing()
  }
  setChild(index: any, id: number = 0) {
    if (this.selectedIndex != null && this.selectedIndex != index) {
      this.users[this.selectedIndex].clicked = !this.users[this.selectedIndex].clicked
      console.log(this.users[this.selectedIndex].clicked, "Index and ID")

    }
    console.log(this.selectedIndex, "Selected Index")
    this.selectedIndex = index == this.selectedIndex ? null : index;
    // console.log('onChildSelect', index);

    this.isChildActive = index;
    console.log(this.users[index].clicked, "CLICKED", id)
    this.users[index].clicked = !this.users[index].clicked
    // console.log("Selected Index", this.selectedIndex)
    if (this.users[index].clicked) {
      this.userAccountService.setUserId(id)
    }
    else {
      this.userAccountService.setUserId(0)
    }
  }
  sort(order: number, heading: number) {
    let sortingOrder = ""
    this.tableHeadings = [{ name: "User Name", order: "" }, { name: "Last Seen", order: "" }, { name: "Total Video Plays", order: "" }, { name: "Total Pauses", order: "" }, { name: "Total Ad Views", order: "" }, { name: "Total Ad Saves", order: "" }, { name: "Discovery Impressions", order: "" } ,{ name: "Retargeting Impressions", order: "" }, { name: "Email Impressions", order: "" }, { name: "Total Clicks", order: "" }, { name: "User Status", order: "" }]
    if (order == 1) {
      sortingOrder = "ASC"
      this.tableHeadings[heading].order = "ASC"
    }
    else {
      sortingOrder = "DESC"
      this.tableHeadings[heading].order = "DESC"

    }
    if (heading == 0 || heading == 6) {
      this.body.userOrder = [[this.backendHeadings[heading], sortingOrder]]
      this.body.viewerOrder = undefined
    }
    else {
      this.body.viewerOrder = [[this.backendHeadings[heading], sortingOrder]]
      this.body.userOrder = undefined
    }
    this._fetchUserListing()

  }

  // updateUser(itemId:number, userId:number){
  //   this.apiService.sendRequest(requests.updateTaggerStatus,'post',{
  //     statusId:itemId,
  //     userId:userId
  //   }).subscribe((res)=>{
  //     // // console.log(res)
  //   })
  // }
  refreshUsers() {
    this.refreshObs = this.sharedService.userAdded.subscribe((res) => {
      if (res) {
        this._fetchUserListing()
      }
    })
  }
  _fetchUserListing() {
    this.loader = true
    this.selectedItems = []
    this.users = []
    this.selectedIndex = null
    this.body={
      ...this.body,
      pageNo:this.pagination.pageNo,
      limit:this.pagination.limit
    }
    this.apiService.sendRequest(requests.getUserListing, 'post', this.body).subscribe(async (res: any) => {

      this.totalCount = res.data.count;
      this.users = await res.data.rows;
      for (let i = 0; i < this.users.length; i++) {
        this.users[i].status = { class: this.Statuses[this.users[i]?.userStatusId - 1]?.class, title: this.Statuses[this.users[i]?.userStatusId - 1]?.title }
        this.selectedItems.push(this.users[i].status)
        this.users[i].clicked = false
        if (this.users[i].id == this.userAccountService.getUserId()) {
          this.setChild(i, this.users[i].id)
          this.scrollToElement();
        }
      }
      this.loader = false
      // console.log(this.users)
      // console.log(this.selectedItems)
    })
  }
  open(content?: any) {
    const modalRef = this.modalService.open(AddUserModalComponent, {
      windowClass: "modal-lg",
      backdrop: "static",
      keyboard: false,
      centered: true,

    });
  }
  ngOnDestroy(): void {
    this.sharedService.userAdded.next(null)
    this.userAccountService.userClicked.next(null)
    this.refreshObs.unsubscribe()
    this.userClickedObs.unsubscribe()
  }
}
